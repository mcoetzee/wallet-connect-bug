import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { useEffect } from "react";

export default function useChainData() {
  const { isConnected, address } = useAccount();

  const { chain } = useNetwork();
  useEffect(() => {
    console.log(">> new chain detected:", chain?.id);
  }, [chain?.id]);

  const provider = useProvider({ chainId: chain?.id });
  const { data: signer } = useSigner({ chainId: chain?.id });

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
