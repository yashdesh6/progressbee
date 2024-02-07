import "@/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import { Head } from "next/head";

export default function App({ Component, pageProps }) {
  return (
    
    <ChakraProvider>

      <Component {...pageProps} />
    </ChakraProvider>
  );
}
