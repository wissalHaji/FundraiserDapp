import React, { useState } from "react";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "template/components/Card/Card.js";
import CardBody from "template/components/Card/CardBody.js";
import Button from "template/components/CustomButtons/Button.js";

import imagesStyles from "template/assets/jss/material-kit-react/imagesStyles.js";
import { cardTitle } from "template/assets/jss/material-kit-react.js";

import DetailsContainer from "../../pages/DetailsContainer";
import PropTypes from "prop-types";

const styles = {
  ...imagesStyles,
  cardTitle,
};

const useStyles = makeStyles(styles);

const FundraiserCard = ({ fundraiser }) => {
  const classes = useStyles();
  const [modalState, setModalState] = useState(false);

  const displayModal = () => {
    setModalState(true);
  };

  const hideModal = () => {
    setModalState(false);
  };

  return (
    <Card>
      <img
        style={{ height: "180px", width: "100%", display: "block" }}
        className={classes.imgCardTop}
        src={fundraiser.imageUrl}
        alt="Card-img-cap"
      />
      <CardBody>
        <h4 className={classes.cardTitle}>{fundraiser.name}</h4>
        <p style={{ height: "75px" }}>{fundraiser.description}</p>
        <p>Total Donations: {fundraiser.totalDonations} ETH</p>
        <Button color="primary" onClick={displayModal}>
          View details
        </Button>
        <DetailsContainer
          fundraiser={fundraiser}
          modalState={modalState}
          hideModal={hideModal}
        />
      </CardBody>
    </Card>
  );
};

FundraiserCard.propTypes = {
  fundraiser: PropTypes.object.isRequired,
};

export default FundraiserCard;
