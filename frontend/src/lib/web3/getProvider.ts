import { ethers } from "ethers";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { polygonMumbai } from "viem/chains";

export const getProvider = () => {
  if (window.ethereum === null) {
    return null;
  }

  return new ethers.BrowserProvider(window.ethereum);
};

export const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport: http(),
});

export const walletClient = (account: Address) =>
  createWalletClient({
    account,
    chain: polygonMumbai,
    transport: custom(window.ethereum),
  });

export default getProvider;
