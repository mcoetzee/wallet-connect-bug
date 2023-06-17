import { useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useNetwork, useSwitchNetwork, useBalance, useDisconnect } from "wagmi";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import useChainData from "./chain-data";
import "./App.css";

export default function App() {
  const { chainId, isConnected, userAccount } = useChainData();
  const { open } = useWeb3Modal();

  const { disconnect } = useDisconnect();

  const [infiniteLoopEnabled, setInfiniteLoopEnabled] = useState(false);

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
          <AccountPopover />
          <button
            type="button"
            className="dropdown-item"
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </button>

          <hr />
          <NetworkSwitcher />

          <label>
            <input
              type="checkbox"
              checked={infiniteLoopEnabled}
              onChange={(ev) => setInfiniteLoopEnabled(ev.target.checked)}
            />
            Check this and switch network to see infinite loop
          </label>

          {/*
            This is really weird.
            If this random tooltip component is rendered, and you then switch to a different network, it triggers an infinite loop.
            */}
          {infiniteLoopEnabled && <RandomTooltip />}
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

function NetworkSwitcher() {
  const { chainId } = useChainData();
  const { chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      console.log("on switch success", data.id);
    },
  });

  return (
    <div>
      <h3>Network Switcher</h3>
      <select
        aria-label="Network"
        value={chainId}
        onChange={(ev) => {
          console.log("switching to chain:", ev.target.value);
          switchNetwork?.(Number(ev.target.value));
        }}
      >
        {chains.map((c) => {
          return (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function AccountPopover() {
  const { userAccount } = useChainData();
  const { chain } = useNetwork();
  const { data } = useBalance({ address: userAccount as `0x` });
  return (
    <div>
      <Popover.Root>
        <Popover.Trigger>
          <div className="trigger-user-info">Show Account Popover</div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content side="bottom" sideOffset={5}>
            <Popover.Arrow />
            {chain && (
              <div>
                <h5>Balance</h5>
                <div>
                  {data?.formatted ?? "-"} {chain.nativeCurrency.symbol}
                </div>
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

function RandomTooltip() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger>Show Tooltip</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>Hello</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
