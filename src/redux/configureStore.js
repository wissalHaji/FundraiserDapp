import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";

import reduxImmutableStateInvariant from "redux-immutable-state-invariant";

import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //add support for redux dev tools

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, reduxImmutableStateInvariant())
    )
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
