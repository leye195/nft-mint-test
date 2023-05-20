import { useEffect, useState } from "react";
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

import contract, { mintTokenAddress } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import getProvider from "@/lib/web3/getProvider";
import type { Minted } from "@/types/nft";

import Flex from "@/components/Flex";
import NFTCard from "@/components/NFTCard";

const mintTokenContract = {
  address: mintTokenAddress,
  abi: contract.mintTokenAbi,
};

function Main() {
  const [mintedToken, setMintedToken] = useState<Minted | null>(null);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const { config: mintTokenConfig } = usePrepareContractWrite({
    address: mintTokenAddress,
    abi: contract.mintTokenAbi,
    functionName: "mintTestToken",
  });

  const { isLoading, write, isSuccess } = useContractWrite({
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

  useEffect(() => {
    if (!isBalanceLoading && balance) {
      console.log(balance);
    }
  }, [isBalanceLoading, balance]);

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <h1>Mint NFT Token</h1>
      {!isConnected && <button onClick={() => connect()}>Connect</button>}
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
