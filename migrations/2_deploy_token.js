const BIXCIPToken = artifacts.require("BIXCIPToken");

module.exports = async (deployer) => {
  await deployer.deploy(BIXCIPToken);
};
