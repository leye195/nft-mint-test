import { useState } from "react";
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { getContract } from "viem";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import contract, { mintTokenAddress, mintTokenContract } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import { publicClient } from "@/lib/web3/getProvider";
import type { Minted } from "@/types/nft";

import Flex from "@/components/Flex";
import NFTCard from "@/components/NFTCard";

function Main() {
  const [mintedToken, setMintedToken] = useState<Minted | null>(null);

  const { address, isConnected } = useAccount();
  const {
    connect,
    pendingConnector,
    isLoading: isConnecting,
  } = useConnect({
    connector: new MetaMaskConnector(),
    onError: (e) => {
      const { message } = e;

      if (message === "Connector not found") {
        pendingConnector?.disconnect();
        window.open("https://metamask.io/download.html");
      }
    },
  });

  const { config: mintTokenConfig } = usePrepareContractWrite({
    address: mintTokenAddress,
    abi: contract.mintTokenAbi,
    functionName: "mintTestToken",
  });

  const { isLoading, write, isSuccess } = useContractWrite({
    ...mintTokenConfig,
  });

  useContractRead({
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
        const contract = getContract({
          address: mintTokenContract.address,
          abi: mintTokenContract.abi,
          publicClient,
        });

        const tokenId = convertBigIntToNumber(
          (await contract.read.tokenOfOwnerByIndex([address, data - 1])) as any
        );

        const tokenType = convertBigIntToNumber(
          (await contract.read.tokenTypes([tokenId])) as any
        );

        setMintedToken({
          tokenId,
          tokenType,
        });
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

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <h1>Mint NFT Token</h1>
      {!isConnected && (
        <button
          onClick={() => connect()}
          disabled={!!pendingConnector?.id && isConnecting}
        >
          Connect Metamask
        </button>
      )}
      {isConnected && (
        <Flex flexDirection="column" alignItems="center">
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
          </Flex>
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              marginTop: "20px",
              fontWeight: 800,
            }}
          >
            {isSuccess && mintedToken && (
              <Flex flexDirection="column" alignItems="center">
                <NFTCard type={mintedToken.tokenType} imageSize="200px" />
                <p>TokenID: {mintedToken.tokenId}</p>
              </Flex>
            )}
          </div>
        </Flex>
      )}
    </Flex>
  );
}

export default Main;
