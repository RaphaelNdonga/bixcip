require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_KEY,
      accounts: [process.env.PRIVATE_KEY],
      vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
      keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
      linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
    }
  },
  mocha: {
    timeout: 200000
  }
};
