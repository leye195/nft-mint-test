import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useContractRead } from "wagmi";
import { Contract } from "ethers";

import { mintTokenContract } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import getProvider from "@/lib/web3/getProvider";
import type { Minted } from "@/types/nft";

import Flex from "@/components/Flex";
import SectionWithLabel from "@/components/SectionWithLabel";
import NFTCard from "@/components/NFTCard";

import "./mytoken.css";

function MyToken() {
  const [tokenList, setTokenList] = useState<Minted[]>([]);
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  const { isLoading, isSuccess } = useContractRead({
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
        const contract = new Contract(
          mintTokenContract.address,
          mintTokenContract.abi,
          signer
        );

        const tokenList = [];

        for (let i = 0; i < data; i++) {
          const tokenId = convertBigIntToNumber(
            await contract.tokenOfOwnerByIndex(address, i)
          );
          const tokenType = convertBigIntToNumber(
            await contract.tokenTypes(tokenId)
          );

          tokenList.push({
            tokenId,
            tokenType,
          });
        }

        setTokenList(tokenList);
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, []);

  return (
    <Flex flexDirection="column" width="100%" padding="12px 4px">
      <SectionWithLabel label="My Token">
        {isLoading && tokenList.length === 0 && "Loading..."}
        {isSuccess && (
          <div className="nft-list">
            {[...tokenList, ...tokenList, ...tokenList].map(
              ({ tokenType }: Minted) => (
                <NFTCard type={tokenType} imageSize="100%" />
              )
            )}
          </div>
        )}
      </SectionWithLabel>
    </Flex>
  );
}

export default MyToken;
