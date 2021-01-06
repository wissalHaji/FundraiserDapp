import initialState from "./initialState";
import * as types from "../actions/actionTypes";

const web3Reducer = (state = initialState.user, action) => {
  switch (action.type) {
    case types.UPDATE_ACCOUNTS:
      return { ...state, accounts: action.accounts };

    default:
      return state;
  }
};

export default web3Reducer;
