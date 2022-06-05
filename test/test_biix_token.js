const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("BIIX Token test", function () {
    let BIIXContract;
    let acc1;
    let acc2;
    this.beforeAll(async () => {
        const BIIXContractFactory = await ethers.getContractFactory("BIIX");
        [acc1, acc2] = await ethers.getSigners();
        const investors = [acc1.address, acc2.address];
        BIIXContract = await BIIXContractFactory.deploy(
            ethers.utils.parseUnits("5000000", "ether"),
            investors
        );
        await BIIXContract.deployed();
    })
    it("should have total supply of 5000000", async () => {
        let totalSupply = await BIIXContract.totalSupply();
        expect(totalSupply).to.equal(ethers.utils.parseUnits("5000000", "ether"));
    })
    it("should distribute supply among investors", async () => {
        let acc1Balance = await BIIXContract.balanceOf(acc1.address);
        let acc2Balance = await BIIXContract.balanceOf(acc2.address);
        console.log("account 1 balance: ", acc1Balance);
        console.log("account 2 balance: ", acc2Balance);
        expect(acc1Balance).to.equal(acc2Balance);
    })
})