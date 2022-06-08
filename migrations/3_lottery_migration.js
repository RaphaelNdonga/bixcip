const BIXCIPLottery = artifacts.require("BIXCIPLottery");
const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(BIXCIPLottery, RandomNumberGenerator.address).then(() => {
    fs.copyFile("/home/raphael/blockchain/bixcip-lottery/build/contracts/BIXCIPLottery.json", "/home/raphael/blockchain/bixcip-lottery/lottery-dapp/blockchain/BIXCIPLottery.json", (err) => {
      if (err) {
        console.log("Error occurred while copying file")
        throw err
      }
      console.log("File copied successfully");
    })
    console.log("Bixciplottery address: ", BIXCIPLottery.address);
    console.log("Bixciplottery network: ", BIXCIPLottery.networks);
    console.log("Bixciplottery abi: ", BIXCIPLottery.abi);
  });
};
