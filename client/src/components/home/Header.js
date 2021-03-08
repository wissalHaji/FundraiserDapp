import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "template/components/Grid/GridContainer.js";
import GridItem from "template/components/Grid/GridItem.js";
import Parallax from "template/components/Parallax/Parallax.js";
import styles from "template/assets/jss/material-kit-react/views/landingPage.js";
import Button from "template/components/CustomButtons/Button.js";
import bgImage from "template/assets/img/landing-bg.jpg";

import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);

const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleNewFundraiser = (e) => {
    history.push("/fundraiser");
  };

  return (
    <div>
      <Parallax filter image={bgImage}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>
                Start building the future today with us.
              </h1>
              <h4>
                Fundrainsing had never been easier than that, start creating
                your own fundraising card and make people see how you can make
                this world better...
              </h4>
              <br />
              <Button
                color="danger"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNewFundraiser}
              >
                Create New Fundraiser
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
    </div>
  );
};

export default Home;
