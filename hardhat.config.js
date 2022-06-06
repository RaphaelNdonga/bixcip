require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("hardhat-gas-reporter");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_KEY,
      accounts: [process.env.PRIVATE_KEY],
      vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
      keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
      linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
    },
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI_KEY,
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2],
      vrfCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
      keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
      linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    },
    'truffle-dashboard': {
      url: "http://localhost:24012/rpc",
      vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
      keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
      linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
    }
  },
  mocha: {
    timeout: 200000
  }
};
