import React from "react";

import { Switch, Route } from "react-router-dom";

import Home from "../pages/HomePage";
import PageNotFound from "../pages/PageNotFound";
import ManageFundraiser from "../pages/ManageFundraiserPage";
import Receipt from "../pages/ReceiptContainer";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/fundraiser" component={ManageFundraiser} />
        <Route path="/receipt" component={Receipt} />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
};

App.propTypes = {};

export default App;
