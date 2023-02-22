import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
     <Head>
        <title>StreamFi</title>
        <link rel="shortcut icon" href="logo.svg" />
        <meta
          name="viewport"
          key="main"
          content="width=device-width, initial-scale=1.0"
        />
        <meta name="title" content="StreamFi" />
        <meta name="description" content="Your personal token streaming dApp" />
        <meta property="og:type" content="website" key="og-type" />
        <meta property="og:title" content="StreamFi" key="og-title" />
        <meta
          property="og:description"
          content="Your personal token streaming dApp"
          key="og-desc"
        />
        <meta
          property="og:image"
          content="https://i.postimg.cc/qBZHY9cK/streamfi-og.png"
          key="og-image"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="StreamFi" key="twt-title" />
        <meta
          property="twitter:description"
          content="Your personal token streaming dApp"
          key="twt-desc"
        />
        <meta
          property="twitter:image"
          content="https://i.postimg.cc/qBZHY9cK/streamfi-og.png"
          key="twt-img"
        />
      </Head>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
    </>
  );
}
