const BIXCIPLottery = artifacts.require("BIXCIPLottery");
const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");
const BIIX = artifacts.require("BIIX");
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(BIXCIPLottery, RandomNumberGenerator.address, BIIX.address).then(() => {
    console.log("Bixciplottery address: ", BIXCIPLottery.address);
    console.log("Bixciplottery network: ", BIXCIPLottery.networks);
    console.log("Bixciplottery abi: ", BIXCIPLottery.abi);
    fs.copyFile(__dirname + "/../build/contracts/BIXCIPLottery.json", __dirname + "/../lottery-dapp/pages/blockchain/BIXCIPLottery.json", (err) => {
      if (err) {
        console.log("Error occurred while copying Lottery file")
        throw err
      }
      console.log("Lottery File copied successfully");
    })
  });
};
