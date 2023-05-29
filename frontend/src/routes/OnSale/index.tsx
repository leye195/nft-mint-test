import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { Contract, formatEther, parseEther } from "ethers";

import { mintTokenContract, saleTokenContract } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import getProvider from "@/lib/web3/getProvider";

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
      const provider = getProvider();

      if (!provider || !isConnected || isOwner || !isConnected) {
        return;
      }

      setIsBuying(true);

      const signer = await provider.getSigner();
      const saleContract = new Contract(
        saleTokenContract.address,
        saleTokenContract.abi,
        signer
      );

      await saleContract.purchaseToken(tokenId, {
        value: parseEther(price.toString()),
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
        const provider = getProvider();

        if (!provider || data === 0) return;

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

        const tokenList: OnSaleNFT[] = [];

        for (let i = 0; i < data; i++) {
          const tokenId = convertBigIntToNumber(
            await saleContract.onSaleTokenArray(i)
          );
          const tokenType = convertBigIntToNumber(
            await mintContract.tokenTypes(tokenId)
          );
          const price = parseFloat(
            formatEther(
              convertBigIntToNumber(await saleContract.getTokenPrice(tokenId))
            )
          );
          const owner: string = await mintContract.ownerOf(tokenId);

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
      }
    },
  });

  return (
    <Flex flexDirection="column" width="100%" padding="12px">
      <SectionWithLabel label={`On Sale (${data})`}>
        {onSaleList.map((token) => (
          <NFTToken {...token} key={token.tokenId} />
        ))}
      </SectionWithLabel>
    </Flex>
  );
};

export default OnSale;
