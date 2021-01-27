import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FundraiserForm from "../components/fundraisers/FundraiserForm";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import urlRegex from "url-regex";
import isImageUrl from "is-image-url";

import image from "assets/img/landing-bg.jpg";
import { useDrizzleContext } from "../drizzle/DrizzleContext";
import { contractsNames, transactionStatus } from "../constants";
import { getTransactionState } from "../drizzle/utils";
import * as actionCreators from "../redux/actions/fundraisersAction";

const useStyles = makeStyles(styles);
const newFundraiser = {
  name: "",
  website: "",
  imageUrl: "",
  description: "",
  beneficiary: "",
};

// TODO: handle evm errors
const ManageFundraiserPage = ({
  saveTxStackId,
  createFundraiser,
  updateFundraiser,
  history,
  name,
}) => {
  const { drizzle, drizzleState } = useDrizzleContext();

  const [fundraiser, setFundraiser] = useState(newFundraiser);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const edit = name ? true : false;

  useEffect(() => {
    const init = async () => {
      //TODO : call service to look for the fundraiser by name
    };
    edit && init();
  }, [edit]);

  const classes = useStyles();

  const nameValidation = (value) => {
    if (value.trim() === "") return "Name is required";
    if (value.trim().length < 3) return "Name must have at least 3 characters";
    return null;
  };

  const websiteValidation = (value) => {
    if (value.trim() === "") return "Website is required";
    if (!urlRegex({ exact: true }).test(value.trim()))
      return "Website must have the form https://example.com";
    return null;
  };

  const imageUrlValidation = (value) => {
    if (value.trim() === "") return "Image URL is required";
    if (!urlRegex({ exact: true }).test(value) || !isImageUrl(value))
      return "Must be a valid url with image file extension (jpg, png, gif)";
    return null;
  };

  const beneficiaryValidation = (value) => {
    if (value.trim() === "") return "Beneficiary address is required";
    if (!drizzle.web3.utils.isAddress(value))
      return "Must be a valid Ethereum address";
    return null;
  };

  const confBeneficiaryValidation = (value) => {
    if (value.trim() === "") return "Address confirmation is required";
    if (errors["beneficiary"])
      return "Please fill in the beneficiary address first";
    if (value !== fundraiser.beneficiary)
      return "Confirmation does not match the beneficiary address";
    return null;
  };

  const descriptionValidation = (value) => {
    if (value.trim() === "") return "Description is required";
    if (value.trim().length < 8)
      return "Description must have at least 8 characters";
    return null;
  };

  const validate = {
    name: nameValidation,
    website: websiteValidation,
    imageUrl: imageUrlValidation,
    description: descriptionValidation,
    beneficiary: beneficiaryValidation,
    confBeneficiary: confBeneficiaryValidation,
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFundraiser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setTouched((prevState) => ({ ...prevState, [name]: true }));
    const error = validate[name](value);
    setErrors((prevState) => ({ ...prevState, [name]: error }));
  };

  const onBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prevState) => ({ ...prevState, [name]: true }));
    const error = validate[name](value);
    setErrors((prevState) => ({ ...prevState, [name]: error }));
  };

  const sendTransaction = () => {
    if (edit) {
      updateFundraiser(
        fundraiser,
        drizzle.contracts[contractsNames.FUNDRAISER_FACTORY]
      );
    } else {
      createFundraiser(
        fundraiser,
        drizzle.contracts[contractsNames.FUNDRAISER_FACTORY],
        drizzleState.accounts[0],
        drizzleState.transactionStack
      );
    }
  };

  const onSave = (event) => {
    event.preventDefault();

    // revalidate the form and set all fields to touched
    // so that errors can be displayed
    const formValidation = Object.keys(fundraiser).reduce(
      (acc, key) => {
        const newError = validate[key](fundraiser[key]);
        const newTouched = { [key]: true };
        return {
          errors: {
            ...acc.errors,
            ...(newError && { [key]: newError }),
          },
          touched: {
            ...acc.touched,
            ...newTouched,
          },
        };
      },
      {
        errors: {},
        touched: {},
      }
    );
    setErrors(formValidation.errors);
    setTouched(formValidation.touched);

    //if there are errors show a message
    if (Object.keys(formValidation.errors).length > 0)
      setErrors((prevState) => ({
        ...prevState,
        onSave: "Please correct the errors before submitting.",
      }));
    else {
      // send the fundraiser to the network
      setSaving(true);
      sendTransaction();
    }
  };

  useEffect(() => {
    if (saving && saveTxStackId !== null) {
      console.log("saveTxStackId  : ");
      console.log(saveTxStackId);
      const txState = getTransactionState(saveTxStackId, drizzleState);
      console.log(txState);

      // transaction broadcasted : transaction object is available
      if (txState) {
        console.log(txState);
        switch (txState.status) {
          case transactionStatus.PENDING:
            //TODO: display message for pending transaction
            break;

          case transactionStatus.SUCCESS:
            console.log("success");
            console.log(saveTxStackId);
            toast.success("fundraiser saved successfully.", {
              position: toast.POSITION.TOP_RIGHT,
            });
            history.push("/");
            break;

          case transactionStatus.FAILED:
            setSaving(false);
            setErrors({ onSave: txState.error.message });
            console.log(txState.error);
            break;

          default:
            break;
        }
      }
    }
  }, [saving, saveTxStackId, drizzleState.transactions]);

  return (
    <div
      // className={classes.pageHeader}
      style={{
        backgroundImage: "url(" + image + ")",
        backgroundSize: "cover",
        backgroundPosition: "top center",
      }}
    >
      <FundraiserForm
        fundraiser={fundraiser}
        onSave={onSave}
        onChange={onChange}
        onBlur={onBlur}
        edit={edit}
        saving={saving}
        errors={errors}
        touched={touched}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const name = ownProps.match.params.name;
  return {
    saveTxStackId: state.fundraisers.saveTransaction.txStackId,
    name,
  };
};

ManageFundraiserPage.propTypes = {
  name: PropTypes.string,
  saveTxStackId: PropTypes.number,
  createFundraiser: PropTypes.func.isRequired,
  updateFundraiser: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  createFundraiser: actionCreators.createFundraiser,
  updateFundraiser: actionCreators.updateFundraiser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageFundraiserPage);
