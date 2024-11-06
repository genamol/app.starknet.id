import React, { useMemo } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/UI/navbar";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import theme from "../styles/theme";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import { Analytics } from "@vercel/analytics/react";
import { StarknetIdJsProvider } from "../context/StarknetIdJsProvider";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import AcceptCookies from "../components/legal/acceptCookies";
import { Chain, sepolia, mainnet } from "@starknet-react/chains";
// Solana
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  CloverWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  SalmonWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  HuobiWalletAdapter,
  CoinbaseWalletAdapter,
  NekoWalletAdapter,
  TrustWalletAdapter,
  NightlyWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { getConnectors } from "@/utils/connectorWrapper";
require("@solana/wallet-adapter-react-ui/styles.css");

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: "https://app.posthog.com",
    session_recording: {
      recordCrossOriginIframes: true,
    },
    capture_pageleave: false,
  });
  (window as any).posthog = posthog;
}

function MyApp({ Component, pageProps }: AppProps) {
  const chains = [mainnet, sepolia]; // We support both chains so that we can detect if the user is on the wrong one
  const providers = jsonRpcProvider({
    rpc: (_chain: Chain) => ({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
    }),
  });

  const solNetwork = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
  // initialise all the wallets you want to use
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new CloverWalletAdapter(),
      new SolongWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SalmonWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new HuobiWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new NekoWalletAdapter(),
      new TrustWalletAdapter(),
      new NightlyWalletAdapter(),
    ],
    []
  );

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <StarknetConfig
              chains={chains}
              provider={providers}
              connectors={
                getConnectors() as Connector[]
                // addWalnutLogsToConnectors({
                //   connectors: getConnectors(),
                //   apiKey: process.env.NEXT_PUBLIC_WALNUT_API_KEY as string,
                // }) as any
              }
              autoConnect
            >
              <StarknetIdJsProvider>
                <ThemeProvider theme={theme}>
                  <Head>
                    <title>Starknet.id</title>
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1"
                    />
                  </Head>
                  <Navbar />
                  <AcceptCookies message="We'd love to count you on our traffic stats to ensure you get the best experience on our website !" />
                  <PostHogProvider client={posthog}>
                    <Component {...pageProps} />
                  </PostHogProvider>
                </ThemeProvider>
                <Analytics />
              </StarknetIdJsProvider>
            </StarknetConfig>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default MyApp;
