import { LootItemInfo, fetchLootItem } from './api/robes'
import { format as ts } from 'timeago.js'

export async function getStaticProps() {
  const data = await fetchLootItem()
  return {
    props: {
      robes: data.robes,
      lastUpdate: data.lastUpdate,
    },
    revalidate: 300,
  }
}
interface Props {
  robes: LootItemInfo[]
  lastUpdate: string
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

const IndexPage = ({ robes, lastUpdate }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-3 pt-10 font-mono md:pb-0 md:w-screen">
      <h1 className="text-lg md:text-3xl">Divine Hoods</h1>
      <div className="max-w-screen-md text-center md:leading-loose">
        <p className="md:text-xl">
          There are {robes.length} bags for sale with Divine Hoods. The floor
          price is {robes[0].price} ETH.
        </p>
        <p className="pt-2 md:text-lg">
          Site by <a target="_blank" className="underline" href="https://twitter.com/micksabox">micksabox</a> forked from{' '}
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
        {robes.map((robe) => {
          return <Robe robe={robe} key={robe.id} />
        })}
      </div>
    </div>
  )
}

export default IndexPage
