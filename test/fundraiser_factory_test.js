const { expectRevert } = require("@openzeppelin/test-helpers");

const FundraiserFactoryContract = artifacts.require("FundraiserFactory");
const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiserfactory : deployment", () => {
  it("has been deployed", async () => {
    const fundraiserFactory = await FundraiserFactoryContract.deployed();
    assert(fundraiserFactory, "fundraiser factory was not deployed");
  });
});

contract("FundraiserFactory : createFundraiser", (accounts) => {
  let fundraiserFactory;
  let fundraiserContract;
  const names = "Beneficiary name";
  const url = "Beneficiary url";
  const imageURL = "beneficiary image URL";
  const description = "Beneficiary description";
  const beneficiary = accounts[1];
  const owner = accounts[0];

  const createFundraiser = async (count) => {
    for (let i = 0; i < count; i++) {
      await fundraiserFactory.createFundraiser(
        names,
        url,
        imageURL,
        description,
        beneficiary
      );
    }
  };

  beforeEach(async () => {
    fundraiserContract = await FundraiserContract.deployed();
    fundraiserFactory = await FundraiserFactoryContract.new(
      fundraiserContract.address
    );
  });

  it("increments the fundraiser count", async () => {
    const currentFundraisersCount = await fundraiserFactory.fundraisersCount();
    await createFundraiser(1);
    const newFundraiserCount = await fundraiserFactory.fundraisersCount();
    assert.equal(
      newFundraiserCount - currentFundraisersCount,
      1,
      "should increment by 1"
    );
  });
  it("emits the fundraiserCreated event", async () => {
    const receipt = await fundraiserFactory.createFundraiser(
      names,
      url,
      imageURL,
      description,
      beneficiary
    );
    const expectedEvent = "FundraiserCreated";
    const actualEvent = receipt.logs[0].event;
    assert.equal(actualEvent, expectedEvent, "events should match");
  });
  it("set the owner of fundraiser to caller of the function", async () => {
    await createFundraiser(1);
    const fundraisers = await fundraiserFactory.fundraisers(1, 0);
    const fundraiser = await FundraiserContract.at(fundraisers[0]);
    const fundraiserOwner = await fundraiser.owner();
    assert.equal(
      fundraiserOwner,
      accounts[0],
      "Fundraiser owner should be accounts[0]"
    );
  });

  it("FAIL if the name of the fundraiser already exists", async () => {
    await expectRevert(createFundraiser(2), "fundraiser name already exists");
  });
});

contract("FundraiserFactory : fundraisers", (accounts) => {
  async function createFundraiserFactory(fundraiserCount, accounts) {
    let fundraiser = await FundraiserContract.deployed();
    const factory = await FundraiserFactoryContract.new(fundraiser.address);
    await addFundraisers(factory, fundraiserCount, accounts);
    return factory;
  }
  async function addFundraisers(factory, count, accounts) {
    const name = "Beneficiary";
    const lowerCaseName = name.toLowerCase();
    const beneficiary = accounts[1];
    for (let i = 0; i < count; i++) {
      await factory.createFundraiser(
        `${name}${i}`,
        `${lowerCaseName}${i}.com`,
        `${lowerCaseName}${i}.png`,
        `Description for ${name}${i}`,
        beneficiary
      );
    }
  }
  describe("when fundraisers collection is empty", () => {
    it("returns an empty collection", async () => {
      const factory = await createFundraiserFactory(0, accounts);
      const fundraisers = await factory.fundraisers(10, 0);
      assert.equal(fundraisers.length, 0, "collection should be empty");
    });
  });
  describe("varying limits", async () => {
    let factory;
    beforeEach(async () => {
      factory = await createFundraiserFactory(30, accounts);
    });
    it("returns 10 results when limit is 10", async () => {
      const fundraisers = await factory.fundraisers(10, 0);
      assert.equal(fundraisers.length, 10, "result size should be 10");
    });
    it("returns 20 results when limit is 20", async () => {
      const fundraisers = await factory.fundraisers(20, 0);
      assert.equal(fundraisers.length, 20, "result size should be 20");
    });
    it("returns 20 results when limit is 30", async () => {
      const fundraisers = await factory.fundraisers(30, 0);
      assert.equal(fundraisers.length, 20, "result size should be 20");
    });
  });
  describe("varying offset", async () => {
    let factory;
    beforeEach(async () => {
      factory = await createFundraiserFactory(10, accounts);
    });
    it("contains the fundraiser with the appropriate offset", async () => {
      const fundraisers = await factory.fundraisers(1, 0);
      const fundraiser = await FundraiserContract.at(fundraisers[0]);
      const name = await fundraiser.name();
      assert.ok(await name.includes(0), `${name} did not include the offset 0`);
    });
    it("contains the fundraiser with the appropriate offset", async () => {
      const fundraisers = await factory.fundraisers(1, 7);
      const fundraiser = await FundraiserContract.at(fundraisers[0]);
      const name = await fundraiser.name();
      assert.ok(await name.includes(7), `${name} did not include the offset 7`);
    });
  });
  describe("boundary conditions", () => {
    let factory;
    beforeEach(async () => {
      factory = await createFundraiserFactory(10, accounts);
    });
    it("raises out of bounds error", async () => {
      try {
        await factory.fundraisers(1, 11);
        assert.fail("error was not raised");
      } catch (err) {
        const expected = "offset out of bounds";
        assert.ok(err.message.includes(expected), `${err.message}`);
      }
    });
    it("adjusts return size to prevent out of bounds error", async () => {
      try {
        const fundraisers = await factory.fundraisers(10, 5);
        assert.equal(fundraisers.length, 5, "collction adjusted");
      } catch (err) {
        assert.fail("limit and offset exceeded bounds");
      }
    });
  });
});

contract("FundraiserFactory : fundraiserByName", (accounts) => {
  let fundraiserFactory;
  beforeEach(async () => {
    let fundraiser = await FundraiserContract.deployed();
    fundraiserFactory = await FundraiserFactoryContract.new(fundraiser.address);
    await fundraiserFactory.createFundraiser(
      "beneficiary",
      "website",
      "image url",
      "description",
      accounts[1]
    );
  });

  it("should return the fundraiser address if the name exists", async () => {
    const fundraiser = await fundraiserFactory.fundraiserByName("beneficiary");
    assert(fundraiser, "fundraiser is null");
  });

  it("should NOT return the fundraiser if it does not exists", async () => {
    expectRevert(
      fundraiserFactory.fundraiserByName("DOES NOT EXIST"),
      "The requested fundraiser does not exist"
    );
  });
});
