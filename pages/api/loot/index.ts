import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import type { OpenseaResponse, Asset } from '../../../utils/openseaTypes'
import type { LootAttrName } from '../../../utils/lootTypes'
import ItemIdsByAttr from '../../../data/divine-ids.json'

const apiKey = process.env.OPENSEA_API_KEY

const fetchLootPage = async (ids: string[]) => {
  let url = 'https://api.opensea.io/api/v1/assets?collection=lootproject&'
  url += ids.map((id) => `token_ids=${id}`).join('&')

  const res = await fetch(url, {
    // TODO: Get OpenSea API key once their site is fixed
    // headers: {
    //   'X-API-KEY': apiKey,
    // },
  })
  const json: OpenseaResponse = await res.json()
  return json.assets
}

export interface LootItemInfo {
  id: string
  price: Number
  url: string
  svg: string
}


export const fetchLootItems = async (attributeName:LootAttrName = undefined) => {

  const chunked = chunk(ItemIdsByAttr[ attributeName || 'head' ], 20);

  const data = await pMap(chunked, fetchLootPage, { concurrency: 2 })
  const mapped = flatten(data)
    .filter((d) => {
      return (
        d &&
        d.sell_orders &&
        d.sell_orders.length > 0 &&
        d.sell_orders[0].payment_token_contract.symbol == 'ETH'
      )
    })
    .map((a: Asset): LootItemInfo => {
      return {
        id: a.token_id,
        price: Number(
          etherUtils.formatUnits(
            BigNumber.from(a.sell_orders[0]?.current_price.split('.')[0]),
          ),
        ),
        url: a.permalink + '?ref=0x44e9e84cc5e53270e38eae09120c24a0eabc3e40',
        svg: a.image_url,
      }
    })
  return {
    robes: orderBy(mapped, ['price', 'id'], ['asc', 'asc']),
    lastUpdate: new Date().toISOString(),
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const attr = Array.isArray(req.query.attribute) ? req.query.attribute[0] : req.query.attribute;
    const data = await fetchLootItems(attr as LootAttrName);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
