const BIIX = artifacts.require("BIIX");
const web3 = require("web3");
const fs = require("fs");

module.exports = async (deployer, network, accounts) => {
    const initialSupply = web3.utils.toWei("5000000", "ether");
    const investorAccounts = [
        "0xF5591E14eB99aB51C10ba75DabA7d0D6345293eb",
        "0x9211cd5a0940FA9F71bcbcF1d45b0EC20Cb62A38"
    ]
    await deployer.deploy(BIIX, initialSupply, investorAccounts);
    fs.writeFileSync(__dirname + "/../lottery-dapp/pages/blockchain/BIIXAbi.json", JSON.stringify(BIIX.abi));
    fs.writeFileSync(__dirname + "/../lottery-dapp/pages/blockchain/BIIXAddress.json", JSON.stringify(BIIX.address));

};
