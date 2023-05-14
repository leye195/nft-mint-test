import {
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  usePrepareContractWrite,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";

import contract, { mintTokenAddress } from "@/lib/contracts";

function Main() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { config } = usePrepareContractWrite({
    address: mintTokenAddress,
    abi: contract.mintTokenAbi,
    functionName: "mintTestToken",
  });
  const { isLoading, write, isSuccess, data } = useContractWrite(config);

  const handleMintToken = async () => {
    write?.();
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {!isConnected && <button onClick={() => connect()}>Connect</button>}
      {isConnected && (
        <div>
          <p>{address}</p>
          <button onClick={handleMintToken} disabled={!write || isLoading}>
            Mint Token
          </button>
          <button onClick={() => disconnect()}>Disconnect</button>
          {isSuccess && <p>{JSON.stringify(data)}</p>}
        </div>
      )}
    </>
  );
}

export default Main;
