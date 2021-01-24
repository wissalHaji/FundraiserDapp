import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import ContactMail from "@material-ui/icons/ContactMail";
import People from "@material-ui/icons/People";
import Language from "@material-ui/icons/Language";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Description from "@material-ui/icons/Description";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

// core components
import GridContainer from "template/components/Grid/GridContainer.js";
import GridItem from "template/components/Grid/GridItem.js";
import Button from "template/components/CustomButtons/Button.js";
import Card from "template/components/Card/Card.js";
import CardBody from "template/components/Card/CardBody.js";
import CardHeader from "template/components/Card/CardHeader.js";
import CardFooter from "template/components/Card/CardFooter.js";
import CustomInput from "template/components/CustomInput/CustomInput.js";
import SnackbarContent from "template/components/Snackbar/SnackbarContent";
import Tooltip from "@material-ui/core/Tooltip";

import PropTypes from "prop-types";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

const useStyles = makeStyles(styles);

const FundraiserForm = ({
  fundraiser,
  onSave,
  onChange,
  onBlur,
  saving = false,
  errors = {},
  touched = false,
  edit,
}) => {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 300);

  const classes = useStyles();
  console.log("from form");
  console.log(touched.name);

  return (
    <div>
      {errors.onSave && (
        <SnackbarContent
          message={errors.onSave}
          close={true}
          color="danger"
          icon={ErrorOutline}
        />
      )}
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6}>
            <Card className={classes[cardAnimaton]}>
              <form className={classes.form} onSubmit={onSave}>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>{edit ? "Edit" : "Create"} Fundraiser</h4>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText="Name..."
                    id="name"
                    error={errors.name ? true : false}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      name: "name",
                      value: fundraiser.name,
                      onChange,
                      onBlur,
                      required: true,
                      disabled: edit ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">
                          <People className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.name && errors.name}
                  <CustomInput
                    labelText="Website..."
                    id="website"
                    error={errors.website}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      name: "website",
                      value: fundraiser.website,
                      onChange,
                      onBlur,
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Language className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.website && errors.website}
                  <CustomInput
                    labelText="Ethereum address"
                    id="beneficiary"
                    error={errors.beneficiary}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      name: "beneficiary",
                      value: fundraiser.beneficiary,
                      onChange,
                      onBlur,
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <ContactMail className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.beneficiary && errors.beneficiary}
                  <CustomInput
                    labelText="Confirm Ethereum address"
                    id="confBeneficiary"
                    error={errors.confBeneficiary}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      name: "confBeneficiary",
                      onChange,
                      onBlur,
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <ContactMail className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.confBeneficiary && errors.confBeneficiary}
                  <CustomInput
                    labelText="Image URL..."
                    id="imageURL"
                    error={errors.imageUrl}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      name: "imageUrl",
                      value: fundraiser.imageUrl,
                      onChange,
                      onBlur,
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <PhotoCamera className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.imageUrl && errors.imageUrl}
                  <CustomInput
                    labelText="Description..."
                    id="description"
                    error={errors.description}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      name: "description",
                      type: "text",
                      value: fundraiser.description,
                      onChange,
                      onBlur,
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Description className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.description && errors.description}
                </CardBody>
                <CardFooter className={classes.cardFooter}>
                  <Button
                    simple
                    color="primary"
                    size="lg"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
};

FundraiserForm.propTypes = {
  fundraiser: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object,
};

export default FundraiserForm;
