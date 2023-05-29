import { Address } from "wagmi";
import mintTokenAbi from "./mintToken";
import saleTokenAbi from "./saleToken";

export const mintTokenAddress: Address =
  "0x71Baf0C20B6Fa467Abf6627A90A0638978fD12DD";
export const saleTokenAddress: Address =
  "0x4e689824d45f84C8edB59593E7Bdad69C248126b";

export const mintTokenContract = {
  address: mintTokenAddress,
  abi: mintTokenAbi,
};

export const saleTokenContract = {
  address: saleTokenAddress,
  abi: saleTokenAbi,
};

export default {
  mintTokenAbi,
  saleTokenAbi,
};
