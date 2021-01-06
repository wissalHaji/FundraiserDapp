import initialState from "./initialState";
import * as types from "../actions/actionTypes";

const web3Reducer = (state = initialState.web3, action) => {
  switch (action.type) {
    case types.UPDATE_WEB3:
      return action.web3;

    default:
      return state;
  }
};

export default web3Reducer;
