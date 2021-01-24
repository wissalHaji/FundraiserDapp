import initialState from "./initialState";

import * as types from "../actions/actionTypes";

const fundraisersReducer = (state = initialState.fundraisers, action) => {
  switch (action.type) {
    case types.CREATE_FUNDRAISER:
      return [...state, action.fundraiser];
    case types.UPDATE_FUNDRAISER:
      return fundraisers.map((fundraiser) =>
        fundraiser.name === action.fundraiser.name
          ? action.fundraiser
          : fundraiser
      );
    case types.LOAD_FUNDRAISERS:
      return [...action.fundraisers];

    default:
      return state;
  }
};

export default fundraisersReducer;
