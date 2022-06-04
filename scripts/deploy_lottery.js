const hardhat = require("hardhat")

const main = async () => {
    const BIXCIPLotteryFactory = await hardhat.ethers.getContractFactory("BIXCIPLottery")
    const BIXCIPLottery = await BIXCIPLotteryFactory.deploy(
        "0xe34509580d971969cfb9632c42486b56209101c3"
    )
    await BIXCIPLottery.deployed()
    console.log("BIXCIPLottery deployed at address: ", BIXCIPLottery.address)
}

main()