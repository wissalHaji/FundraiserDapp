let FundraiserFactory = artifacts.require("FundraiserFactory");
let Fundraiser = artifacts.require("Fundraiser");

module.exports = function (deployer) {
  deployer.deploy(Fundraiser).then(() => {
    return deployer.deploy(FundraiserFactory, Fundraiser.address);
  });
};
