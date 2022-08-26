# BIXCIP Lottery

This repository smart contracts (contracts) and decentralized application (DApp) for the BIXCIP lottery.

## Overview

The contracts are stored here:

- /contracts

The DApp is stored here:

- /lottery-dapp

## Requirements

To run the project you need:

- [Node.js](https://nodejs.org) development environment.
- [Truffle](https://www.trufflesuite.com/truffle) for compiling, deploying(installed globally via npm).
- [Hardhat](https://hardhat.org/) for testing.

- A file named `.env` in the root folder.

Your `.env` file must contain the following:
- Your [Etherscan API key](https://etherscan.io/myapikey) or [Polygonscan API Key](https://polygonscan.com/myapikey) for verification the source code:

  `ETHERSCAN_API_KEY='api key'` or 
  `POLYGONSCAN_API_KEY='api key'`


Your `.env` file may optionally contain the following:
- Your [Alchemy](https://dashboard.alchemyapi.io/) project Keys for deploying to Ethereum Rinkeby and or (optional) Mumbai networks:

  `ALCHEMY_RINKEBY_KEY='___your_key___'` or 
  `ALCHEMY_MUMBAI_KEY='___your_key___'`

- 2 Private Keys:
   `PRIVATE_KEY=0x___yourkey___`
   `PRIVATE_KEY2=0x___yourkey___`

- Coin market cap api key for converting eth to usd in the test gas report:
   `GAS_REPORTER_COIN_MARKET_CAP_API_KEY=`

## Tasks before usage

Pull the repository from GitHub, then install its dependencies by executing this command:

```bash
npm install
```

## Testing

Hardhat was used to test the project.

Start by testing locally. It produces the fastest result. Run the following in the terminal:
```
   npx hardhat test
```

Next, test the code on a network. If you haven't stored your private keys in a `.env` file, you can use `truffle dashboard`. Ensure dashboard is connected to `Rinkeby` network.
```
   npx hardhat test --network truffle-dashboard
```

If you had stored private keys in a `.env` file, you can use the following networks: 
mumbai, tBNB, rinkeby.
```
   npx hardhat test --network [network-name]
```

> **Note**: Whichever network you decide to use, ensure you have sufficient crypto in that network and also sufficient Link tokens. You can fetch both from this [Faucet](https://faucets.chain.link/).

## Deployment

Truffle was used for deployment.

To deploy the smart contracts to a network, replace _[networkName]_ in this command:

```bash
truffle migrate --network [networkName]
```

Networks can be configured in _truffle-config.js_. We've preconfigured the following:

- `dashboard` (for testing through truffle dashboard)
Note that truffle dashboard has been set up to use the rinkeby network.

### Note

The above procedure deploys all the contracts. If you want to deploy only specific contracts, you can run only the relevant script(s) via the below command:

```bash
truffle migrate -f [start] --to [end] --network [name]
```

Replace _[start]_ with the number of the first and _[end]_ with the number of the last migration script you wish to run. To run only one script, _[start]_ and _[end]_ should match. The numbers of the scripts are:

- 1 Migrations
- 2 Random Number Generator
- 3 BIXCIP Lottery
- 4 LinkToken

If the script fails before starting the deployment, you might need to run the first one, too.

## Verification

For automatic verification of the source code on Etherscan you can use [truffle plugin verify](https://github.com/rkalis/truffle-plugin-verify):

```bash
truffle run verify [contractName] --network [networkName]
```

## Admin Operations

Admin currently refers to the user who deployed the Lottery to the blockchain.

After verifying the source code on etherscan, you can use it to perform the following priviledged operations:

- Start the lottery
- Close the lottery
- Pick the winners
- Pay the winners

<div align="center">
      <img src="images/Screenshot from 2022-06-20 21-40-03.png" width="800px">
     </div>

### onlyAdmin Functions

BIXCIP admin or BIXCIP Treasury access to the following functions or operations:

- setTicketFee (integer) [default: 0.01 ether]
- setBixcipTreasury (address)
- setTimeFrame (integer)
- pickWinners
- startLottery
- closeLottery
- payWinners [automatically triggered after pickWinners function]

## Smart Contracts

### RandomNumberGenerator.sol
This smart contract generates random numbers using Chainlink. It generates 3 random numbers as specified in `numWords` attribute.
`requestRandomWords` generates the random numbers and `getRandomWords` fetches the random numbers from the contract.

### BIXCIPLottery.sol
This smart contract obtains random numbers from `RandomNumberGenerator.sol`. It then uses these random numbers to generate 3 random winners. It picks the winner from the players who enter the lottery. It distributes to the players all the money that was in the lottery.

## Gas Reports
### Mumbai Testnet Gas Report:
```
·------------------------------------------------|----------------------------|-------------|----------------------------·
|              Solc version: 0.8.9               ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
·················································|····························|·············|·····························
|  Methods                                       ·               21 gwei/gas                ·      1130.01 usd/eth       │
··························|······················|··············|·············|·············|··············|··············
|  Contract               ·  Method              ·  Min         ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
··························|······················|··············|·············|·············|··············|··············
|  BasicToken             ·  transfer            ·       27670  ·      71007  ·      54518  ·          32  ·       1.29  │
··························|······················|··············|·············|·············|··············|··············
|  BIXCIPLottery          ·  enter               ·           -  ·          -  ·      67892  ·           1  ·       1.61  │
··························|······················|··············|·············|·············|··············|··············
|  BIXCIPLottery          ·  payWinners          ·           -  ·          -  ·     131329  ·           1  ·       3.12  │
··························|······················|··············|·············|·············|··············|··············
|  BIXCIPLottery          ·  pickWinners         ·           -  ·          -  ·     187878  ·           1  ·       4.46  │
··························|······················|··············|·············|·············|··············|··············
|  BIXCIPLottery          ·  startLottery        ·           -  ·          -  ·      26561  ·           1  ·       0.63  │
··························|······················|··············|·············|·············|··············|··············
|  Migrations             ·  setCompleted        ·       25790  ·      45711  ·      31473  ·           4  ·       0.75  │
··························|······················|··············|·············|·············|··············|··············
|  RandomNumberGenerator  ·  requestRandomWords  ·       77538  ·      96568  ·      87053  ·           2  ·       2.07  │
··························|······················|··············|·············|·············|··············|··············
|  RandomNumberGenerator  ·  topupSubscription   ·           -  ·          -  ·      82000  ·           1  ·       1.95  │
··························|······················|··············|·············|·············|··············|··············
|  StandardToken          ·  approve             ·       24113  ·      48865  ·      45024  ·          84  ·       1.07  │
··························|······················|··············|·············|·············|··············|··············
|  StandardToken          ·  transferFrom        ·           -  ·          -  ·      77156  ·           1  ·       1.83  │
··························|······················|··············|·············|·············|··············|··············
|  Deployments                                   ·                                          ·  % of limit  ·             │
·················································|··············|·············|·············|··············|··············
|  BIIX                                          ·           -  ·          -  ·    1216176  ·      18.1 %  ·      28.86  │
·················································|··············|·············|·············|··············|··············
|  BIXCIPLottery                                 ·           -  ·          -  ·    1423860  ·      21.2 %  ·      33.79  │
·------------------------------------------------|--------------|-------------|-------------|--------------|-------------·
```

### tBNB gas report
```
·------------------------------------------------|----------------------------|-------------|----------------------------·
|              Solc version: 0.8.9               ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
·················································|····························|·············|·····························
|  Methods                                                                                                               │
··························|······················|··············|·············|·············|·············|···············
|  Contract               ·  Method              ·  Min         ·  Max        ·  Avg        ·  # calls    ·  eur (avg)   │
··························|······················|··············|·············|·············|·············|···············
|  ERC20                  ·  approve             ·       24883  ·      44848  ·      38244  ·         31  ·           -  │
··························|······················|··············|·············|·············|·············|···············
|  ERC20                  ·  transfer            ·       27936  ·      52163  ·      43664  ·         21  ·           -  │
··························|······················|··············|·············|·············|·············|···············
|  RandomNumberGenerator  ·  requestRandomWords  ·           -  ·          -  ·      84178  ·          1  ·           -  │
··························|······················|··············|·············|·············|·············|···············
|  RandomNumberGenerator  ·  topupSubscription   ·           -  ·          -  ·      66500  ·          1  ·           -  │
·-------------------------|----------------------|--------------|-------------|-------------|-------------|--------------·
```

### Local Gas Report
```
·-----------------------------------------------|----------------------------|-------------|-----------------------------·
|              Solc version: 0.8.9              ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
················································|····························|·············|······························
|  Methods                                      ·               147 gwei/gas               ·       1844.36 usd/eth       │
··························|·····················|··············|·············|·············|···············|··············
|  Contract               ·  Method             ·  Min         ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
··························|·····················|··············|·············|·············|···············|··············
|  LinkToken              ·  transfer           ·           -  ·          -  ·      51806  ·            2  ·      14.05  │
··························|·····················|··············|·············|·············|···············|··············
|  RandomNumberGenerator  ·  topupSubscription  ·           -  ·          -  ·      81605  ·            2  ·      22.12  │
··························|·····················|··············|·············|·············|···············|··············
|  Deployments                                  ·                                          ·  % of limit   ·             │
················································|··············|·············|·············|···············|··············
|  BIIX                                         ·           -  ·          -  ·    1216176  ·        4.1 %  ·     329.73  │
················································|··············|·············|·············|···············|··············
|  LinkToken                                    ·           -  ·          -  ·    1363712  ·        4.5 %  ·     369.73  │
················································|··············|·············|·············|···············|··············
|  RandomNumberGenerator                        ·           -  ·          -  ·    1192701  ·          4 %  ·     323.37  │
················································|··············|·············|·············|···············|··············
|  VRFCoordinatorV2Mock                         ·           -  ·          -  ·    2584456  ·        8.6 %  ·     700.70  │
·-----------------------------------------------|--------------|-------------|-------------|---------------|-------------·
```