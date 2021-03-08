import * as types from "./actionTypes";

// saving *****************************
export function saveFundraiser(fundraiser, address) {
  return { type: types.SAVE_FUNDRAISER, fundraiser, address };
}

// updating **************************
export function updateDonationsInfo(name, amount) {
  return { type: types.UPDATE_DONATIONS_INFO, amount, name };
}

export function updateBeneficiary(name, beneficiary) {
  return { type: types.UPDATE_BENEFICIARY, beneficiary, name };
}

// loading**********************************
export function loadFundraisers(fundraisersContracts, page, account) {
  return {
    type: types.LOAD_FUNDRAISERS,
    contracts: fundraisersContracts,
    page,
    account,
  };
}

export function loadFundraiserSuccess(fundraisers, page, addressList) {
  return {
    type: types.LOAD_FUNDRAISER_SUCCESS,
    fundraisers,
    page,
    addressList,
  };
}

export function startLoading() {
  return { type: types.START_LOADING };
}

export function stopLoading() {
  return { type: types.STOP_LOADING };
}
