const { expect } = require("chai");
const { ethers } = require("hardhat")
const randomNumberGeneratorAddress = require("./RandomNumberGenerator.json")

describe("BIXCIP Lottery Test", function () {
    let Lottery;
    let acc1;
    let acc2;
    this.beforeAll(async () => {
        [acc1, acc2] = await ethers.getSigners();
        console.log("Accounts: ", acc1);
        const LotteryFactory = await ethers.getContractFactory("BIXCIPLottery");
        Lottery = await LotteryFactory.deploy(randomNumberGeneratorAddress.Address);
        await Lottery.deployed();
    })

    it("should allow entrance after 0.1 ether has been deposited", async () => {
        const txn = await Lottery.enter({ value: ethers.utils.parseEther("0.1") });
        await txn.wait();
        players = await Lottery.getPlayers();
        console.log(players);
        let present = false;
        for (let i = 0; i < players.length; i++) {
            if (players[i] == (acc1.address || acc2.address)) {
                present = true;
            }
        }
        expect(present).to.equal(true);
    })

    it("Should get 3 random numbers when picking a winner", async () => {
        const txn = await Lottery.pickWinner();
        await txn.wait();
        const randomNumberArray = await Lottery.getRandomNumbers();
        console.log("Random number array: ", randomNumberArray);
        expect(randomNumberArray.length).to.equal(3);
    })
})