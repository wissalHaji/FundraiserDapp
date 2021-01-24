import initialState from "./initialState";
import * as types from "../actions/actionTypes";

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case types.ADD_ACCOUNT:
      return { ...state, accounts: [...state.accounts, action.account] };

    default:
      return state;
  }
};

export default userReducer;
