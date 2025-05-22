"use client";

import { NextUIProvider } from "@nextui-org/react";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  trustWallet,
  okxWallet,
  rabbyWallet,
} from "@thirdweb-dev/react";
import {
  ThirdwebStorage,
  StorageDownloader,
  IpfsUploader,
} from "@thirdweb-dev/storage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  CHAIN_ID,
  RPC_URL,
  getActiveChain,
  getSupportedChains,
} from "@/lib/constants/network";
import { PONDER_HTTP_SERVER_URL, THIRDWEB_CLIENT_ID } from "@/lib/constants";
import { GlobalStateProvider, SocketProvider } from "./GlobalState";

const gatewayUrls = {
  "ipfs://": [
    "https://cloudflare-ipfs.com/ipfs/",
    "https://gateway.ipfscdn.io/ipfs/",
    "https://ipfs.io/ipfs/",
  ],
};
const downloader = new StorageDownloader({ clientId: THIRDWEB_CLIENT_ID });
const uploader = new IpfsUploader();
const storage = new ThirdwebStorage({ uploader, downloader, gatewayUrls });

export const apolloClient = new ApolloClient({
  uri: PONDER_HTTP_SERVER_URL,
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  const activeChain = getActiveChain(CHAIN_ID);
  const supportedChains = getSupportedChains(CHAIN_ID);

  return (
    <NextUIProvider>
      <ApolloProvider client={apolloClient}>
        <GlobalStateProvider>
          <SocketProvider>
            <ThirdwebProvider
              activeChain={activeChain}
              supportedChains={supportedChains}
              clientId={THIRDWEB_CLIENT_ID}
              supportedWallets={[
                metamaskWallet(),
                coinbaseWallet(),
                trustWallet(),
                rabbyWallet(),
                okxWallet(),
              ]}
              storageInterface={storage}
              dAppMeta={{
                name: "Gopump",
                description: "Gopump",
                logoUrl: "/images/logo.png",
                url: "https://gopump.me",
                isDarkMode: true,
              }}
              sdkOptions={{
                readonlySettings: {
                  rpcUrl: RPC_URL,
                  chainId: Number(CHAIN_ID),
                },
              }}
            >
              <main className="dark relative text-foreground flex flex-col items-center min-h-[100dvh] bg-bg px-2.5 md:px-10 text-base font-normal max-w-7xl m-auto">
                <div className="absolute w-full h-full bg-cover pointer-events-none" />
                <Header />
                {children}
                <Footer />
              </main>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
            </ThirdwebProvider>
          </SocketProvider>
        </GlobalStateProvider>
      </ApolloProvider>
    </NextUIProvider>
  );
}
