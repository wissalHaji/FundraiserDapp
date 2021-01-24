import { handleVMException } from "./contractCallsUtils";

class FactoryService {
  constructor() {
    this._factory = null;
    this._account = null;
  }

  set factory(factory) {
    this._factory = factory;
  }

  set account(account) {
    this._account = account;
  }

  // TODO : need to compute the gas needed
  // throw name already exists
  createFundraiser(fundraiser) {
    console.log({ ...fundraiser });
    return this._factory.methods
      .createFundraiser(
        fundraiser.name,
        fundraiser.website,
        fundraiser.imageUrl,
        fundraiser.description,
        fundraiser.beneficiary
      )
      .send({ from: this._account, gas: 1250000 })
      .catch((error) => {
        handleVMException(error);
      });
  }

  getFundraisers(pageLimit, pageOffset) {
    return this._factory.methods.fundraisers(pageLimit, pageOffset).call();
  }
}

export default FactoryService;
