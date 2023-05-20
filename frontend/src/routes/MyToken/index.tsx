import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useContractRead } from "wagmi";
import { Contract, formatEther } from "ethers";

import { mintTokenContract, saleTokenContract } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import getProvider from "@/lib/web3/getProvider";
import type { Minted } from "@/types/nft";

import Flex from "@/components/Flex";
import SectionWithLabel from "@/components/SectionWithLabel";
import NFTCard from "@/components/NFTCard";

import "./mytoken.css";

type NftProps = {
  tokenId: string;
  tokenType: string;
  price: number;
};

const NFTBox = ({ tokenId, tokenType, price }: NftProps) => {
  const [isCanceling, setIsCanceling] = useState(false);
  const { address, isConnected } = useAccount();

  const handleSale = async () => {
    try {
      const provider = getProvider();

      if (!provider || !isConnected || !address) return;

      const signer = await provider.getSigner();
      const mintContract = new Contract(
        mintTokenContract.address,
        mintTokenContract.abi,
        signer
      );
      const saleContract = new Contract(
        saleTokenContract.address,
        saleTokenContract.abi,
        signer
      );

      const isApproved = await mintContract.isApprovedForAll(
        address,
        saleTokenContract.address
      );

      if (!isApproved) {
        await mintContract.setApprovalForAll(saleTokenContract.address, true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = (tokenId: string) => async () => {
    try {
      const provider = getProvider();

      if (!provider || !isConnected || !address) return;

      const signer = await provider.getSigner();
      const saleContract = new Contract(
        saleTokenContract.address,
        saleTokenContract.abi,
        signer
      );

      setIsCanceling(true);
      await saleContract.cancelOrder(tokenId);
    } catch (err) {
      console.log(err);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="nft-wrapper">
      <NFTCard key={tokenId} type={tokenType} imageSize="100%" />
      <div className="nft-sale">
        <Flex alignItems="center" justifyContent="center" height="100%">
          {price > 0 ? (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              <p className="price">{price} Matic</p>
              <button onClick={handleCancel(tokenId)} disabled={isCanceling}>
                Cancel
              </button>
            </Flex>
          ) : (
            <button onClick={handleSale}>Sale</button>
          )}
        </Flex>
      </div>
    </div>
  );
};

function MyToken() {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenList, setTokenList] = useState<Minted[]>([]);
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  useContractRead({
    ...mintTokenContract,
    functionName: "balanceOf",
    args: [address],
    watch: true,
    enabled: isConnected,
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
        const mintContract = new Contract(
          mintTokenContract.address,
          mintTokenContract.abi,
          signer
        );
        const saleContract = new Contract(
          saleTokenContract.address,
          saleTokenContract.abi,
          signer
        );

        const tokenList = [];

        for (let i = 0; i < data; i++) {
          const tokenId = convertBigIntToNumber(
            await mintContract.tokenOfOwnerByIndex(address, i)
          );
          const tokenType = convertBigIntToNumber(
            await mintContract.tokenTypes(tokenId)
          );
          const price = parseFloat(
            formatEther(
              convertBigIntToNumber(await saleContract.tokenPrices(tokenId))
            )
          );

          tokenList.push({
            tokenId,
            tokenType,
            price,
          });
        }

        setTokenList(tokenList);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected]);

  return (
    <Flex flexDirection="column" width="100%" padding="12px">
      <SectionWithLabel label="My Token">
        {isLoading && <div className="nft-loading">Loading...</div>}
        {!isLoading && tokenList.length > 0 && (
          <div className="nft-list">
            {tokenList.map(({ tokenId, tokenType, price }: Minted) => (
              <NFTBox
                key={tokenId}
                tokenId={tokenId}
                tokenType={tokenType}
                price={price ?? 0}
              />
            ))}
          </div>
        )}
      </SectionWithLabel>
    </Flex>
  );
}

export default MyToken;
