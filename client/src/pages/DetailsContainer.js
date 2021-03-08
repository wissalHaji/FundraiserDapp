import React, { useEffect, useState } from "react";

import DetailsModal from "../components/fundraisers/DetailsModal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useDrizzleContext } from "../drizzle/DrizzleContext";
import { getVMExceptionMessage } from "../drizzle/utils";

import {
  updateDonationsInfo,
  updateBeneficiary,
} from "../redux/actions/fundraisersAction";
import { toast } from "react-toastify";

const DetailsContainer = ({
  fundraiser,
  modalState,
  hideModal,
  account,
  updateDonationsInfo,
  updateBeneficiary,
}) => {
  const drizzle = useDrizzleContext();

  const [donationAmount, setDonationAmount] = useState("0.0");
  const [errors, setErrors] = useState({});
  const [infoToDisplay, setInfoToDisplay] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [beneficiary, setBeneficiary] = useState("");

  useEffect(() => {
    const init = async () => {
      const owner = await fundraiser.contract.methods.owner().call();
      console.log(owner);
      if (owner === account) setIsOwner(true);
    };
    init();
  }, [account]);

  // reset state when modal is closed
  useEffect(() => {
    if (!modalState) {
      setDonationAmount("0.0");
      setBeneficiary("");
      setErrors({});
      setInfoToDisplay(null);
      setSaving(false);
    }
  }, [modalState]);

  // validation: amount must be a valid number + required
  const amountValidation = (value) => {
    if (value.trim() === "") return "Amount is required";
    if (isNaN(Number(value)) || Number(value) < 0)
      return "Amount should be a valid number";
    if (Number(value) === 0) return "Amount must be greater than 0";
    return null;
  };

  const beneficiaryValidation = (value) => {
    if (value.trim() === "") return "Beneficiary is required";
    if (!drizzle.web3.utils.isAddress(value))
      return "Must be a valid Ethereum address";
    return null;
  };

  const onChange = (event) => {
    // validate before setting the value
    const { value, name } = event.target;
    let error;
    if (name === "amount") {
      setDonationAmount(value);
      error = amountValidation(value);
    }

    if (name === "beneficiary") {
      setBeneficiary(value);
      error = beneficiaryValidation(value);
    }

    setErrors({ [name]: error });
  };

  const onTxError = (error) => {
    setInfoToDisplay(null);
    setSaving(false);
    const message = getVMExceptionMessage(error);
    console.log("error message : " + message);
    setErrors({ onSave: message });
    console.log(error);
  };

  const onTxHash = (hash) => {
    setInfoToDisplay({
      message: "The transaction is being processed...\n TxHash : " + hash,
      color: "green",
    });
  };

  const onSetBeneficiary = (event) => {
    event.preventDefault();
    const error = beneficiaryValidation(beneficiary);
    setErrors({ beneficiary: error });
    if (error) {
      setErrors((prevState) => ({
        ...prevState,
        onSave: "Please correct the errors before submitting",
      }));
      return;
    }

    // send the transaction
    fundraiser.contract.methods
      .setBeneficiary(beneficiary)
      .send({ from: account, gas: 220000 })
      .on("transactionHash", (hash) => {
        onTxHash(hash);
      })
      .then((receipt) => {
        updateBeneficiary(fundraiser.name, beneficiary);
        hideModal();
      })
      .catch((error) => {
        onTxError(error);
      });
  };

  const onWithdraw = (event) => {
    if (fundraiser.numDonations === "0") {
      setInfoToDisplay({ message: "Your balance is empty", color: "red" });
      return;
    }
    setSaving(true);
    fundraiser.contract.methods
      .withdraw()
      .send({ from: account, gas: 210000 })
      .on("transactionHash", (hash) => {
        onTxHash(hash);
      })
      .then((receipt) => {
        toast.success("Donations withdrawn successfully.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        hideModal();
      })
      .catch((error) => {
        onTxError(error);
      });
  };

  const onDonate = (event) => {
    event.preventDefault();
    const error = amountValidation(donationAmount);
    setErrors({ amount: error });
    if (error) {
      setErrors((prevState) => ({
        ...prevState,
        onSave: "Please correct the errors before submitting",
      }));
      return;
    }

    // send donate transaction
    setSaving(true);
    setErrors({});
    fundraiser.contract.methods
      .donate()
      .send({
        from: account,
        gas: 210000,
        value: drizzle.web3.utils.toWei(donationAmount),
      })
      .on("transactionHash", (hash) => {
        onTxHash(hash);
      })
      .then((receipt) => {
        updateDonationsInfo(
          fundraiser.name,
          drizzle.web3.utils.toWei(donationAmount)
        );
        hideModal();
      })
      .catch((error) => {
        onTxError(error);
      });
  };

  return (
    <DetailsModal
      fundraiser={fundraiser}
      modalState={modalState}
      hideModal={hideModal}
      donationAmount={donationAmount}
      onChange={onChange}
      onDonate={onDonate}
      errors={errors}
      infoToDisplay={infoToDisplay}
      saving={saving}
      isOwner={isOwner}
      onWithdraw={onWithdraw}
      beneficiary={beneficiary}
      onSetBeneficiary={onSetBeneficiary}
    />
  );
};

DetailsContainer.propTypes = {
  fundraiser: PropTypes.object.isRequired,
  modalState: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  updateDonationsInfo: PropTypes.func.isRequired,
  updateBeneficiary: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    account: state.accounts[0],
  };
};

const mapDispatchToProps = {
  updateDonationsInfo,
  updateBeneficiary,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsContainer);
