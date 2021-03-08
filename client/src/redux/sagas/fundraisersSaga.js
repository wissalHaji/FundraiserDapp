import * as types from "../actions/actionTypes";

import { takeLatest, put, all, call } from "redux-saga/effects";
import { loadFundraiserSuccess } from "../actions/fundraisersAction";

function* loadFundraisers(action) {
  try {
    const { contracts, page, account } = action;
    // for each contract fetch fundraiser details
    const fundraisers = yield all(
      contracts.map((contract) => call(getFundraiserDetails, contract, account))
    );
    const addressList = fundraisers.map((fundraiser) => ({
      name: fundraiser.name,
      address: fundraiser.address,
    }));
    yield put(loadFundraiserSuccess(fundraisers, page, addressList));
  } catch (error) {
    console.log(error);
  }
}

function* getFundraiserDetails(contract, account) {
  try {
    const name = yield contract.methods.name().call();
    const imageUrl = yield contract.methods.imageURL().call();
    const website = yield contract.methods.website().call();
    const description = yield contract.methods.description().call();
    const totalDonations = yield contract.methods.totalDonations().call();
    const numDonations = yield contract.methods.donationsCount().call();
    const beneficiary = yield contract.methods.beneficiary().call();
    const address = contract.options.address;
    const myDonations = yield contract.methods
      .myDonations()
      .call({ from: account });

    console.info(typeof numDonations);

    return {
      name,
      imageUrl,
      website,
      description,
      totalDonations,
      numDonations,
      beneficiary,
      address,
      myDonations,
    };
  } catch (error) {
    console.log(error);
  }
}

export default function* fundraisersSaga() {
  yield takeLatest(types.LOAD_FUNDRAISERS, loadFundraisers);
}
