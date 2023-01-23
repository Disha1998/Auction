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

  // Auction contract deployed to 0x6616B3A6F66EF50d3bD0e147A8286B1Ca8Ef988b