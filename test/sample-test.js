const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Market", function () {
  // Define shared contract variables for testing
  let owner;
  let addr1;
  let addr2;
  let Market;
  let market;
  let MockNFT;
  let mockNFT;

  const zeroAddress = '0x0000000000000000000000000000000000000000';

  // Deploy contract before each test case
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy MockNFT contract
    MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();

    await mockNFT.deployed();

    // Deploy Market contract
    Market = await ethers.getContractFactory("Market");
    market = await Market.deploy(mockNFT.address);

    await market.deployed();
  });

  it("should deploy market and mockNFT with owner address as owner and correct MockNFT addr", async function () {
    expect(await market.owner()).to.equal(owner.address);
    expect(await mockNFT.owner()).to.equal(owner.address);

    expect(await market._mockNFTAddr()).to.equal(mockNFT.address);
  });

  it("should change mockNFT address on setMockNFTAddr() from only owner", async function () {
    await market.connect(owner).setMockNFTAddr(mockNFT.address);
    expect(await market._mockNFTAddr()).to.equal(mockNFT.address);

    await expect(market.connect(addr2).setMockNFTAddr(mockNFT.address)).to.be.reverted;
  });

  it("should use callMint as owner", async function () {
    // Transfer ownership of MockNFT contract
    await mockNFT.connect(owner).transferOwnership(market.address);

    // Set MockNFT address inside Market contract
    await market.connect(owner).setMockNFTAddr(mockNFT.address)

    // Try to call mint through Market contract interfacing with MockNFT contract
    await market.connect(owner).callMint("test_uri");

    // Expect owner of minted NFT is now the market address
    expect(await mockNFT.ownerOf(1)).to.equal(market.address);

    // Try to call mint using an address other than owner
    await expect(market.connect(addr1).callMint("test_uri")).to.be.reverted;
  });

  it("should list an owned item for sale", async function () {
    await market.connect(market.address).listItem(1, 50);

  });
});
