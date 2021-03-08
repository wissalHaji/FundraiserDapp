import React from "react";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";

import FundraiserCard from "./FundraiserCard";
import GridContainer from "template/components/Grid/GridContainer";
import GridItem from "template/components/Grid/GridItem";
import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

const FundraiserList = ({ fundraisers }) => {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center" alignItems="center">
        {fundraisers.map((fundraiser) => (
          <GridItem xs={12} sm={12} md={6} lg={4} key={fundraiser.name}>
            <FundraiserCard fundraiser={fundraiser} />
          </GridItem>
        ))}
      </GridContainer>
    </div>
  );
};

FundraiserList.propTypes = {
  fundraisers: PropTypes.array.isRequired,
};

export default FundraiserList;
