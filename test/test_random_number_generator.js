const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, network } = require("hardhat");
const { networks } = require("../hardhat.config");

describe("RandomNumberGeneratorTest", function () {
    let RandomNumberGenerator;
    let acc1;
    let acc2;
    this.beforeEach(async function () {
        const RandomNumberGeneratorFactory = await ethers.getContractFactory("RandomNumberGenerator");
        const networkName = network.name
        RandomNumberGenerator = await RandomNumberGeneratorFactory.deploy(
            networks[networkName].vrfCoordinator,
            networks[networkName].keyHash,
            3
        );
        await RandomNumberGenerator.deployed();
        [acc1, acc2] = await ethers.getSigners();
    })
    it("Should generate a subscription id", async () => {
        let subscriptionId = await RandomNumberGenerator.getSubscriptionId();
        console.log("SubscriptionId: ", subscriptionId);
        let bigSubscriptionId = new BigNumber.from(subscriptionId);
        let bigZero = new BigNumber.from(0);
        let exists = bigSubscriptionId.gt(bigZero);
        expect(exists).to.equal(true);
    })
})