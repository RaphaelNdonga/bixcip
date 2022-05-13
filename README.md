# BIXCIP Smart Contracts

The smart contracts in this repository will be used by BIXCIP.

## Requirements

To run the project you need:

- [Node.js](https://nodejs.org) development environment.
- [Truffle](https://www.trufflesuite.com/truffle) for compiling, deploying and testing (installed globally via npm).
- (optional) [Ganache](https://www.trufflesuite.com/ganache) for local testing (installed globally via npm).
- A file named `.env`

Your `.env` file should contain the following:

- Your 12-word MetaMask seedphrase for deploying:
  `MNEMONIC='seedphrase'`
- Your [Infura](https://infura.io) project ID for deploying to Ethereum networks:
  `INFURA_ID='id'`
- Your [Etherscan API key](https://etherscan.io/myapikey) for verification the source code:
  `ETHERSCAN_API_KEY='api key'`