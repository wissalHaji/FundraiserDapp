import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "template/components/CustomButtons/Button.js";
import Close from "@material-ui/icons/Close";
import CustomInput from "template/components/CustomInput/CustomInput.js";
import GridContainer from "template/components/Grid/GridContainer.js";
import GridItem from "template/components/Grid/GridItem.js";

import PropTypes from "prop-types";

import styles from "assets/jss/material-kit-react/views/componentsSections/javascriptStyles.js";
import { Link } from "react-router-dom";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const DetailsModal = ({
  fundraiser,
  modalState,
  hideModal,
  donationAmount,
  beneficiary,
  onChange,
  onDonate,
  onSetBeneficiary,
  errors,
  infoToDisplay,
  saving,
  isOwner,
  onWithdraw,
}) => {
  const classes = useStyles();
  return (
    <>
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal,
        }}
        open={modalState}
        TransitionComponent={Transition}
        keepMounted
        onClose={hideModal}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
        fullWidth={true}
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <IconButton
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={hideModal}
          >
            <Close className={classes.modalClose} />
          </IconButton>
          <h4 className={classes.modalTitle}>Donate to {fundraiser.name}</h4>
          <br />
          <span style={{ color: "red" }}>{errors.onSave}</span>
          {infoToDisplay && (
            <span style={{ color: infoToDisplay.color }}>
              {infoToDisplay.message}
            </span>
          )}
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
        >
          <img
            style={{ height: "180px", width: "60%", display: "block" }}
            className={classes.imgCardTop}
            src={fundraiser.imageUrl}
            alt="Card-img-cap"
          />
          <br />
          {isOwner && <p>Beneficiary : {fundraiser.beneficiary}</p>}
          <p>Website : {fundraiser.website}</p>
          <p>{fundraiser.description}</p>
          <br />
          <p>Total Donations: {fundraiser.totalDonations} ETH</p>
          <p>Number of donations: {fundraiser.numDonations}</p>
          <br />
          <form id="donateForm" onSubmit={onDonate}>
            <CustomInput
              labelText="Amount in ETH"
              id="amount"
              error={errors.amount ? true : false}
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                name: "amount",
                value: donationAmount,
                onChange,
                required: true,
              }}
            />
            {errors.amount}
          </form>
          <Button
            color="primary"
            type="submit"
            form="donateForm"
            onClick={onDonate}
            disabled={saving}
          >
            Donate
          </Button>
          <br />
          <h4
            style={{
              color: "white",
              backgroundColor: "#DDA0DD",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            MY DONATIONS
          </h4>
          {fundraiser.myDonations.length > 0 ? (
            fundraiser.myDonations.map((donation) => {
              return (
                <GridContainer key={donation.date}>
                  <GridItem xs={6} style={{ paddingLeft: "30px" }}>
                    {donation.value} ETH
                  </GridItem>
                  <GridItem xs={6} style={{ textAlign: "right" }}>
                    <Link
                      to={{
                        pathname: "/receipt",
                        state: {
                          amount: donation.value,
                          date: donation.date,
                          fundName: fundraiser.name,
                        },
                      }}
                    >
                      <Button color="primary">Request Receipt</Button>
                    </Link>
                  </GridItem>
                </GridContainer>
              );
            })
          ) : (
            <p>You have no donations for this fundraiser.</p>
          )}
          {isOwner && (
            <div>
              <h4
                style={{
                  color: "white",
                  backgroundColor: "#70e1e1",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                UPDATE BENEFICIARY ADDRESS
              </h4>
              <form id="beneficiaryForm" onSubmit={onSetBeneficiary}>
                <CustomInput
                  labelText="Beneficiary address"
                  id="beneficiary"
                  error={errors.beneficiary ? true : false}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "text",
                    name: "beneficiary",
                    value: beneficiary,
                    onChange,
                    required: true,
                  }}
                />
                {errors.beneficiary}
              </form>
              <Button
                color="info"
                type="submit"
                form="beneficiaryForm"
                onClick={onSetBeneficiary}
                disabled={saving}
              >
                Update
              </Button>
            </div>
          )}
        </DialogContent>

        <DialogActions className={classes.modalFooter}>
          {isOwner && (
            <Button onClick={onWithdraw} color="info" simple disabled={saving}>
              Witdraw
            </Button>
          )}
          <Button onClick={hideModal} color="danger" simple disabled={saving}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DetailsModal.propTypes = {
  fundraiser: PropTypes.object.isRequired,
  modalState: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  donationAmount: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onDonate: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default DetailsModal;
