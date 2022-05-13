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

- 1 - Migrations
- 2 - BIIX Token (TODO)
- 3 - BIIX Mint (TODO)
- 4 - Merkle distributor (TODO)
- 5 - Merkle vesting (TODO)

If the script fails before starting the deployment, you might need to run the first one, too.

## Example Response

Here is an example response after running: `$ truffle migrate --network ropsten` 

```
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'ropsten'
> Network id:      3
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x7094834eb10887c7fb27e52d57cfe3ef8b5e43e53de61445041b73440a51e377
   > Blocks: 0            Seconds: 40
   > contract address:    0x2F7a8eD9b105edcb2b005cF179ae76B2a5f503AD
   > block number:        12261551
   > block timestamp:     1652442262
   > account:             0x68A3ccD4eDDcB7c1Ac924E8b32340a6c8f5cC522
   > balance:             0.125729849748786715
   > gas used:            155222 (0x25e56)
   > gas price:           4.703748055 gwei
   > value sent:          0 ETH
   > total cost:          0.00073012518059321 ETH

   Pausing for 1 confirmations...

   -------------------------------
   > confirmation number: 1 (block: 12261552)   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.00073012518059321 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.00073012518059321 ETH
```

## Verification

For automatic verification of the source code on Etherscan you can use [truffle plugin verify](https://github.com/rkalis/truffle-plugin-verify):

```bash
truffle run verify [contractName] --network [networkName]
```