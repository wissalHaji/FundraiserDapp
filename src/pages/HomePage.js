import React, { useEffect } from "react";

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "template/assets/jss/material-kit-react/views/landingPage.js";

import Header from "../components/home/Header";
import FundraiserList from "../components/fundraisers/FundraiserList";
import { loadFundraisers } from "../redux/actions/fundraisersAction";

import { connect } from "react-redux";

const useStyles = makeStyles(styles);

const mockFundraisers = [
  {
    name: "Best dog Rescues",
    description: "best dog rescue is an animal rescue in the bay area",
    totalDonations: 1000,
    imageURL: "assets/img/bg2.jpg",
  },
  {
    name: "The Molly foundation",
    description:
      "The molly foundation was created in the memory of the most traesured cat",
    totalDonations: 2500,
    imageURL: "assets/img/bg.jpg",
  },
  {
    name: "Best cat Rescues",
    description: "best cat rescue is an animal rescue in the bay area",
    totalDonations: 1000,
    imageURL: "assets/img/bg2.jpg",
  },
  {
    name: "The Molly foundation",
    description:
      "The molly foundation was created in the memory of the most traesured cat",
    totalDonations: 2500,
    imageURL: "assets/img/bg.jpg",
  },
];

const Home = ({ fundraisers, loadFundraisers }) => {
  const classes = useStyles();

  useEffect(() => {
    // call factory getFundraisers
  }, []);

  return (
    <>
      <Header />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <FundraiserList fundraisers={mockFundraisers} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    fundraisers: state.fundraisers,
  };
};

const mapDispatchToProps = {
  loadFundraisers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
