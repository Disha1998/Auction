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
    const [auctionEndTime, setAuctionEndTime] = useState("");
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
        console.log('clientAddress:', clientAddress);
        // Send the transaction to create the escrow agreement
        const tx = await escroContract.createAuctionContract(clientAddress, title, { value: ethers.utils.parseEther(msp) });

        console.log('tx====', tx);
        setLoading(true)
        await tx.wait();
        // setAuctionId('');
        setMsp(0)
        // Update the state to reflect the new escrow agreement
        // setFundsReleased(false);

        // getNumOfAgreements();
        setLoading(false);
        alert('Auction  created successfully.');
        alert('MSP  deposited successfully.');
    }

    const startAuction = async (id) => {
        console.log(id, '--id');
        const signer = await getProviderOrSigner(true);


        // async function handleStartAuction() {
        //         try {
        //             const tx = await contract.startAuction(auctionId, auctionEndTime);
        //             await tx.wait();
        //             setStatus('Auction started successfully');
        //         } catch (err) {
        //             setStatus('Error starting auction: ' + err.message);
        //         }
        //     }

        const provider = await getProviderOrSigner();
        const escroContract = getAuctionContractInstance(signer);
        // Get the current block timestamp
        const blockTimestamp = await provider.getBlockNumber(id);
        console.log('blockTimestamp=>', blockTimestamp);
        // Check if the user is the owner of the auction
        // const owner = await contract.functions.auctions(auctionId).owner();
        if (clientAddress !== signer.address) {
            setError("You are not the owner of this auction");
            return;
        }
        // Check if the auction end time is valid
        if (auctionEndTime <= blockTimestamp) {
            setError("Invalid end time");
            return;
        }

        const tx = await escroContract.startAuction(clientAddress, auctionEndTime);
        setLoading(true);
        console.log('tx', tx);

        await tx.wait();
        setStartAuction()
        setLoading(false);
        setAuctionEndTime("");
        alert('Auction started...!!')

        // let agreement = await escroContract.startAuction();
        // setStartAuction(agreement.toNumber())
        // console.log(agreement, 'num of auction');
    }
    function ParsedAgreement(agreeId, owner, title, msp, starttime, endtime) {
        this.agreeId = agreeId;
        this.owner = owner;
        this.title = title;
        this.msp = msp;
        this.starttime = moment().format('LTS');  // 5:02:17 PM
        ;
        this.endtime = endtime
        // this.release = released
    }

    useEffect(() => {
        getTotalNumOfAuction();
        if (totalNumOfAuctions > 0) {
            fetchAllAuctions()
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
            // console.log(auction)
            const actn = new ParsedAgreement(id, auction.owner, auction.title,
                auction.msp.toNumber(), auction.starttime, auction.endtime)

            // console.log(actn, 'agreement by ID');
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

                allAuctions.push(auction);
                //     if (agreement.clientAdd === clientAddress) {
                //         allClientAgreements.push(agreement);

                //     } else if (agreement.providerAdd === clientAddress) {
                //         allProviderAgreements.push(agreement)
                //     } else { }

                //     console.log(agreement.clientAdd, 'agreement');
                //     // allClientAgreements.push(agreement);
                // }
                // console.log(allClientAgreements, 'allClientAgreements')
                // console.log(allProviderAgreements, 'allProviderAgreements')
                // setEveryAgreementAsClient(allClientAgreements);
                // setEveryAgreementAsServiceprovider(allProviderAgreements);
            }
            setEveryAuction(allAuctions);
        } catch (error) {
            console.log(error);
        }
    }

    console.log('everyAuction==', everyAuction);

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
        console.log(agreement, 'num of auction');
    }


    console.log(StartAuction, '--StartAuction');
    return (
        <>
            <div>
                <h1>
                    Auction by Di
                </h1>
            </div>
            <div>Owner : {clientAddress}</div>
            <div>Highest Bid : </div>
            {/* 1)Create Auction */}
            <div>
                <lable> Title of Auction : </lable> <input type="text"
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                {/* {console.log('title', title)} */}
            </div>
            <lable> MSP : </lable> <input type="number"
                onChange={(e) => { setMsp(e.target.value) }}
            />
            {/* {console.log('MSP', msp)} */}

            <div>
                {/* <lable> Add Bid : </lable> <input type="number" /> */}
                <div> <button onClick={createAuction}>Create Auction</button></div>
            </div>
            <div>
                <h2>Created Auctions</h2>
                {
                    everyAuction && everyAuction.map((evryauction) => {
                        return (
                            <>
                                <div style={{ marginLeft: "", marginTop: "50px", border: "1px solid grey", display: "inline-block", padding: "2% 5%" }} className='container offset-2 col-5'>

                                    <p>Agreement Id : {evryauction.agreeId}</p>
                                    <p>Owner: {evryauction.owner}</p>
                                    <p>Start Time:{evryauction.starttime}</p>
                                    <p>End Time:{evryauction.endtime}</p>
                                    <label htmlFor="auctionEndTime">Auction End Time:</label>
                                    <input
                                        type="time"
                                        id="auctionEndTime"
                                        value={auctionEndTime}
                                        onChange={(e) => setAuctionEndTime(e.target.value)}
                                    />


                                    <h3>Title : {evryauction.title}</h3>
                                    <h4>MSP : {evryauction.msp / 1000000000000000000} Ether</h4>
                                    <div >
                                        <button style={{ margin: "20px" }}
                                            onClick={startAuction}
                                        >Start Auction</button>

                                        <button>Participate in auction</button>

                                    </div>

                                </div>
                            </>
                        )
                    })
                }
            </div>
            {error && <p>{error}</p>}

        </>

    )
}





// function StartAuction({ auctionId, auctionEndTime }) {
//     const [status, setStatus] = useState('');
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, ABI, signer);

//     async function handleStartAuction() {
//         try {
//             const tx = await contract.startAuction(auctionId, auctionEndTime);
//             await tx.wait();
//             setStatus('Auction started successfully');
//         } catch (err) {
//             setStatus('Error starting auction: ' + err.message);
//         }
//     }

//     return (
//         <div>
//             <button onClick={handleStartAuction}>Start Auction</button>
//             <div>{status}</div>
//         </div>
//     );
// }
