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

  // Auction contract deployed to 0x245B7d00068aC0E293eAC1014Bb3270a140ff818