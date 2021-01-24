import * as types from "./actionTypes";

function createFundraiser_SUCCESS(fundraiser) {
  return { type: types.CREATE_FUNDRAISER, fundraiser };
}

function updateFundraiser_SUCCESS(fundraiser) {
  return { type: types.UPDATE_FUNDRAISER, fundraiser };
}

function loadFundraisers_SUCCESS(fundraisers) {
  return { type: types.LOAD_FUNDRAISERS, fundraisers };
}

/**
 * Calls the factory service to send a transaction
 * for creating a new fundraiser or updating the existing
 * one.
 * @param {FactoryService} factoryService the factory service
 * @param {*} fundraiser the instance of the fundraiser to be saved
 * @param {bool} edit true if fundraiser should be upadted, false otherwise
 */
export function saveFundraiser(factoryService, fundraiser, edit) {
  return (dispatch) => {
    if (edit) {
      return null; // TODO
    } else {
      return factoryService
        .createFundraiser(fundraiser)
        .then(() => {
          dispatch(createFundraiser_SUCCESS(fundraiser));
        })
        .catch((error) => {
          throw error;
        });
    }
  };
}

export function loadFundraisers(factoryService) {
  return (dispatch) => {
    return factoryService
      .getFundraisers()
      .then((fundraisers) => {
        dispatch(loadFundraisers_SUCCESS(fundraisers));
      })
      .catch((error) => {
        throw error;
      });
  };
}
