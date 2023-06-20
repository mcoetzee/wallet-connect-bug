import { useAccount, useNetwork } from "wagmi";
import { useEffect } from "react";
import { useEthersProvider, useEthersSigner } from "./ethers-adapters";

export default function useChainData() {
  const { isConnected, address } = useAccount();

  const { chain } = useNetwork();
  useEffect(() => {
    console.log(">> new chain detected:", chain?.id);
  }, [chain?.id]);

  const provider = useEthersProvider({ chainId: chain?.id });
  const signer = useEthersSigner({ chainId: chain?.id });

  if (isConnected && address) {
    return {
      isConnected: true,
      provider,
      signer,
      userAccount: address,
      chainId: chain?.id,
      networkName: chain?.network || "",
    };
  }

  return {
    isConnected: false,
    provider: null,
    signer: null,
    userAccount: "",
    chainId: undefined,
    networkName: "",
  };
}
