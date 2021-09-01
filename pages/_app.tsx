import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import Router from 'next/router';

function LootMarket({ Component, pageProps }) {

  const handleChange = (e) => {
    Router.push(`/floor/${e.target.value}`);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-3 pt-10 font-mono md:pb-0 md:w-screen">
        <h1 className="text-lg md:text-3xl">Divine Loot</h1>
        <select onChange={handleChange} defaultValue={pageProps.attrName} className="p-2 text-black">
          <option value="head">Hoodies</option>
          <option value="hand">Gloves</option>
          <option value="chest">Robes</option>
          <option value="foot">Slippers</option>
        </select>
        <Component {...pageProps} />
      </div>
      <style jsx global>
        {`
          body {
            background: #000000e0;
            color: white;
            overflow-x: hidden;
          }
        `}
      </style>
      <Head>
        <title>hoods.market</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@micksabox" />
        <meta property="og:url" content="https://hoods.market" />
        <meta property="og:title" content="hoods.market" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          property="og:description"
          content="See the floor price of Divine Loot from the Loot project."
        />
        <meta property="og:image" content="https://hoods.market/og.png" />
      </Head>
    </>
  )
}

export default LootMarket;
