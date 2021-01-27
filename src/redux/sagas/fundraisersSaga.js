import * as types from "../actions/actionTypes";

import { takeEvery, takeLatest, put } from "redux-saga/effects";
import { savingFundraiser } from "../actions/fundraisersAction";

function* createFundraiser(action) {
  const { fundraiser, factoryContract, account } = action;
  const stackId = factoryContract.methods.createFundraiser.cacheSend(
    fundraiser.name,
    fundraiser.website,
    fundraiser.imageUrl,
    fundraiser.description,
    fundraiser.beneficiary,
    { from: account, gas: 2200000 }
  );
  yield put(savingFundraiser(stackId));
}

function* updateFundraiser(action) {}

function* loadFundraisers(action) {}

export default function* fundraisersSaga() {
  yield takeEvery(types.CREATE_FUNDRAISER, createFundraiser);
  yield takeEvery(types.UPDATE_FUNDRAISER, updateFundraiser);
  yield takeLatest(types.LOAD_FUNDRAISERS, loadFundraisers);
}
