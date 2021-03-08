import FundraiserFactoryContract from "../contracts/FundraiserFactory.json";

const options = {
  contracts: [FundraiserFactoryContract],
  events: {
    FundraiserFactory: ["FundraiserCreated"],
  },
  polls: {
    //accounts: 5000,
  },
  networkWhitelist: [
    42, // Kovan
  ],
};

export default options;
