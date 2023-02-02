import React, { useEffect, useRef, useState } from 'react';
import Web3Modal from "web3modal";
import { ethers, Contract, providers, Signer } from 'ethers';
import { AUCTION_ESCROW_CONTRACT_ADDRESS, AUCTION_ESCROW_ABI } from './constant';
import moment from 'moment'
export default function Auction() {
    const [title, setTitle] = useState();
    const [clientAddress, setClientAddress] = useState();
    const [everyAuction, setEveryAuction] = useState([]);
    const [StartAuction, setStartAuction] = useState();
    const [auctionEndTime, setAuctionEndTime] = useState();
    const [highestbid, sethighestBid] = useState()
    const [bid, setBid] = useState();
    // console.log(auctionEndTime);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const [msp, setMsp] = useState(0);
    const [totalNumOfAuctions, setTotalNumOfAuctions] = useState(0);
    const web3ModalRef = useRef();
    const [walletConnected, setWalletConnected] = useState(false);
    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
        // console.log((await userAddress).toLowerCase())
        const signerForUserAddress = await web3Provider.getSigner();
        const clientAddress = await signerForUserAddress.getAddress();
        setClientAddress(clientAddress);
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5) {
            window.alert("Please switch to the Goerli network!");
            throw new Error("Please switch to the Goerli network");
        }
        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    }
    // console.log('clientAddress:', clientAddress,); 
    const connectWallet = async () => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
        } catch (error) {
            console.log(error);
        }
    }
    // Create Auction --------
    const createAuction = async () => {
        // Validate inputs
        if (clientAddress == null || title == null || msp == null) {
            alert('Please enter all required fields.');
            return;
        }
        const signer = await getProviderOrSigner(true);
        const escroContract = getAuctionContractInstance(signer);
        // console.log('clientAddress:', clientAddress);
        // Send the transaction to create the escrow agreement
        const tx = await escroContract.createAuctionContract(clientAddress, title, { value: ethers.utils.parseEther(msp) });
        // console.log('tx====', tx);
        setLoading(true)
        await tx.wait();
        // setAuctionId('');
        setMsp(0)
        setLoading(false);
        alert('Auction  created successfully.');
        alert('MSP  deposited successfully.');
    }
    const startAuction = async (_id, _endTime) => {
        console.log('_id----', _id);
        const signer = await getProviderOrSigner(true);
        const auctionContract = getAuctionContractInstance(signer);
        const tx = await auctionContract.startAuction(_id, auctionEndTime);
        await tx.wait();
        alert('Auction  Started!!');
    }
    function getReadableTime(mili) {
        if (mili > 0) {
            let date = new Date(mili * 1000);
            let time = date.toLocaleString();
            return time;
        } else {
            return null;
        }
    }
    async function getUinxTime(time) {
        console.log();
        // e.preventDefault();
        let timestamp = await moment(time, "HH:mm").unix();
        // console.log(timestamp)
        setAuctionEndTime(timestamp);
    }
    async function startAuct(id) {
        await startAuction(id, auctionEndTime);
    }
    function ParsedAgreement(_agreeId, _owner, _title, _msp, _starttime, _endtime, _highestBidder, _highestBid, _auctionend, _allBidders, _allBid) {
        this.agreeId = _agreeId;
        this.owner = _owner;
        this.title = _title;
        this.msp = _msp;
        this.starttime = getReadableTime(_starttime);
        this.endtime = getReadableTime(_endtime);
        this.highestBidder = _highestBidder;
        this.highestBid = _highestBid;
        this.auctionEnd = _auctionend;
        this.allBidders = _allBidders;
        this.allBid = _allBid;


        // this.release = released
    }
    useEffect(() => {
        getTotalNumOfAuction();
        if (totalNumOfAuctions > 0) {
            fetchAllAuctions()
            // GetHighestBid();
        }
    }, [totalNumOfAuctions])
    useEffect(() => {
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: "goerli",
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet().then(async () => {
                "wallet connected"
            })
        }
    }, []);
    const fetchAuctionById = async (id) => {
        // console.log('erntered fetch by id', id);
        try {
            const provider = await getProviderOrSigner();
            const escroContract = getAuctionContractInstance(provider);
            let auction = await escroContract.auctions(id);
            let allbiders = await escroContract.getBidders(id);
            console.log('allbiders--', allbiders.length);

            let allBidsAndBiddersArr = [];
            for (let i = 0; i < allbiders.length; i++) {
                let bid = await escroContract.getBids(id, allbiders[i]);
                console.log('fdsfdsfsgs', [{ [allbiders[i]]: bid }]);
                allBidsAndBiddersArr.push({ [allbiders[i]]: bid.toNumber() / 1000000000000000000 })

            }
            const actn = new ParsedAgreement(id, auction.owner, auction.title,
                auction.msp.toNumber(), auction.auctionStartTime.toNumber(), auction.auctionEndTime.toNumber(), auction.highestBidder, auction.highestBid.toNumber() / 1000000000000000000, auction.auctionEnd, allbiders, allBidsAndBiddersArr)
            console.log('actn--', actn);
            return actn;

        } catch (error) {
            console.log(error);
        };
    }


    const fetchAllAuctions = async () => {
        try {
            const allAuctions = [];
            for (let i = 0; i < totalNumOfAuctions; i++) {
                const auction = await fetchAuctionById(i);
                // console.log('auction..', auction);
                allAuctions.push(auction);
            }
            // console.log(allAuctions);
            setEveryAuction(allAuctions);
        } catch (error) {
            console.log(error);
        }
    }
    const getAuctionContractInstance = (providerOrSigner) => {
        return new Contract(
            AUCTION_ESCROW_CONTRACT_ADDRESS,
            AUCTION_ESCROW_ABI,
            providerOrSigner
        );
    };
    const getTotalNumOfAuction = async () => {
        const provider = await getProviderOrSigner();
        const escroContract = getAuctionContractInstance(provider);
        let agreement = await escroContract.numOfAuction();
        setTotalNumOfAuctions(agreement.toNumber())
        // console.log(agreement, 'num of auction');
    }
    // console.log(StartAuction, '--StartAuction');
    const makeAbid = async (id) => {
        const signer = await getProviderOrSigner(true);
        const escroContract = getAuctionContractInstance(signer);
        let tx = await escroContract.bid(id, { value: ethers.utils.parseEther(bid) });

        setLoading(true);
        await tx.wait();

        alert('You have made a Bid');
        setLoading(false)

    }

    const ReleaseFunds = async (id) => {

        const signer = await getProviderOrSigner(true);
        const escroContract = getAuctionContractInstance(signer);
        let tx = await escroContract.releaseFunds(id);

        setLoading(true);
        await tx.wait();

        alert('Relese Funds successfully!!!!');
        setLoading(false)
    }

    const GetBidders = async (id) => {
        const signer = await getProviderOrSigner(true);
        const escroContract = getAuctionContractInstance(signer);
        let tx = await escroContract.getBidders(id);

        setLoading(true);
        await tx.wait();

        alert('GetBidders....!!!');
        setLoading(false)
    }

    return (
        <>
            <div>
                <h1>Auction by Ids</h1>
            </div>
            <div>Curruent user : {clientAddress}
            </div>
            {/* <div>Highest Bid : </div> */}
            {/* 1)Create Auction */}
            <div>
                <lable> Title of Auction : </lable>
                <input type="text"
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                {/* {console.log('title', title)} */}
            </div>
            <lable> MSP : </lable>
            <input type="number"
                onChange={(e) => { setMsp(e.target.value) }}
            />
            {/* {console.log('MSP', msp)} */}
            <div>
                {/* <lable> Add Bid : </lable> <input type="number" /> */}
                <div> <button onClick={createAuction}>Create Auction</button></div>
            </div>
            <div>
                <h2>Created Auctions</h2>                {
                    everyAuction && everyAuction.map((evryauction) => {
                        return (
                            <>                                <div style={{ marginLeft: "", marginTop: "50px", border: "1px solid grey", display: "inline-block", padding: "2% 5%" }} className='container offset-2 col-5'>
                                <p>Agreement Id : {evryauction?.agreeId}</p>
                                <p>Owner: {evryauction?.owner}</p>
                                <p>Start Time:{evryauction?.starttime}
                                </p>
                                <p>End Time:{evryauction?.endtime}
                                </p>
                                {
                                    evryauction?.endtime ? <div>
                                        <button onClick={() => ReleaseFunds(evryauction?.agreeId)}>Relese Funds</button>

                                    </div> :
                                        <div>
                                            <label htmlFor="auctionEndTime">Auction End Time:</label>
                                            <input
                                                type="time"
                                                onChange={(e) =>                                            // setAuctionEndTime(e.target.value)
                                                    getUinxTime(e.target.value)
                                                }
                                            />
                                        </div>
                                }


                                <h3>Title : {evryauction?.title}</h3>
                                <h4>MSP : {evryauction?.msp / 1000000000000000000} Ether</h4>                                    <div>
                                    <button style={{ margin: "20px" }}
                                        onClick={() => startAuction(evryauction?.agreeId)}
                                    >Start Auction
                                    </button>

                                    <h4>Highest Bidder = {evryauction?.highestBidder}</h4>
                                    <h4>Highest Bid = {evryauction.highestBid} </h4>
                                    <div>
                                        <h1>All bidders </h1>
                                        {
                                            <ul>
                                                {
                                                    evryauction.allBid.map((bid) => (
                                                        <li>
                                                            {
                                                                Object.entries(bid).map(([key, value]) => (
                                                                    <p>{key}: {value}</p>
                                                                ))
                                                            }
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        }
                                    </div>

                                    <div>
                                        <label>Bid:</label>
                                        <input type="number"
                                            onChange={(e) => setBid(e.target.value)}
                                        />
                                        {console.log('bid,', bid)}
                                        <button
                                            onClick={() => makeAbid(evryauction?.agreeId)}
                                        >Make a Bid</button>
                                    </div>
                                    {/* ) 
                                            : <lable>Auction is not started yet!!!!</lable> */}
                                    {/* } */}
                                </div>


                            </div>
                                {/* <h2>{console.log('listofbids',listofbids)}
                                </h2> */}
                            </>
                        )
                    })
                }
            </div>
            {error && <p>{error}</p>}
        </>)
}