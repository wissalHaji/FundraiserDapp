import { combineReducers } from "redux";

import contracts from "./contractsReducer";
import user from "./userReducer";
import web3 from "./web3Reducer";
import backendCallsInProgress from "./backendStatusReducer";

const rootReducer = combineReducers({
  contracts,
  user,
  web3,
  backendCallsInProgress,
});

export default rootReducer;
