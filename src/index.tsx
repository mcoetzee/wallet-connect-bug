import ReactDOM from "react-dom/client";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

import App from "./App";
import "./index.css";

import {
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  mainnet,
  fantomTestnet,
  moonbeam,
  moonriver,
  polygon,
  polygonMumbai,
} from "wagmi/chains";

const chains = [
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  mainnet,
  fantomTestnet,
  moonbeam,
  moonriver,
  polygon,
  polygonMumbai,
];

const projectId = "a0409c24632a93df2c03f7bd1b2593df";

const { provider } = configureChains(chains, [
  jsonRpcProvider({
    rpc: (chain) => {
      return {
        http: chain.rpcUrls.default.http[0],
        webSocket: chain.rpcUrls.default.webSocket?.[0],
      };
    },
  }),
]);

export const wagmiClient = createClient({
  autoConnect: false,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  provider,
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <WagmiConfig client={wagmiClient}>
      <App />
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
);
