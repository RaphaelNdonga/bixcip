const hardhat = require("hardhat")

const main = async () => {
    const RandomNumberGeneratorFactory = await hardhat.ethers.getContractFactory("RandomNumberGenerator")
    const RandomNumberGenerator = await RandomNumberGeneratorFactory.deploy(
        networks[networkName].vrfCoordinator,
        networks[networkName].keyHash,
        3
    )
    await RandomNumberGenerator.deployed()
    const BIXCIPLotteryFactory = await hardhat.ethers.getContractFactory("BIXCIPLottery")
    const BIXCIPLottery = await BIXCIPLotteryFactory.deploy(
        RandomNumberGenerator.address
    )
    await BIXCIPLottery.deployed()
    console.log("BIXCIPLottery deployed at address: ", BIXCIPLottery.address)
}

main()