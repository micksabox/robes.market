import LootAttrFloor, { Props }  from './floor/[attr]'
import { fetchLootItems } from './api/loot'

const IndexPage = (props:Props) => {
  return (
    <>
      <LootAttrFloor  {...props} />      
    </>
  )
}

export async function getStaticProps() {
  let  data = await fetchLootItems('head');

  return {
    props: {
      robes: data.robes,
      lastUpdate: data.lastUpdate,
    },
    revalidate: 300,
  }
}

export default IndexPage
