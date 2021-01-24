//redux store shape

const initialState = {
  web3: {
    web3Instance: null,
  },
  user: { accounts: [] },
  contracts: {
    factory: null,
    fundraisers: [],
  },
  fundraisers: [],
  backendCallsInProgress: 0,
};

export default initialState;
