const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, network, waffle } = require("hardhat");
const { networks } = require("../hardhat.config");
const fs = require("fs").promises;

describe("End to End Lottery Smart Contracts Test", function () {
    let RandomNumberGenerator;
    let LinkToken;
    let acc1;
    let acc2;
    let vrfCoordinator;
    let Lottery;
    this.beforeAll(async function () {
        [acc1, acc2] = await ethers.getSigners();
        const RandomNumberGeneratorFactory = await ethers.getContractFactory("RandomNumberGenerator");
        const networkName = network.name
        console.log("Network name: ", networkName)
        if (networkName == "hardhat") {
            const vrfCoordinatorFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
            vrfCoordinator = await vrfCoordinatorFactory.deploy(0, 0);
            await vrfCoordinator.deployed();

            const LinkFactory = await ethers.getContractFactory("LinkToken");
            LinkToken = await LinkFactory.deploy();
            await LinkToken.deployed()
            console.log("Link Token address: ", LinkToken.address)
            RandomNumberGenerator = await RandomNumberGeneratorFactory.deploy(
                vrfCoordinator.address,
                "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
                LinkToken.address,
                3
            );
            await RandomNumberGenerator.deployed();
            let amount = ethers.utils.parseUnits("10", "ether");
            let txn = await LinkToken.transfer(RandomNumberGenerator.address, amount);
            await txn.wait();
        } else {
            RandomNumberGenerator = await RandomNumberGeneratorFactory.deploy(
                networks[networkName].vrfCoordinator,
                networks[networkName].keyHash,
                networks[networkName].linkToken,
                3
            );
            await RandomNumberGenerator.deployed();
            console.log("Random Number Generator address: ", RandomNumberGenerator.address);
            LinkToken = await ethers.getContractAt("ILinkToken", networks[networkName].linkToken);
            let amount = ethers.utils.parseUnits("10", "ether");
            let txn = await LinkToken.transfer(RandomNumberGenerator.address, amount);
            await txn.wait();
        }
        [acc1, acc2] = await ethers.getSigners();
        const investors = [acc1.address, acc2.address];
        console.log("Investors: ", investors);
        const LotteryFactory = await ethers.getContractFactory("BIXCIPLottery");
        const prizeMoney = ethers.utils.parseEther("0.01");
        console.log("The prize money is: ", prizeMoney);
        Lottery = await LotteryFactory.deploy(RandomNumberGenerator.address, prizeMoney);
        await Lottery.deployed();
    })
    it("Should have 1 link", async () => {
        let contractBalance = await LinkToken.balanceOf(RandomNumberGenerator.address);
        console.log("Contract balance: ", contractBalance);
        let bigContractBalance = new BigNumber.from(contractBalance);
        let bigZero = new BigNumber.from(0);
        let exists = bigContractBalance.gt(bigZero);
        expect(exists).to.equal(true)

    })
    it("Should send 10 link to the VRF Coordinator", async () => {
        let amount = ethers.utils.parseUnits("10", "ether");
        let txn = await RandomNumberGenerator.topupSubscription(amount);
        await txn.wait();
        let subscriptionBalance = await RandomNumberGenerator.getSubscriptionBalance();
        let bigBalance = new BigNumber.from(subscriptionBalance);
        console.log("Subscription balance: ", bigBalance)
        let bigZero = new BigNumber.from(0);
        let exists = bigBalance.gt(bigZero);
        expect(exists).to.equal(true);

    })
    it("Should generate a subscription id", async () => {
        let subscriptionId = await RandomNumberGenerator.getSubscriptionId();
        console.log("SubscriptionId: ", subscriptionId);
        let bigSubscriptionId = new BigNumber.from(subscriptionId);
        let bigZero = new BigNumber.from(0);
        let exists = bigSubscriptionId.gt(bigZero);
        expect(exists).to.equal(true);
    })
    it("Should generate 3 random numbers on request", async () => {
        const txn = await RandomNumberGenerator.requestRandomWords();
        await txn.wait();
        console.log("Waiting for time to pass");
        if (network.name !== "hardhat")
            await new Promise(r => setTimeout(r, 60000));
        let randomNumberArray = await RandomNumberGenerator.getRandomWords();
        console.log("Random Number Array: ", randomNumberArray);
        expect(randomNumberArray.length).to.be.greaterThan(0);
    })
    it("should allow entrance after ether ticket fee has been deposited", async () => {
        let bets = [1, 2, 3];
        let ticketFee = new BigNumber.from(await Lottery.getTicketFee());
        console.log("ticket fee: ", ticketFee);
        let finalFee = ticketFee.mul(bets.length);
        console.log("final fee", finalFee);
        const txn = await Lottery.enter(bets, {
            value: finalFee
        });
        await txn.wait();
        players = await Lottery.getPlayers();
        console.log(players);
        let present = false;
        for (let i = 0; i < players.length; i++) {
            if (players[i] == (acc1.address || acc2.address)) {
                present = true;
            }
        }
        const balance = new BigNumber.from(await waffle.provider.getBalance(Lottery.address));

        console.log("contract balance: ", balance);

        expect(balance >= ticketFee);
        expect(present).to.equal(true);
    })

    it("should append new bets after previous ones have been made", async () => {
        const currentBets = await Lottery.getPlayerBets(acc1.address);
        console.log("current bets: ", currentBets);
        const ticketFee = new BigNumber.from(await Lottery.getTicketFee());
        const finalFee = ticketFee.mul(3);
        const txn = await Lottery.enter([4, 5, 6], {
            value: finalFee
        });
        await txn.wait();
        const newBets = await Lottery.getPlayerBets(acc1.address);
        console.log("new bets", newBets);
        expect(currentBets.length < newBets.length);

    })

    it("Should get 3 random numbers when picking a winner", async () => {
        const txn = await Lottery.pickWinners();
        await txn.wait();
        const randomNumberArray = await Lottery.getRandomNumbers();
        console.log("Random number array: ", randomNumberArray);
        expect(randomNumberArray.length).to.equal(3);
    })

    it("Should pay the winners accordingly", async () => {
        const initialBalance = await waffle.provider.getBalance(acc1.address);
        console.log("initial balance", initialBalance);
        const txn = await Lottery.payWinners();
        await txn.wait();
        const finalBalance = await waffle.provider.getBalance(acc1.address);
        console.log("final balance", finalBalance);

        const isGreater = finalBalance.gt(initialBalance)

        expect(isGreater).to.equal(true);
    })

    it("should append new wins", async () => {
        const playerWins = await Lottery.getPlayerWins(acc1.address);
        console.log("previous wins: ", playerWins);
        expect(playerWins.length).to.be.greaterThan(0);
    })

    it("Should set the correct enum state", async () => {
        const open = 0;
        const closed = 1;
        let lotteryState = await Lottery.getLotteryState();
        console.log(lotteryState);
        expect(lotteryState).to.equal(closed);
        const txn = await Lottery.startLottery();
        await txn.wait();
        lotteryState = await Lottery.getLotteryState();
        console.log(lotteryState);
        expect(lotteryState).to.equal(open)

    })
})

