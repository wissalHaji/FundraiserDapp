import * as types from "../actions/actionTypes";

export function initializeWeb3(web3) {
  return { type: types.INITIALIZE_WEB3, web3 };
}
