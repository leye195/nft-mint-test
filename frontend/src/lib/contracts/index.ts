import { Address } from "wagmi";
import mintTokenAbi from "./mintToken";
import saleTokenAbi from "./saleToken";

export const mintTokenAddress: Address =
  "0xDDBb3C201FFb00e33AAA46DC310b38A32bc451e8";
export const saleTokenAddress: Address =
  "0x004E347Cb52314937d99dAdE20557Cc7297F4437";

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
