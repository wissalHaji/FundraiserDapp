import initialState from "./initialState";
import * as types from "../actions/actionTypes";
import * as _ from "lodash";

const web3Reducer = (state = initialState.web3, action) => {
  console.log("inside web3 reducer");
  console.log(action.web3);
  if (action.type === types.INITIALIZE_WEB3) {
    return { web3Instance: _.cloneDeep(action.web3) };
  }
  return state;
};

export default web3Reducer;
