import React from "react";

import { useDrizzleContext } from "../drizzle/DrizzleContext";
import Loading from "../components/common/loading/Loading";

// TODO: fill the list of allowed accounts

const LoadingPage = (props) => {
  const { drizzleState, initialized: drizzleInitialized } = useDrizzleContext();
  if (drizzleInitialized) {
    if (drizzleState.web3.status === "failed") {
      return (
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>⚠️</h1>
              <h3>
                This browser has no connection to the Ethereum network.
                <br />
                Please use the Chrome/FireFox extension MetaMask, or dedicated
                Ethereum browsers.
              </h3>
            </div>
          </div>
        </main>
      );
    }

    if (drizzleState.web3.status === "UserDeniedAccess") {
      return (
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>🦊</h1>
              <h3>
                <strong>{"We can't find any Ethereum accounts!"}</strong>
                Please Make sure to connect one of your accounts to the dapp.
              </h3>
            </div>
          </div>
        </main>
      );
    }

    if (
      drizzleState.web3.status === "initialized" &&
      (drizzleState.web3.NetworkMismatch ||
        Object.keys(drizzleState.accounts).length === 0)
    ) {
      return (
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>🦊</h1>
              <h3>
                <strong>{"We can't find any Ethereum accounts!"}</strong>
                Please check and make sure Metamask or your browser Ethereum
                wallet is pointed at the correct network and your account is
                unlocked. The following networks are allowed :
              </h3>
            </div>
          </div>
        </main>
      );
    }

    if (drizzleState.web3.status === "initialized") {
      return props.children;
    }
  }

  return <Loading />;
};

export default LoadingPage;
