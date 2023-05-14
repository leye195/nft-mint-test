import { ethers } from "ethers";

const getProvider = () => {
  if (window.ethereum === null) {
    return null;
  }

  return new ethers.BrowserProvider(window.ethereum);
};

export default getProvider;
