const Mint = artifacts.require("MintToken");

module.exports = function (deployer) {
  deployer.deploy(Mint);
};
