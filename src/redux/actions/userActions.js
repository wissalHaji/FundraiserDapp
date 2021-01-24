import * as types from "../actions/actionTypes";

export function addAccount(account) {
  return { type: types.ADD_ACCOUNT, account };
}
