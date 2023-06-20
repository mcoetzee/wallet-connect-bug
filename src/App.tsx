import { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useDisconnect } from "wagmi";
import { ethers } from "ethers";
import useChainData from "./chain-data";
import { useMyContract } from "./contracts";
import "./App.css";

export default function App() {
  const { chainId, isConnected, userAccount } = useChainData();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const [staked, setStaked] = useState<string | null>(null);

  const contract = useMyContract();
  useEffect(() => {
    if (contract && userAccount) {
      contract?.getUserStakingData(userAccount).then((data: any) => {
        console.log(data?.userStaked?.toString());
        setStaked(data?.userStaked?.toString());
      });
    }
  }, [contract, userAccount]);

  return (
    <div className="App">
      <h1>App {isConnected ? "(Connected)" : "(Not connected)"}</h1>
      <div>
        <small>Chain Id: {chainId}</small>
      </div>
      <div>
        <small>Account: {userAccount}</small>
      </div>
      {isConnected ? (
        <>
          <button
            type="button"
            className="dropdown-item"
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </button>
          <h3>Staked</h3>
          <div>{staked && ethers.utils.formatEther(staked)}</div>
        </>
      ) : (
        <button
          onClick={async () => {
            await open();
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}
