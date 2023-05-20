import { Address } from "wagmi";
import mintTokenAbi from "./mintToken";
import saleTokenAbi from "./saleToken";

export const mintTokenAddress: Address =
  "0xCc7A340FCa3CC4623B7079fA2d1F6365a36F9ff3";
export const saleTokenAddress: Address =
  "0x65b20D4618153a09a0142188426e0d680e6D4e1E";

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
