import React, { useState } from "react";

// @material-ui/core components
import FundraiserForm from "../components/fundraisers/FundraiserForm";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import urlRegex from "url-regex";
import isImageUrl from "is-image-url";

import image from "assets/img/landing-bg.jpg";
import { useDrizzleContext } from "../drizzle/DrizzleContext";
import { contractsNames, factoryMethods } from "../constants";
import { saveFundraiser } from "../redux/actions/fundraisersAction";

const newFundraiser = {
  name: "",
  website: "",
  imageUrl: "",
  description: "",
  beneficiary: "",
};

const FUNDRAISER_CREATED_EVENT = "FundraiserCreated";

const ManageFundraiserPage = ({ history, saveFundraiser, account }) => {
  console.log(account);

  const drizzle = useDrizzleContext();
  const factoryContract = drizzle.contracts[contractsNames.FUNDRAISER_FACTORY];

  const [fundraiser, setFundraiser] = useState(newFundraiser);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [info, setInfo] = useState(null);

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
    if (value.trim().length > 100)
      return "Description maximum characters is 100";
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
    createFundraiser();
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

  const createFundraiser = () => {
    factoryContract.methods[factoryMethods.CREATE_FUNDRAISER](
      fundraiser.name,
      fundraiser.website,
      fundraiser.imageUrl,
      fundraiser.description,
      fundraiser.beneficiary
    )
      .send({ from: account, gas: 400000 })
      .on("transactionHash", (hash) => {
        setInfo(
          "Please wait for the transaction to be processed by the network.\n Transaction Hash  : " +
            hash
        );
      })
      .then((receipt) => {
        const fundraiserAddress =
          receipt.events[FUNDRAISER_CREATED_EVENT].returnValues.fundraiser;
        saveFundraiser(fundraiser, fundraiserAddress);
        toast.success("fundraiser saved successfully.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push("/");
      })
      .catch((error) => {
        let message;
        if (error.message) {
          message = error.message;
        }
        setSaving(false);
        setInfo(null);
        setErrors({ onSave: message });
        console.log(error);
      });
  };

  const onCancel = () => {
    history.push("/");
  };

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
        onCancel={onCancel}
        saving={saving}
        errors={errors}
        touched={touched}
        info={info}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    account: state.accounts[0],
  };
};

ManageFundraiserPage.propTypes = {
  name: PropTypes.string,
  saveFundraiser: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  saveFundraiser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageFundraiserPage);
