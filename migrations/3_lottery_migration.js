const BIXCIPLottery = artifacts.require("BIXCIPLottery");
const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");
const BIIX = artifacts.require("BIIX");
const { ethers } = require("ethers");
const fs = require("fs");

module.exports = async function (deployer) {
  const prizeMoney = ethers.utils.parseEther("0.01");
  console.log("Random number generator address: ", RandomNumberGenerator.address);
  await deployer.deploy(BIXCIPLottery, RandomNumberGenerator.address, "0x0Db28FC3d9Cd8AA96C932a9fA30940F90Eac2206");
  fs.writeFileSync(__dirname + "/../lottery-dapp/pages/blockchain/BIXCIPLotteryAbi.json", JSON.stringify(BIXCIPLottery.abi));
  fs.writeFileSync(__dirname + "/../lottery-dapp/pages/blockchain/BIXCIPLotteryAddress.json", JSON.stringify(BIXCIPLottery.address));

};
