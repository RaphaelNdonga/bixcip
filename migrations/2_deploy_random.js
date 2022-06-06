const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");
const ILinkToken = artifacts.require("ILinkToken");
const { networks } = require("../truffle-config");
const web3 = require("web3");

module.exports = async (deployer, network, accounts) => {
  let randomNumberGeneratorAddress;
  deployer.deploy(
    RandomNumberGenerator,
    networks[network].vrfCoordinator,
    networks[network].keyHash,
    networks[network].linkToken,
    3
  ).then(() => {
    randomNumberGeneratorAddress = RandomNumberGenerator.address
    console.log("Random generator address: ", randomNumberGeneratorAddress);
  });
  let LinkToken = await ILinkToken.at(networks[network].linkToken);
  console.log("Link Token Address: ", LinkToken.address)
  LinkToken.transfer(randomNumberGeneratorAddress, web3.utils.toWei("1", "ether"));
};
