import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { format as ts } from 'timeago.js'
import type { LootAttrName } from '../../utils/lootTypes'
import { LootItemInfo, fetchLootItems } from '../api/loot'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // These pages are generated at build time
    paths: [
      { params: { attr: 'head' } },
      { params: { attr: 'hand' } },
      { params: { attr: 'foot' } },
      { params: { attr: 'chest' } },
    ],
    // Enable statically generating additional pages
    fallback: true,
  }
}

export async function getStaticProps(req: GetStaticPropsContext) {
  const attrName = Array.isArray ? req.params['attr'] : req.params['attr']
  let data;
  try {
    data = await fetchLootItems((attrName as LootAttrName) || 'head')
  } catch (e) {
    data = { robes: [] }
    console.error('error', e)
  }

  return {
    props: {
      attrName,
      robes: data.robes,
      lastUpdate: data.lastUpdate,
    },
    revalidate: 300,
  }
}

export interface Props {
  robes: LootItemInfo[];
  lastUpdate: string;
  attrName: string;
}

const Robe = ({ robe }: { robe: LootItemInfo }) => {
  return (
    <a href={robe.url} target="_blank">
      <div className="flex flex-col items-center justify-center w-full gap-2 p-4 pb-4 m-auto mb-8 transition-all transform bg-black border border-white md:m-4 hover:scale-105 md:w-96">
        <img src={robe.svg} />
        <div className="text-center">
          <p className="text-lg">#{robe.id}</p>
          <p>{robe.price} ETH</p>
        </div>
      </div>
    </a>
  )
}

const LootAttrFloor = ({ robes, lastUpdate, attrName }: Props) => {
  return (
    <>
      <div className="max-w-screen-md text-center md:leading-loose">
        <p className="md:text-xl">
          There are {robes?.length || '-'} bags for sale with a Divine for the {attrName || 'head'} attribute. The floor
          price is {robes?.length > 0 ? robes[0]?.price : "-" } ETH.
        </p>

        {
            robes?.length == 0 ? <div className="p-2 my-4 bg-red-800">
                Seeing 0 bags? OpenSea might be rate-limiting since an API key was unable to be secured at time of development. Try again in a bit.
            </div> : null
        }

        <p className="pt-2 md:text-lg">
          Site by{' '}
          <a
            target="_blank"
            className="underline"
            href="https://twitter.com/micksabox"
          >
            micksabox
          </a>{' '}
          forked from{' '}
          <a
            target="_blank"
            href="https://twitter.com/worm_emoji"
            className="underline"
          >
            worm_emoji
          </a>
          .
        </p>
        <p className="text-sm mv-4">Last updated {ts(lastUpdate)}</p>
      </div>
      <div className="grid pt-5 md:grid-cols-2">
        {robes && robes.map((robe) => {
          return <Robe robe={robe} key={robe.id} />
        })}
      </div>
    </>
  )
}
export default LootAttrFloor
