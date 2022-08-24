const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");
const ILinkToken = artifacts.require("ILinkToken");
const { networks } = require("../truffle-config");
const web3 = require("web3");

module.exports = async (deployer, network, accounts) => {
  let randomNumberGeneratorAddress;
  let LinkToken = await ILinkToken.at(networks[network].linkToken);
  await deployer.deploy(
    RandomNumberGenerator,
    networks[network].vrfCoordinator,
    networks[network].keyHash,
    networks[network].linkToken,
    3
  )
  const randomNumberGeneratorInstance = await RandomNumberGenerator.deployed();
  randomNumberGeneratorAddress = RandomNumberGenerator.address;
  console.log("Random generator address: ", randomNumberGeneratorAddress);
  console.log("Link Token Address: ", LinkToken.address)
  await LinkToken.transfer(randomNumberGeneratorAddress, web3.utils.toWei("10", "ether"));
  await randomNumberGeneratorInstance.topupSubscription(web3.utils.toWei("10", "ether"));
};
