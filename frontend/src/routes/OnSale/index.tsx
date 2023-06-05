import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { formatEther } from "ethers";
import { getContract, parseEther } from "viem";

import { mintTokenContract, saleTokenContract } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import { publicClient, walletClient } from "@/lib/web3/getProvider";

import Flex from "@/components/Flex";
import NFTCard from "@/components/NFTCard";
import SectionWithLabel from "@/components/SectionWithLabel";

import "./onsale.css";

type OnSaleNFT = {
  tokenId: string;
  tokenType: string;
  price: number;
  owner: string;
};

const NFTToken = ({ tokenId, tokenType, price, owner }: OnSaleNFT) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { address, isConnected } = useAccount();

  const handleBuy = async () => {
    try {
      if (!isConnected || isOwner || !address) {
        return;
      }

      setIsBuying(true);

      const saleContract = getContract({
        address: saleTokenContract.address,
        abi: saleTokenContract.abi,
        walletClient: walletClient(address),
      });

      await saleContract.write.purchaseToken([tokenId], {
        value: parseEther(`${price}`),
      });
    } catch (err) {
      console.log(err);
      setIsBuying(false);
    }
  };

  useEffect(() => {
    setIsOwner(address === owner);
  }, []);

  return (
    <Flex className="onsale-nft" gap="6px" flexDirection="column" padding="8px">
      <NFTCard type={tokenType} imageSize="100%" />
      <Flex flexDirection="column" width="100%" gap="4px">
        <span>TokenID: {tokenId}</span>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <b>{price} MATIC</b>
          <button
            disabled={isOwner || !isConnected || isBuying || !price}
            onClick={handleBuy}
          >
            Buy
          </button>
        </Flex>
      </Flex>
    </Flex>
  );
};

const OnSale = () => {
  const [onSaleList, setOnSaleList] = useState<OnSaleNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data } = useContractRead({
    ...saleTokenContract,
    functionName: "getOnSaleTokenArrayLength",
    watch: true,
    select: (data) => {
      let transformedData = data;

      if (typeof transformedData === "bigint") {
        transformedData = convertBigIntToNumber(transformedData);
      }

      return transformedData as number;
    },
    onSuccess: async (data) => {
      try {
        if (data === 0) return;

        const mintContract = getContract({
          address: mintTokenContract.address,
          abi: mintTokenContract.abi,
          publicClient,
        });
        const saleContract = getContract({
          address: saleTokenContract.address,
          abi: saleTokenContract.abi,
          publicClient,
        });

        const tokenList: OnSaleNFT[] = [];

        for (let i = 0; i < data; i++) {
          const tokenId = convertBigIntToNumber(
            (await saleContract.read.onSaleTokenArray([i])) as bigint
          );
          const tokenType = convertBigIntToNumber(
            (await mintContract.read.tokenTypes([tokenId])) as bigint
          );
          const price = parseFloat(
            formatEther(
              convertBigIntToNumber(
                (await saleContract.read.getTokenPrice([tokenId])) as bigint
              )
            )
          );
          const owner = (await mintContract.read.ownerOf([tokenId])) as string;

          tokenList.push({
            owner,
            tokenId,
            tokenType,
            price,
          });
        }

        setOnSaleList(tokenList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Flex flexDirection="column" width="100%" padding="12px">
      <SectionWithLabel label={`On Sale (${data ?? 0})`}>
        {isLoading ? (
          <div className="nft-loading">Loading...</div>
        ) : (
          onSaleList.map((token) => <NFTToken {...token} key={token.tokenId} />)
        )}
      </SectionWithLabel>
    </Flex>
  );
};

export default OnSale;
