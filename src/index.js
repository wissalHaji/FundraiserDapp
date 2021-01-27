import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ErrorBoundary from "./pages/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./layouts/App";
import "template/assets/scss/material-kit-react.scss?v=1.9.0";

import configureStore from "./redux/configureStore";
import { Provider as ReduxProvider } from "react-redux";
import { ToastContainer } from "react-toastify";

import drizzleOptions from "./drizzle/drizzleOptions";
import { DrizzleProvider } from "./drizzle/DrizzleContext";
import { Drizzle } from "@drizzle/store";
import LoadingContainer from "./pages/LoadingContainer";

const appStore = configureStore();
const drizzle = new Drizzle(drizzleOptions);

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={appStore}>
      <BrowserRouter>
        <ErrorBoundary>
          <DrizzleProvider drizzle={drizzle}>
            <LoadingContainer>
              <App />
              <ToastContainer autoClose={3000} hideProgressBar />
            </LoadingContainer>
          </DrizzleProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
