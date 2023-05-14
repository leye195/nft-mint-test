import { useEffect } from "react";
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useDisconnect,
  usePrepareContractWrite,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Contract } from "ethers";

import reactLogo from "@/assets/react.svg";
import contract, { mintTokenAddress } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import getProvider from "@/lib/web3/getProvider";
import viteLogo from "/vite.svg";

import Flex from "@/components/Flex";

const mintTokenContract = {
  address: mintTokenAddress,
  abi: contract.mintTokenAbi,
};

function Main() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const { config: mintTokenConfig } = usePrepareContractWrite({
    address: mintTokenAddress,
    abi: contract.mintTokenAbi,
    functionName: "mintTestToken",
  });

  const { isLoading, write, isSuccess, data } = useContractWrite({
    ...mintTokenConfig,
  });

  const { data: balance, isLoading: isBalanceLoading } = useContractRead({
    ...mintTokenContract,
    functionName: "balanceOf",
    args: [address],
    watch: true,
    enabled: isConnected && isSuccess,
    select: (data) => {
      let transformedData = data;

      if (typeof transformedData === "bigint") {
        transformedData = convertBigIntToNumber(transformedData);
      }

      return transformedData as number;
    },
    onSuccess: async (data) => {
      try {
        const provider = getProvider();

        if (!provider) return null;

        const signer = await provider.getSigner();
        const contract = new Contract(
          mintTokenContract.address,
          mintTokenContract.abi,
          signer
        );

        const tokenId = convertBigIntToNumber(
          await contract.tokenOfOwnerByIndex(address, data - 1)
        );

        const tokenType = convertBigIntToNumber(
          await contract.tokenTypes(tokenId)
        );

        console.log("tokenType:", tokenType, tokenId);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleMintToken = async () => {
    try {
      write?.();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isBalanceLoading && balance) {
      console.log(balance);
    }
  }, [isBalanceLoading, balance]);

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
          <p>Address: {address}</p>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="8px"
          >
            <button onClick={handleMintToken} disabled={!write || isLoading}>
              Mint Token
            </button>
            <button onClick={() => disconnect()}>Disconnect</button>
          </Flex>

          {isSuccess && <p>{JSON.stringify(data)}</p>}
        </div>
      )}
    </>
  );
}

export default Main;
