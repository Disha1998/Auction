const {ethers} = require("hardhat");

async function main () {

  const AuctionEscrow = await ethers.getContractFactory("Auction");

  const Auctionescrow = await AuctionEscrow.deploy();

  await Auctionescrow.deployed();

  console.log("Auction contract deployed to", Auctionescrow.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // Auction contract deployed to 0x0286AE4384C9d8bbeE096486a80A0d4077886925