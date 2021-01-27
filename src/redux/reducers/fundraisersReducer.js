import initialState from "./initialState";

import * as types from "../actions/actionTypes";
import produce from "immer";

const fundraisersReducer = (state = initialState.fundraisers, action) => {
  if (action.type === types.SAVING_FUNDRAISER) {
    return produce(state, (draftState) => {
      draftState.saveTransaction.txStackId = action.txStackId;
    });
  }
  // if (action.type === types.CREATE_FUNDRAISER_SUCCESS) {
  //   return produce(state, (draftState) => {
  //     draftState.data.push(action.fundraiser);
  //     draftState.saveStatus = asyncCallStatus.SUCCESS;
  //   });
  // }

  // if (
  //   action.type === types.CREATE_FUNDRAISER ||
  //   action.type === types.UPDATE_FUNDRAISER
  // ) {
  //   return produce(state, (draftState) => {
  //     draftState.saveStatus = asyncCallStatus.IN_PROGRESS;
  //   });
  // }

  // if (
  //   action.type === types.CREATE_FUNDRAISER_FAILED ||
  //   action.type === types.UPDATE_FUNDRAISER_FAILED ||
  //   action.type === types.LOAD_FUNDRAISERS_FAILED
  // ) {
  //   return produce(state, (draftState) => {
  //     draftState.error.message = action.message;
  //   });
  // }

  // //*********************** */
  // if (action.type === types.UPDATE_FUNDRAISER_SUCCESS) {
  //   produce(state, (draftState) => {
  //     draftState.data.forEach((fundraiser) => {
  //       if (fundraiser.name === action.fundraiser.name) {
  //         fundraiser = action.fundraiser;
  //       }
  //     });
  //     draftState.saveStatus = asyncCallStatus.SUCCESS;
  //   });
  // }

  // //*********************** */
  // if (action.type === types.LOAD_FUNDRAISERS_SUCCESS) {
  //   return produce(state, (draftState) => {
  //     draftState.data = action.fundraisers;
  //     draftState.loadingStatus = asyncCallStatus.SUCCESS;
  //   });
  // }

  // if (action.type === types.LOAD_FUNDRAISERS) {
  //   return produce(state, (draftState) => {
  //     draftState.loadingStatus = asyncCallStatus.IN_PROGRESS;
  //   });
  // }

  return state;
};

export default fundraisersReducer;
