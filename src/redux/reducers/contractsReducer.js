import initialState from "./initialState";
import * as _ from "lodash";

import * as types from "../actions/actionTypes";

const contractsReducer = (state = initialState.contracts, action) => {
  switch (action.type) {
    case types.CREATE_FACTORY:
      return { ...state, factory: _.cloneDeep(action.factory) };
    case types.ADD_FUNDRAISER:
      return {
        ...state,
        fundraisers: [...state.fundraisers, action.fundraiser],
      };

    default:
      return state;
  }
};

export default contractsReducer;
