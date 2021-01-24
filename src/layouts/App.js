import React, { useEffect, useState } from "react";

import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Home from "../pages/HomePage";
import PageNotFound from "../pages/PageNotFound";
import ManageFundraiser from "../pages/ManageFundraiserPage";
import LoadingPage from "../pages/LoadingPage";
import * as contractsActions from "../redux/actions/contractsActions";
import * as web3Actions from "../redux/actions/web3Actions";
import * as userActions from "../redux/actions/userActions";

import { useServices } from "../services/servicesContext";
import initContractServices from "../services/contracts";
import { getFactory, getWeb3 } from "../utils/web3Utils";
import "react-toastify/dist/ReactToastify.css";

const App = ({
  web3,
  factory,
  accounts,
  web3Actions,
  contractsActions,
  userActions,
}) => {
  const [errors, setErrors] = useState(null);
  const { fundraiserService, factoryService } = useServices();

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const factory = await getFactory(web3);
        console.log(factory);
        web3Actions.initializeWeb3(web3);
        contractsActions.createFactory(factory);
        userActions.addAccount(accounts[0]);
      } catch (err) {
        let error = err;
        if (err.code && err.code === 4001) {
          error =
            "Please select the account you would like to connect with the dapp.";
        }
        setErrors(error);
        alert("couldn't load either web3 or accounts or factory : " + error);
      }
    };
    init();
  }, [web3, accounts, factory]);

  const isLoading = () => {
    console.log(accounts.length);
    console.log(web3);
    return accounts.length === 0 || web3 === null || factory === null;
  };

  if (isLoading() && !errors) return <LoadingPage />;
  if (errors) throw errors;

  initContractServices(factory, accounts[0], factoryService, fundraiserService);

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

App.propTypes = {
  web3Actions: PropTypes.object.isRequired,
  contractsActions: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  web3: PropTypes.object,
  factory: PropTypes.object,
};

// the component will rerender any time state.web3 or
// state.contracts.factory or state.user.accounts change
function mapStateToProps(state, ownProps) {
  return {
    web3: state.web3,
    factory: state.contracts.factory,
    accounts: state.user.accounts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    web3Actions: bindActionCreators(web3Actions, dispatch),
    contractsActions: bindActionCreators(contractsActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
