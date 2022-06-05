# BIXCIP Lottery

This repository smart contracts (contracts) and decentralized application (DApp) for the BIXCIP lottery.

## Overview

The contracts are stored here:

- /contracts
- /lottery-dapp/blockchain/contracts

The DApp is stored here:

- /lottery-dapp

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

## Tasks before deployment, usage

Pull the repository from GitHub, then install its dependencies by executing this command:

```bash
npm install
```

## Deployment

To deploy the smart contracts to a network, replace _[networkName]_ in this command:

```bash
truffle migrate --network [networkName]
```

Networks can be configured in _truffle-config.js_. We've preconfigured the following:

- `development` (for local testing)
- `ethereum` (Ethereum Mainnet)
- `goerli` (Görli Ethereum Testnet)
- `kovan` (Kovan Ethereum Testnet)
- `ropsten` (Ropsten Ethereum Testnet)
- `bsc` (Binance Smart Chain)
- `bsctest` (Binance Smart Chain Testnet)
- `polygon` (Polygon Mainnet (formerly Matic))
- `mumbai` (Matic Mumbai Testnet)

### Note

The above procedure deploys all the contracts. If you want to deploy only specific contracts, you can run only the relevant script(s) via the below command:

```bash
truffle migrate -f [start] --to [end] --network [name]
```

Replace _[start]_ with the number of the first and _[end]_ with the number of the last migration script you wish to run. To run only one script, _[start]_ and _[end]_ should match. The numbers of the scripts are:

- 1 Migrations
- 2 BIXCIP Token $BIIX
- 3 Lottery
- 4 $BIIX Mint (TODO)
- 5 Merkle distributor (TODO)
- 6 Merkle vesting (TODO)

If the script fails before starting the deployment, you might need to run the first one, too.

### Initial Migration

Here is an example response after running: `$ truffle migrate -f 1 --to 1 --network rinkeby`

```
Compiling your contracts...
===========================
> Compiling ./contracts/token/BIXCIPLottery.sol
> Compiling ./contracts/token/BIXCIPToken.sol
> Artifacts written to /Users/skurilyak/dev/phoenixteam/bixcip/bixcip-lottery/build/contracts
> Compiled successfully using:
   - solc: 0.8.11+commit.d7f03943.Emscripten.clang


Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 29970705 (0x1c95111)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x5ca4e2dc7ed1a4c58f7cb7529ac8e74623d6b576c1c14d24ad5f15fccfe6b782
   > Blocks: 0            Seconds: 0
   > contract address:    0xCd3277033DEDb76919cA79E4d14821cd5A67EaCD
   > block number:        10723618
   > block timestamp:     1653270583
   > account:             0x68A3ccD4eDDcB7c1Ac924E8b32340a6c8f5cC522
   > balance:             0.288061917908292935
   > gas used:            155210 (0x25e4a)
   > gas price:           2.50000001 gwei
   > value sent:          0 ETH
   > total cost:          0.0003880250015521 ETH

   Pausing for 2 confirmations...

   -------------------------------
   > confirmation number: 1 (block: 10723619)
   > confirmation number: 2 (block: 10723620)
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.0003880250015521 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.0003880250015521 ETH
```

This step creates two transactions which can be viewed on Etherscan: 

1. [0x5ca4e2dc7ed1a4c58f7cb7529ac8e74623d6b576c1c14d24ad5f15fccfe6b782](https://rinkeby.etherscan.io/tx/0x5ca4e2dc7ed1a4c58f7cb7529ac8e74623d6b576c1c14d24ad5f15fccfe6b782)
2. [0x6ed0db4f9af0cd1994d370e8da7ccdcc73a3999fd6f6cafde1a63d52404fa996](https://rinkeby.etherscan.io/tx/0x6ed0db4f9af0cd1994d370e8da7ccdcc73a3999fd6f6cafde1a63d52404fa996)

### Deploy Token

Here is an example response after running: `$ truffle migrate -f 2 --to 2 --network rinkeby`

```
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 30000000 (0x1c9c380)


2_deploy_token.js
=================

   Deploying 'BIXCIPToken'
   -----------------------
   > transaction hash:    0x279fcd40b332dbb9f1643beedb47c3122ce25000545e96b5e8d5ef08dc55b266
   > Blocks: 0            Seconds: 12
   > contract address:    0x28d52924B178DaC365AF54E7677072e71eA1C9A1
   > block number:        10723629
   > block timestamp:     1653270748
   > account:             0x68A3ccD4eDDcB7c1Ac924E8b32340a6c8f5cC522
   > balance:             0.285310602897287675
   > gas used:            1054836 (0x101874)
   > gas price:           2.50000001 gwei
   > value sent:          0 ETH
   > total cost:          0.00263709001054836 ETH

   Pausing for 2 confirmations...

   -------------------------------
   > confirmation number: 1 (block: 10723630)
   > confirmation number: 2 (block: 10723631)
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.00263709001054836 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.00263709001054836 ETH
```

This step creates one transaction which can be viewed on Etherscan: 

1. [0x266560364b8dec6b18e0c0a8b0496d440d22e13d0eb47c2a409f8ed503464b51](https://rinkeby.etherscan.io/tx/0x266560364b8dec6b18e0c0a8b0496d440d22e13d0eb47c2a409f8ed503464b51)

### Lottery Migration

```
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 30000000 (0x1c9c380)


3_lottery_migration.js
======================

   Deploying 'BIXCIPLottery'
   -------------------------
   > transaction hash:    0xa2cd448d8eb92c9993bc42e5bbc7f68c6d10b6c0f0e1d776e9e9b25229f6ce60
   > Blocks: 1            Seconds: 16
   > contract address:    0xea0034256127D938E6409011C8c06386B1C2f84a
   > block number:        10723652
   > block timestamp:     1653271093
   > account:             0x68A3ccD4eDDcB7c1Ac924E8b32340a6c8f5cC522
   > balance:             0.283482912889919735
   > gas used:            702486 (0xab816)
   > gas price:           2.50000001 gwei
   > value sent:          0 ETH
   > total cost:          0.00175621500702486 ETH

   Pausing for 2 confirmations...

   -------------------------------
   > confirmation number: 1 (block: 10723653)
   > confirmation number: 2 (block: 10723654)
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.00175621500702486 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.00175621500702486 ETH
```

This step creates one transaction which can be viewed on Etherscan: 

1. [0xa2cd448d8eb92c9993bc42e5bbc7f68c6d10b6c0f0e1d776e9e9b25229f6ce60](https://rinkeby.etherscan.io/tx/0xa2cd448d8eb92c9993bc42e5bbc7f68c6d10b6c0f0e1d776e9e9b25229f6ce60)

## Verification

For automatic verification of the source code on Etherscan you can use [truffle plugin verify](https://github.com/rkalis/truffle-plugin-verify):

```bash
truffle run verify [contractName] --network [networkName]
```

## Smart Contracts
### RandomNumberGenerator.sol
This smart contract generates random numbers using Chainlink. It generates 3 random numbers as specified in `numWords` attribute.
`requestRandomWords` generates the random numbers and `getRandomWords` fetches the random numbers from the contract.

`BIXCIPLottery.sol` will use this smart contract to obtain random winners of the lottery.