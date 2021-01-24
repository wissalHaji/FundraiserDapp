import * as types from "./actionTypes";

export function beginBackendCall() {
  return { type: types.BEGIN_BACKEND_CALL };
}

export function backendCallError() {
  return { type: types.BACKEND_CALL_ERROR };
}
