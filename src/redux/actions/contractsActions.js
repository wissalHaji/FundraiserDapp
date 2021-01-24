import * as types from "../actions/actionTypes";

export function createFactory(factory) {
  return { type: types.CREATE_FACTORY, factory };
}
