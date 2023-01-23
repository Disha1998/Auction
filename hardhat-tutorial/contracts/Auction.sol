// SPDX-License-Identifire: MIT
pragma solidity ^0.8.0;

contract Auction {
    struct AuctionAgreement {
        uint256 auctionId;
        string title;
        address payable owner;
        uint256 msp;
        mapping(address => uint256) bids;
        bool auctionEnd;
        address[] bidders;
        uint256 auctionStartTime;
        uint256 auctionEndTime;
    }
    uint256 public numOfAuction;
    mapping(uint256 => AuctionAgreement) public auctions;

    function createAuctionContract(address payable _owner, string memory _title)
        public
        payable
    {
        require(msg.sender != address(0), "invalid address");
        AuctionAgreement storage auctionAgreement = auctions[numOfAuction];
        auctionAgreement.auctionId = numOfAuction;
        auctionAgreement.title = _title;
        auctionAgreement.owner = _owner;
        auctionAgreement.msp = msg.value;
        auctionAgreement.auctionStartTime = block.timestamp;
        auctionAgreement.auctionEnd = false;
        // auctionAgreement.auctionStartTime = block.timestamp;
        numOfAuction++;
    }

    function startAuction(uint256 _auctionId, uint256 _auctionEndTime) public {
        require(
            auctions[_auctionId].owner == msg.sender,
            "you are not owner of this auction"
        );
        require(_auctionEndTime > block.timestamp, "invalid end time");
        auctions[_auctionId].auctionStartTime = block.timestamp;
        auctions[_auctionId].auctionEndTime = _auctionEndTime;
    }

    function bid(uint256 _auctionId) public payable {
        require(
            auctions[_auctionId].auctionStartTime <= block.timestamp &&
                auctions[_auctionId].auctionEndTime >= block.timestamp,
            "we dont do it here"
        );
        require(
            msg.value >= auctions[_auctionId].msp,
            "bid must be greater than msp"
        );
        auctions[_auctionId].bids[msg.sender] = msg.value;
        auctions[_auctionId].bidders.push(msg.sender);
    }

    function endAuction(uint256 _auctionId) public {
        require(
            msg.sender == auctions[_auctionId].owner,
            "only owner can end auction"
        );
        require(
            block.timestamp >= auctions[_auctionId].auctionEndTime,
            "auction time is not ended yet"
        );
        auctions[_auctionId].auctionEnd = true;
    }

    function getHighestBid(uint256 _auctionId)
        public
        view
        returns (address, uint256)
    {
        address highestbidder;
        uint256 highestbid = 0;
        for (uint256 i = 0; i < auctions[_auctionId].bidders.length; i++) {
            if (
                auctions[_auctionId].bids[auctions[_auctionId].bidders[i]] >
                highestbid
            ) {
                highestbid = auctions[_auctionId].bids[
                    auctions[_auctionId].bidders[i]
                ];
                highestbidder = auctions[_auctionId].bidders[i];
            }
        }
        return (highestbidder, highestbid);
    }

    receive() external payable {}

    fallback() external payable {}
}
