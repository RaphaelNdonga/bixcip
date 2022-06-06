const BIXCIPLottery = artifacts.require("BIXCIPLottery");
const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");

module.exports = function (deployer) {
  deployer.deploy(BIXCIPLottery, RandomNumberGenerator.address);
};
