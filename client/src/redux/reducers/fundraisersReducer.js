import initialState from "./initialState";

import * as types from "../actions/actionTypes";
import produce from "immer";
import { fundraisersStatus, PAGE_LIMIT } from "../../constants";

const fundraisersReducer = (state = initialState.fundraisers, action) => {
  /**  *********SAVING*************** */
  if (action.type === types.SAVE_FUNDRAISER) {
    const fundraiser = {
      ...action.fundraiser,
      totalDonations: "0",
      numDonations: "0",
      myDonations: [],
    };
    // remove one element to keep page
    // items number in sync
    const newData = state.data.filter(
      (fundraiser, index) => index !== state.data.length - 1
    );
    return {
      ...state,
      data:
        state.data.length === PAGE_LIMIT
          ? [fundraiser, ...newData]
          : [fundraiser, ...state.data],
      addressList: [
        ...state.addressList,
        { name: fundraiser.name, address: action.address },
      ],
    };
  }

  /*****   LOADING ***************** */
  if (action.type === types.START_LOADING) {
    return produce(state, (draftState) => {
      draftState.status = fundraisersStatus.LOADING;
    });
  }

  if (action.type === types.STOP_LOADING) {
    return produce(state, (draftState) => {
      draftState.status = fundraisersStatus.LOADED;
    });
  }

  if (action.type === types.LOAD_FUNDRAISER_SUCCESS) {
    return produce(state, (draftState) => {
      draftState.data = action.fundraisers;
      draftState.status = fundraisersStatus.LOADED;
      draftState.page = action.page;
      draftState.addressList = action.addressList;
    });
  }

  /***********  UPDATING   *********************/
  if (action.type === types.UPDATE_DONATIONS_INFO) {
    return {
      ...state,
      data: state.data.map((fundraiser) => {
        return fundraiser.name === action.name
          ? {
              ...fundraiser,
              totalDonations: (
                BigInt(fundraiser.totalDonations) + BigInt(action.amount)
              ).toString(),
              numDonations: (Number(fundraiser.numDonations) + 1).toString(),
              myDonations: [
                ...fundraiser.myDonations,
                { value: action.amount, date: Date.now().toString() },
              ],
            }
          : fundraiser;
      }),
    };
  }

  if (action.type === types.UPDATE_BENEFICIARY) {
    return {
      ...state,
      data: state.data.map((fundraiser) => {
        return fundraiser.name === action.name
          ? { ...fundraiser, beneficiary: action.beneficiary }
          : fundraiser;
      }),
    };
  }

  return state;
};

export default fundraisersReducer;
