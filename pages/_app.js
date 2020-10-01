import Head from "next/head";
import React from "react";

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>{pageProps.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.3.1/css/uikit.min.css"
          integrity="sha256-FIboc2EoNdI/QieXBLURbYkUxPX/3bTuWY+47MvExa0="
          crossOrigin="anonymous"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.3.1/js/uikit.min.js"
          integrity="sha256-BFNbmKG9T7WEBxVHWyG/qzPPzZf8autYd2b0Eytgv7A="
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.3.1/js/uikit-icons.min.js"
          integrity="sha256-pXt2XY/xp6QmXUIQYxlCfOTWCV8UBJmpJtHn1NheTHU="
          crossOrigin="anonymous"
        ></script>
        <link rel="stylesheet" type="text/css" href="/print.css" media="print"/>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
