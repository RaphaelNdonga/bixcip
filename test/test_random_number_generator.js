const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, network } = require("hardhat");
const { networks } = require("../hardhat.config");

describe("RandomNumberGeneratorTest", function () {
    let RandomNumberGenerator;
    let LinkToken;
    let acc1;
    let acc2;
    let vrfCoordinator;
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
            let amount = ethers.utils.parseUnits("1", "ether");
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
            let amount = ethers.utils.parseUnits("1", "ether");
            let txn = await LinkToken.transfer(RandomNumberGenerator.address, amount);
            await txn.wait();
        }
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
        console.log("Transaction: ", txn);
        console.log("Waiting for time to pass");
        if (network.name !== "hardhat")
            await new Promise(r => setTimeout(r, 60000));
        let randomNumberArray = await RandomNumberGenerator.getRandomWords();
        console.log("Random Number Array: ", randomNumberArray);
        expect(randomNumberArray.length).to.be.greaterThan(0);
    })
})