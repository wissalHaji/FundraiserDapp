import * as types from "./actionTypes";

export function createFundraiser(fundraiser, factoryContract, account) {
  return {
    type: types.CREATE_FUNDRAISER,
    fundraiser,
    factoryContract,
    account,
  };
}

export function savingFundraiser(txStackId) {
  return {
    type: types.SAVING_FUNDRAISER,
    txStackId,
  };
}

export function updateFundraiser(fundraiser, factoryContract) {
  return { type: types.UPDATE_FUNDRAISER, fundraiser, factoryContract };
}

export function loadFundraisers(factoryContract) {
  return { type: types.LOAD_FUNDRAISERS, factoryContract };
}
