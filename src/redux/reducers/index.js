import { combineReducers } from "redux";

import fundraisers from "./fundraisersReducer";

const rootReducer = combineReducers({
  fundraisers,
});

export default rootReducer;
