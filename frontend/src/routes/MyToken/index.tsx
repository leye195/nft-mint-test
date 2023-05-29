import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAccount, useContractRead } from "wagmi";
import { Contract, formatEther, parseEther } from "ethers";

import { mintTokenContract, saleTokenContract } from "@/lib/contracts";
import convertBigIntToNumber from "@/lib/web3/bigIntToNumber";
import getProvider from "@/lib/web3/getProvider";
import type { Minted } from "@/types/nft";

import Flex from "@/components/Flex";
import SectionWithLabel from "@/components/SectionWithLabel";
import NFTCard from "@/components/NFTCard";
import Input from "@/components/Input";
import Modal from "@/components/Modal";

import "./mytoken.css";

type NftProps = {
  tokenId: string;
  tokenType: string;
  price: number;
};

const NFTBox = ({ tokenId, tokenType, price }: NftProps) => {
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { register, watch, setValue } = useForm<{ sellPrice: string }>({
    mode: "onChange",
  });
  const { sellPrice = "" } = watch();

  const handleSale = (tokenId: string) => async () => {
    try {
      const provider = getProvider();

      if (!provider || !isConnected || !address) return;

      setIsSelling(true);

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

      const tx = await saleContract.setForSaleToken(
        tokenId,
        parseEther(sellPrice)
      );

      if (tx.hash) {
        setValue("sellPrice", "");
        handleOpen(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSelling(false);
    }
  };

  const handleOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
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
      setIsCanceling(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setValue("sellPrice", "");
    }
  }, [isOpen]);

  useEffect(() => {
    setIsCanceling(false);
  }, [price]);

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
            <button onClick={() => handleOpen(true)} disabled={isSelling}>
              Sell
            </button>
          )}
        </Flex>
      </div>
      <Modal
        isOpen={isOpen}
        handleOpen={handleOpen}
        headerTitle="Sale Token"
        padding="24px 24px 32px 24px"
        isHideClose
      >
        <Flex flexDirection="column" gap="18px">
          <Flex flexDirection="column" width="100%">
            <label
              style={{
                fontSize: "18px",
              }}
            >
              Price
            </label>
            <Input
              {...register("sellPrice", {
                validate: (value) => +value > 0,
                onChange: (e) => {
                  const { value } = e.target;
                  const replacedValue = value.replace(
                    /[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣`~!@#$%^&*()\-_=+\\|[\]{};:'",.<>/\s]/g,
                    ""
                  );
                  const parsedNumber = Number(replacedValue);

                  if (replacedValue && !isNaN(parsedNumber)) {
                    setValue("sellPrice", parsedNumber.toString());
                    return;
                  }

                  setValue("sellPrice", "");
                },
              })}
              placeholder="0"
              inputMode="numeric"
              autoComplete="off"
              value={sellPrice}
            />
          </Flex>
          <Flex gap="4px" width="100%">
            <button
              style={{
                flex: 1,
              }}
              onClick={handleSale(tokenId)}
              disabled={!sellPrice || +sellPrice === 0 || isSelling}
            >
              Confirm
            </button>
            <button
              style={{
                flex: 1,
              }}
              onClick={() => handleOpen(false)}
            >
              Cancel
            </button>
          </Flex>
        </Flex>
      </Modal>
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

        if (!provider || data === 0) return;

        const signer = await provider.getSigner();
        const mintContract = new Contract(
          mintTokenContract.address,
          mintTokenContract.abi,
          signer
        );

        const tokens = await mintContract.getTokens(address);

        const tokenList = tokens.map((token: Minted) => {
          const tokenId = convertBigIntToNumber(token.tokenId);
          const tokenType = convertBigIntToNumber(token.tokenType);
          const price = parseFloat(
            formatEther(convertBigIntToNumber(token.price ?? 0))
          );
          return {
            tokenId,
            tokenType,
            price,
          };
        });

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
