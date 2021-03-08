import React, { useEffect, useState } from "react";

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import styles from "template/assets/jss/material-kit-react/views/landingPage.js";
import CustomLinearProgress from "template/components/CustomLinearProgress/CustomLinearProgress";

import Header from "../components/home/Header";
import FundraiserList from "../components/fundraisers/FundraiserList";
import {
  contractsNames,
  factoryMethods,
  fundraisersStatus,
} from "../constants";

import { connect } from "react-redux";
import { useDrizzleContext } from "../drizzle/DrizzleContext";
import FundraiserContract from "../contracts/Fundraiser.json";
import {
  loadFundraisers,
  startLoading,
  stopLoading,
} from "../redux/actions/fundraisersAction";
import DisplayPagination from "../components/common/DisplayPagination";

const useStyles = makeStyles(styles);

const PAGE_LIMIT = 9;

const HomePage = ({
  fundraisers,
  fundraisersAddressesCall,
  fundraisersCountCall,
  loadFundraisers,
  startLoading,
  stopLoading,
  account,
}) => {
  const classes = useStyles();
  const drizzle = useDrizzleContext();
  const factoryContract = drizzle.contracts[contractsNames.FUNDRAISER_FACTORY];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [countCacheKey, setCountCacheKey] = useState(null);

  //fetch fundraisers count and addresses
  useEffect(() => {
    startLoading();
    // since the call uses the same argument in every render
    // we need to execute it just once and save the cache key
    const countCacheKey = factoryContract.methods[
      factoryMethods.FUNDRAISERS_COUNT
    ].cacheCall();
    setCountCacheKey(countCacheKey);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // used for fetching the fundraisers whenever the
  // fundraisers count and addresses cache changes or
  // the user moves to another page.
  useEffect(() => {
    // Data is available in the store
    if (fundraisers.data.length !== 0 && fundraisers.page === currentPage) {
      setLoading(false);
      stopLoading();
      return;
    }
    if (!loading) {
      setLoading(true);
      startLoading();
    }
    // fetch fundraisers
    let addressesCacheKey;
    if (
      fundraisersCountCall[countCacheKey] &&
      fundraisersCountCall[countCacheKey].value
    ) {
      const fundraisersCount = fundraisersCountCall[countCacheKey].value;
      if (fundraisersCount > 0) {
        // If it's the last page then get only what's left
        // page limit <- itemsNum (mod PAGE_LIMIT)
        const pagesNumber = getPagesNumber(fundraisersCount);
        let pageLimit;
        if (currentPage === pagesNumber) {
          pageLimit = fundraisersCount % PAGE_LIMIT;
        } else pageLimit = PAGE_LIMIT;
        const offset = getOffset(fundraisersCount, pagesNumber);
        // fetch fundraisers addresses
        addressesCacheKey = factoryContract.methods[
          factoryMethods.GET_FUNDRAISERS
        ].cacheCall(pageLimit, offset);
        if (
          fundraisersAddressesCall[addressesCacheKey] &&
          fundraisersAddressesCall[addressesCacheKey].value
        ) {
          //reverse the array of addresses and fetch details
          const addresses = [
            ...fundraisersAddressesCall[addressesCacheKey].value,
          ];
          const reversedAddresses = addresses.reverse();
          const fundraiserContracts = reversedAddresses.map(
            (address) =>
              new drizzle.web3.eth.Contract(FundraiserContract.abi, address)
          );
          loadFundraisers(fundraiserContracts, currentPage, account); // dispatch load fundraisers
        }
      } else {
        setLoading(false);
        stopLoading();
        console.log("no fundraisers found");
      }
    }

    handleLoadingCallsErrors(addressesCacheKey);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fundraisersCountCall,
    fundraisersAddressesCall,
    currentPage,
    countCacheKey,
  ]);

  useEffect(() => {
    if (fundraisers.status === fundraisersStatus.LOADED && loading) {
      setLoading(false);
      stopLoading();
    }
  }, [fundraisers.status, loading]);

  function handleLoadingCallsErrors(addressesCacheKey) {
    if (
      fundraisersCountCall[countCacheKey] &&
      fundraisersCountCall[countCacheKey].error
    )
      setError(fundraisersCountCall[countCacheKey].error);

    if (
      fundraisersAddressesCall[addressesCacheKey] &&
      fundraisersAddressesCall[addressesCacheKey].error
    )
      setError(fundraisersAddressesCall[addressesCacheKey].error);
  }

  const getPagesNumber = (itemsNum = 0) => {
    return itemsNum % PAGE_LIMIT === 0
      ? parseInt(itemsNum / PAGE_LIMIT)
      : parseInt(itemsNum / PAGE_LIMIT + 1);
  };

  /**
   * if current page is the last page then offset
   * is 0.
   * @param {*} ItemsNum
   * @param {*} pagesNum
   */
  const getOffset = (ItemsNum, pagesNum) => {
    if (currentPage === pagesNum) return 0;
    return ItemsNum - PAGE_LIMIT * currentPage;
  };

  const onChangePage = (e) => {
    const pageVal = e.target.innerText;
    if (!isNaN(parseInt(pageVal))) {
      setCurrentPage(parseInt(pageVal));
    } else if (pageVal === "NEXT") {
      setCurrentPage((prevState) => prevState + 1);
    } else if (pageVal === "PREV") {
      setCurrentPage((prevState) => prevState - 1);
    }
  };

  const displayFundraisers = (itemsNumber) => {
    return (
      <>
        <FundraiserList
          fundraisers={fundraisers.data.map((fundraiser) => {
            const address = fundraisers.addressList.find(
              (el) => el.name === fundraiser.name
            ).address;
            return {
              ...fundraiser,
              address,
              contract: new drizzle.web3.eth.Contract(
                FundraiserContract.abi,
                address
              ),
              totalDonations: drizzle.web3.utils.fromWei(
                fundraiser.totalDonations,
                "ether"
              ),
              myDonations: fundraiser.myDonations.map((donation) => ({
                ...donation,
                value: drizzle.web3.utils.fromWei(donation.value, "ether"),
              })),
            };
          })}
        />
        <div style={{ padding: "70px 0", textAlign: "center" }}>
          <DisplayPagination
            pagesNumber={getPagesNumber(itemsNumber)}
            currentPage={currentPage}
            onChangePage={onChangePage}
          />
        </div>
      </>
    );
  };

  if (error) throw error;

  return (
    <>
      <Header />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          {loading ? (
            <CustomLinearProgress color="primary" />
          ) : fundraisers.data.length === 0 ? (
            <div
              style={{ color: "black", paddingTop: "30px", minHeight: "200px" }}
            >
              <h2>No fundraisers found.</h2>
            </div>
          ) : (
            displayFundraisers(fundraisersCountCall[countCacheKey].value)
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    fundraisers: state.fundraisers,
    fundraisersAddressesCall:
      state.contracts[contractsNames.FUNDRAISER_FACTORY][
        factoryMethods.GET_FUNDRAISERS
      ],
    fundraisersCountCall:
      state.contracts[contractsNames.FUNDRAISER_FACTORY][
        factoryMethods.FUNDRAISERS_COUNT
      ],
    account: state.accounts[0],
  };
};

const mapDispatchToProps = {
  loadFundraisers,
  startLoading,
  stopLoading,
};

HomePage.propTypes = {
  fundraisers: PropTypes.object.isRequired,
  fundraisersAddressesCall: PropTypes.object.isRequired,
  fundraisersCountCall: PropTypes.object.isRequired,
  loadFundraisers: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
