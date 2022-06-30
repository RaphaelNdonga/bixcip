const BIXCIPLottery = artifacts.require("BIXCIPLottery");
const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");
const BIIX = artifacts.require("BIIX");
const fs = require("fs");

module.exports = async function (deployer) {
  await deployer.deploy(BIXCIPLottery, RandomNumberGenerator.address, BIIX.address);
  console.log("Bixciplottery address: ", BIXCIPLottery.address);
  console.log("Bixciplottery network: ", BIXCIPLottery.networks);
  console.log("Bixciplottery abi: ", BIXCIPLottery.abi);
  fs.writeFileSync(__dirname + "/../lottery-dapp/pages/blockchain/BIXCIPLotteryAbi.json", JSON.stringify(BIXCIPLottery.abi));
  fs.writeFileSync(__dirname + "/../lottery-dapp/pages/blockchain/BIXCIPLotteryAddress.json", JSON.stringify(BIXCIPLottery.address));

};
