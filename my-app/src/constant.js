export const AUCTION_ESCROW_CONTRACT_ADDRESS = "0xa7b4061A6fc06f0E55B74e2691EaE222F7f6E49a";

export const AUCTION_ESCROW_ABI =  [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_cryptoDevsNFT",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "auctions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "address payable",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "msp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "auctionEnd",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "auctionStartTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "auctionEndTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "highestBidder",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "highestBid",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "fundsReleased",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      }
    ],
    "name": "createAuctionContract",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "endAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "getBidders",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_bidder",
        "type": "address"
      }
    ],
    "name": "getBids",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "getHighestBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "numOfAuction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "refundBids",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      }
    ],
    "name": "releaseFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_auctionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_auctionEndTime",
        "type": "uint256"
      }
    ],
    "name": "startAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];