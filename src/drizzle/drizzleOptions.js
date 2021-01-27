import FundraiserFactory from "../contracts/FundraiserFactory.json";

const options = {
  contracts: [FundraiserFactory],
  events: {
    FundraiserFactory: ["FundraiserCreated"],
  },
  polls: {
    accounts: 5000,
  },
  networkWhiteList: [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ],
};

export default options;
