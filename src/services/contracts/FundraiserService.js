/**
 * This service will use a different fundraiser
 * contract each time.
 * The consumer must set the fundraiser contract
 * first before calling any method
 */

class FundraiserService {
  constructor() {
    this._account = null;
    this._fundraiser = null;
  }

  set fundraiser(fundraiser) {
    this._fundraiser = fundraiser;
  }

  set account(account) {
    this._account = account;
  }

  // TODO : compute needed gas
  setBeneficiary(address) {
    if (this._fundraiser) {
      return this._fundraiser.methods
        .setBeneficiary(address)
        .send({ from: this._account, gas: 40000 });
    } else throw Error("FundraiserService does not have any contract set.");
  }
}

export default FundraiserService;
