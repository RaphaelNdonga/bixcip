const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat")

describe("RandomNumberGeneratorTest", function () {
    let RandomNumberGenerator;
    let acc1;
    let acc2;
    this.beforeEach(async function () {
        const RandomNumberGeneratorFactory = await ethers.getContractFactory("RandomNumberGenerator");
        RandomNumberGenerator = await RandomNumberGeneratorFactory.deploy(
            "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
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