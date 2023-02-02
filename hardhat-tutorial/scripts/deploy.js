const { ethers } = require("hardhat");
const { CRYPTODEVS_NFT_CONTRACT_ADDRESS } = require("../constant");


async function main() {

  const AuctionEscrow = await ethers.getContractFactory("Auction");

  const Auctionescrow = await AuctionEscrow.deploy(CRYPTODEVS_NFT_CONTRACT_ADDRESS);

  await Auctionescrow.deployed();

  console.log("Auction contract deployed to", Auctionescrow.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // Auction contract deployed to 0xa7b4061A6fc06f0E55B74e2691EaE222F7f6E49a