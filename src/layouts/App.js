import React from "react";

import { Switch, Route } from "react-router-dom";

import Home from "../pages/HomePage";
import PageNotFound from "../pages/PageNotFound";
import ManageFundraiser from "../pages/ManageFundraiserPage";
import "react-toastify/dist/ReactToastify.css";

// TODO: use drizzle to check the web3 state and set is loading

const App = () => {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/fundraiser/:name" component={ManageFundraiser} />
        <Route path="/fundraiser" component={ManageFundraiser} />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
};

App.propTypes = {};

export default App;
