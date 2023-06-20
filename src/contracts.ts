import useChainData from "./chain-data";
import { useMemo } from "react";
import { ethers } from "ethers";
import abi from "./abi/abi.json";

export const useMyContract = () => {
  const { signer } = useChainData();

  return useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(
      "0x95087266018b9637aff3d76d4e0cad7e52c19636",
      abi,
      signer
    );
  }, [signer]);
};
