import React, { useRef } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ReactToPrint from "react-to-print";

import { Helmet } from "react-helmet";

import styles from "assets/jss/material-kit-react/views/profilePage.js";

const useStyles = makeStyles(styles);

const Receipt = ({ donation }) => {
  const classes = useStyles();
  const componentToPrintRef = useRef();

  return donation.fundName ? (
    <div>
      <div className={classes.main} ref={componentToPrintRef}>
        <Helmet>
          <style>{"body {background : white;}"}</style>
        </Helmet>
        <div
          style={{
            backgroundColor: "black",
            color: "white",
            marging: "50px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          DONATION RECEIPT
        </div>
        <div className={classes.container}>
          <div style={{ textAlign: "center" }}>
            <h3>Thank you for your donation to {donation.fundName} </h3>
            <hr />
          </div>

          <div
            style={{
              marginTop: "30px",
              margingLeft: "30px",
            }}
          >
            <div>Donator : {donation.account}</div>
            <div>
              Date of Donation:{" "}
              {new Date(parseInt(donation.date) * 1000).toString()}
            </div>
            <div style={{ marginBottom: "30px" }}>
              Donation Value: {donation.amount} ETH
            </div>
          </div>
        </div>
      </div>
      <div className={classes.container}>
        <ReactToPrint
          trigger={() => <button>Print</button>}
          content={() => componentToPrintRef.current}
        />
      </div>
    </div>
  ) : (
    <h1>Receipt unavailable</h1>
  );
};

export default Receipt;
