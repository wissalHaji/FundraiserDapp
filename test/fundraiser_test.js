const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", (accounts) => {
  let fundraiser;
  const name = "Beneficiary name";
  const website = "Benificiary website";
  const imageURL = "Beneficiary image url";
  const description = "Beneficiary description";
  const beneficiary = accounts[1];
  const owner = accounts[0];
  beforeEach(async () => {
    fundraiser = await FundraiserContract.new();
    await fundraiser.init(name, website, imageURL, description, beneficiary);
  });
  describe("initialization", () => {
    it("gets the beneficiary name", async () => {
      const actual = await fundraiser.name();
      assert.equal(actual, name, "names should match");
    });
    it("gets the beneficiary website", async () => {
      const actual = await fundraiser.website();
      assert.equal(actual, website, "websites should match");
    });
    it("gets the beneficiary image url", async () => {
      const actual = await fundraiser.imageURL();
      assert.equal(actual, imageURL, "image url should match");
    });
    it("gets the beneficiary description", async () => {
      const actual = await fundraiser.description();
      assert.equal(actual, description, "description should match");
    });
    it("gets the beneficiary address", async () => {
      const actual = await fundraiser.beneficiary();
      assert.equal(actual, beneficiary, "beneficiary address should match");
    });
    it("gets the beneficiary owner address", async () => {
      const actual = await fundraiser.owner();
      assert.equal(actual, owner, "owner address should match");
    });
  });

  describe("setBeneficiary", () => {
    const newBeneficiary = accounts[2];
    it("update beneficiary when called by owner account", async () => {
      await fundraiser.setBeneficiary(newBeneficiary, { from: owner });
      const expected = newBeneficiary;
      const actual = await fundraiser.beneficiary();
      assert.equal(expected, actual, "beneficiaries should match");
    });
    it("throws an error when called from a non owner account", async () => {
      try {
        await fundraiser.setBeneficiary(newBeneficiary, { from: accounts[3] });
        assert.fail("withdraw was not restricted to owners");
      } catch (err) {
        const expectedError = "Ownable: caller is not the owner";
        const actualError = err.reason;
        assert.equal(actualError, expectedError, "should not be permitted");
      }
    });
  });
  describe("making donations", () => {
    const value = web3.utils.toWei("0.0289");
    const donor = accounts[2];
    it("increase myDonationsCount", async () => {
      const currentDonationsCount = await fundraiser.myDonationsCount({
        from: donor,
      });
      await fundraiser.donate({ from: donor, value: value });
      const newDonationsCount = await fundraiser.myDonationsCount({
        from: donor,
      });
      assert.equal(
        newDonationsCount - currentDonationsCount,
        1,
        "myDonations should increment by 1"
      );
    });
    it("includes donation in mydonations", async () => {
      await fundraiser.donate({ from: donor, value });
      const myDonations = await fundraiser.myDonations({ from: donor });
      assert.equal(myDonations[0].value, value, "values should match");
      assert(myDonations[0].date, "date should be present");
    });
    it("increases the totalDonations amount", async () => {
      const totalDonations = await fundraiser.totalDonations();
      await fundraiser.donate({ from: donor, value: value });
      const newTotalDonations = await fundraiser.totalDonations();
      const diff = newTotalDonations - totalDonations;
      assert.equal(diff, value, "diffrence should match the donation value");
    });
    it("increases donations count", async () => {
      const donationsCount = await fundraiser.donationsCount();
      await fundraiser.donate({ from: donor, value });
      const newDonationsCount = await fundraiser.donationsCount();
      const diff = newDonationsCount - donationsCount;
      assert.equal(diff, 1, "difference should be 1");
    });
    it("emits the donation received event", async () => {
      const tx = await fundraiser.donate({ form: donor, value });
      const expectedEvent = "DonationReceived";
      const actualEvent = tx.logs[0].event;
      assert.equal(actualEvent, expectedEvent, "events should match");
    });
  });
  describe("withdrawing funds", () => {
    beforeEach(async () => {
      await fundraiser.donate({
        from: accounts[2],
        value: web3.utils.toWei("0.1"),
      });
    });
    describe("access controls", () => {
      it("throws an error when called from a non-owner account", async () => {
        try {
          await fundraiser.withdraw({ from: accounts[3] });
          assert.fail("withdraw was not restricted to owners");
        } catch (err) {
          const expectedError = "Ownable: caller is not the owner";
          const actualError = err.reason;
          assert.equal(actualError, expectedError, "should not be permitted");
        }
      });
      it("permits the owner to call the function", async () => {
        try {
          await fundraiser.withdraw({ from: owner });
          assert(true, "no errors were thrown");
        } catch (err) {
          assert.fail("should not have thrown an error");
        }
      });
    });
    it("transfers balance to beneficiary", async () => {
      const currentContractBalance = await web3.eth.getBalance(
        fundraiser.address
      );
      const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
      await fundraiser.withdraw({ from: owner });
      const newContractBalance = await web3.eth.getBalance(fundraiser.address);
      const newBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
      const beneficiaryDifference =
        newBeneficiaryBalance - currentBeneficiaryBalance;
      assert.equal(newContractBalance, 0, "contract should have a 0 balance");
      assert.equal(
        beneficiaryDifference,
        currentContractBalance,
        "beneficiary should receive all the funds"
      );
    });
    it("emits withdraw event ", async () => {
      const tx = await fundraiser.withdraw({ from: owner });
      const expectedEvent = "Withdraw";
      const actualEvent = tx.logs[0].event;
      assert.equal(actualEvent, expectedEvent, "events should match");
    });
    describe("fallback function", () => {
      const value = web3.utils.toWei("0.0289");
      it("increases the total donations amount", async () => {
        const currentTotalDonations = await fundraiser.totalDonations();
        await web3.eth.sendTransaction({
          from: accounts[9],
          value,
          to: fundraiser.address,
        });
        const newTotalDonations = await fundraiser.totalDonations();
        const diff = newTotalDonations - currentTotalDonations;
        assert.equal(diff, value, "difference should match the donation value");
      });
      it("increases donations count", async () => {
        const currentDonationsCount = await fundraiser.donationsCount();
        await web3.eth.sendTransaction({
          from: accounts[9],
          to: fundraiser.address,
          value,
        });
        const newDonationsCount = await fundraiser.donationsCount();
        const diff = newDonationsCount - currentDonationsCount;
        assert.equal(diff, 1, "differnce should be equal to 1");
      });
    });
  });
});
