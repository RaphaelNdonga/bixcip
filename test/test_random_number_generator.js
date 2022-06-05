const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, network } = require("hardhat");
const { networks } = require("../hardhat.config");

describe("RandomNumberGeneratorTest", function () {
    let RandomNumberGenerator;
    let LinkToken;
    let acc1;
    let acc2;
    this.beforeEach(async function () {
        const RandomNumberGeneratorFactory = await ethers.getContractFactory("RandomNumberGenerator");
        const networkName = network.name
        RandomNumberGenerator = await RandomNumberGeneratorFactory.deploy(
            networks[networkName].vrfCoordinator,
            networks[networkName].keyHash,
            networks[networkName].linkToken,
            3
        );
        await RandomNumberGenerator.deployed();
        console.log("Random Number Generator address: ", RandomNumberGenerator.address)
        [acc1, acc2] = await ethers.getSigners();
        LinkToken = await ethers.getContractAt("ILinkToken", networks[networkName].linkToken);
        let amount = ethers.utils.parseUnits("1", "ether");
        await LinkToken.transfer(RandomNumberGenerator.address, amount)
    })
    it("Should have 1 link", async () => {
        let contractBalance = await LinkToken.balanceOf(RandomNumberGenerator.address);
        console.log("Contract balance: ", contractBalance);
        let bigContractBalance = new BigNumber.from(contractBalance);
        let bigZero = new BigNumber.from(0);
        let exists = bigContractBalance.gt(bigZero);
        expect(exists).to.equal(true)

    })
    it("Should send 1 link to the VRF Coordinator", async () => {
        let amount = ethers.utils.parseUnits("1", "ether");
        let txn = await RandomNumberGenerator.topupSubscription(amount);
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
        console.log("Transaction: ", txn);
        console.log("Waiting for time to pass");
        await new Promise(r => setTimeout(r, 180000));
        let randomNumberArray = await RandomNumberGenerator.getRandomWords();
        console.log("Random Number Array: ", randomNumberArray);
        expect(randomNumberArray.length).to.be.greaterThan(0);
    })
})