const BIXCIPLottery = artifacts.require("BIXCIPLottery");
const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");

module.exports = function (deployer) {
  deployer.deploy(BIXCIPLottery, RandomNumberGenerator.address).then(() => {
    console.log("Bixciplottery address: ", BIXCIPLottery.address);
    console.log("Bixciplottery network: ", BIXCIPLottery.networks);
    console.log("Bixciplottery abi: ", BIXCIPLottery.abi);
  });
};
