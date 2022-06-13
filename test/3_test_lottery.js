// const { expect } = require("chai");
// const { ethers } = require("hardhat")
// const randomNumberGeneratorAddress = require("./RandomNumberGenerator.json")

// describe("BIXCIP Lottery Test", function () {
    
//     let acc1;
//     let acc2;
//     this.beforeAll(async () => {
//         [acc1, acc2] = await ethers.getSigners();
//         console.log("Accounts: ", acc1);
//         const LotteryFactory = await ethers.getContractFactory("BIXCIPLottery");
//         Lottery = await LotteryFactory.deploy(randomNumberGeneratorAddress.Address);
//         await Lottery.deployed();
//     })
// })