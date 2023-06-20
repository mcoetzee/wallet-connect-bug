import ReactDOM from "react-dom/client";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

import App from "./App";
import "./index.css";

import { mainnet } from "wagmi/chains";

const chains = [mainnet];

const projectId = "a0409c24632a93df2c03f7bd1b2593df";

const { publicClient } = configureChains(chains, [
  jsonRpcProvider({
    rpc: (chain) => {
      return {
        http: chain.rpcUrls.default.http[0],
        webSocket: chain.rpcUrls.default.webSocket?.[0],
      };
    },
  }),
]);

export const wagmiClient = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <WagmiConfig config={wagmiClient}>
      <App />
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
);
