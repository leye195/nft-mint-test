const Mint = artifacts.require("MintToken");
const Sale = artifacts.require("SaleToken");

module.exports = async function (deployer) {
  await deployer.deploy(Mint);
  const mint = await Mint.deployed();

  await deployer.deploy(Sale, mint.address);
  // await deployer.deploy(Sale(mint.address));
};
