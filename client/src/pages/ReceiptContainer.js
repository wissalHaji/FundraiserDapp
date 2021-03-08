import React from "react";

import { connect } from "react-redux";

import Receipt from "../components/donations/Receipt";

const ReceiptContainer = ({ location, account }) => {
  return <Receipt donation={{ ...location.state, account }} />;
};

const mapStateToProps = (state) => {
  return {
    account: state.accounts[0],
  };
};

export default connect(mapStateToProps)(ReceiptContainer);
