import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from '../../styles/Home.module.css';
import Image from "next/image";
import bixcipLogo from '../images/bixcip-logo.png';
import "bulma/css/bulma.css"
import { PrismaClient } from "@prisma/client"
import Bixcip from "../components/Bixcip";
import buyTicketsImg from '../images/buy_tickets.png';
import img1 from '../images/letter_1.png';
import img2 from '../images/letter_2.png';
import img3 from '../images/letter_3.png';
import Web3 from 'web3';
import 'bulma/css/bulma.css';
import lotteryAddress from "../blockchain/BIXCIPLotteryAddress.json";
import lotteryAbi from "../blockchain/BIXCIPLotteryAbi.json"
import Modal from '../components/Modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BigNumber, ethers } from 'ethers';
import Link from 'next/link';
import logoutImg from "../images/logout.png";
import profileImg from "../images/profile.png";

export async function getStaticProps() {
    const prisma = new PrismaClient();
    let posts;
    try {
        posts = await prisma.assets.findMany();
    } catch (error) {
        console.log("error while fetching prisma assets", error);
    }


    return {
        props: {
            assets: posts
        },
    };
}

export default function Play({ assets }) {
    const [bixcipData, setBixcipData] = useState(assets);

    const [bixcipSelected, setBixcipSelected] = useState([]);

    const handleCheck = (event) => {
        if (event.target.checked) {
            console.log("Data: ", event.target.id);
            setBixcipSelected(oldArray => [...oldArray, parseInt(event.target.id)]);
            console.log("items selected: ", bixcipSelected);
        } else {
            setBixcipSelected(oldArray => oldArray.filter((bixcip) => {
                return bixcip !== parseInt(event.target.id);
            }));
            console.log("items selected", bixcipSelected);
        }
    }

    const bixcipElements = bixcipData.map((data, i) => {
        return <Bixcip key={i} id={i} title={data.title} url={data.url} handleCheck={handleCheck} />
    });

    const [address, setAddress] = useState('');
    const [lcContract, setLcContract] = useState();
    const [connected, setConnected] = useState(false);
    const [connectClicked, setConnectClicked] = useState(false);
    const [rinkebyId, setRinkebyId] = useState("0x4");
    const [web3, setWeb3] = useState();
    const [totalArt, setTotalArt] = useState(0);
    const [totalArtPlayed, setTotalArtPlayed] = useState(0);
    const [totalEthPlayed, setTotalEthPlayed] = useState();
    const [endTime, setEndTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState("");
    const [startDate, setStartDate] = useState("");

    const [wcProvider, setWcProvider] = useState(new WalletConnectProvider({
        infuraId: "0f485d121a0f4dc2ad3891e12cb2c626"
    }));

    const viewProfileRef = useRef(null);

    const enterLotteryHandler = async () => {
        try {
            console.log("Lottery Address: ", lotteryAddress);
            const ticketFee = await lcContract.methods.getTicketFee().call();
            console.log("ticket fee: ", ticketFee);
            const bigTicketFee = BigNumber.from(ticketFee).mul(bixcipSelected.length);
            console.log("Ticket fee: ", bigTicketFee);
            await lcContract.methods.enter(bixcipSelected).send({
                from: address,
                value: bigTicketFee
            });
            viewProfileRef.current.click();
        } catch (err) {
            console.log("error while entering lottery: ", err.message)
        }
    }

    const connectMetamask = async () => {
        /* check if MetaMask is installed */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            /* request wallet connection */
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            console.log("connectMetamask: chainId: ", chainId);

            if (chainId !== rinkebyId) {
                console.log("connectMetamask: switching chains: ");
                await switchChain();
            }
            const requestedAccount = await window.ethereum.request({ method: "eth_requestAccounts" });
            localStorage.setItem('metamask', requestedAccount);
            setAddress(requestedAccount[0]);
            setConnected(true);
            /* create web3 instance & set to state */
            const web3 = new Web3(window.ethereum);
            /* set web3 instance in React state */
            setWeb3(web3);
            setupContractAndAddress(web3);

            window.ethereum.on('accountsChanged', checkConnection);
            window.ethereum.on('chainChanged', switchChain);
        } else {
            /* MetaMask is not installed */
            console.log("Metamask still not installed")
            alert("Please install MetaMask")
        }
    }

    const setupContractAndAddress = async (web3) => {
        /* get list of accounts */
        console.log("setting up contract and address");
        console.log("web3: ", web3);
        let accounts;
        if (wcProvider.wc.session.connected) {
            accounts = web3.eth.getAccounts();
        } else {
            accounts = await web3.eth.getAccounts();
        }
        console.log("setupcontractandaddressaccounts: ", accounts);

        if (wcProvider.wc.session.connected && accounts[0] === undefined) {
            console.log("setupContractAndAddress connecting to wallet connect");
            connectWalletConnect();
        }

        //This state occurs when a user has not logged in to metamask but they had connected before
        if (!wcProvider.wc.session.connected && accounts[0] === undefined) {
            console.log("setupContractAndAddress connecting to metamask");
            connectMetamask();
        }

        console.log(`lottery details ${lotteryAbi} ${lotteryAddress}`);

        const lc = new web3.eth.Contract(lotteryAbi, lotteryAddress);
        setLcContract(lc);
    }

    const checkConnection = (accounts) => {
        console.log('checking accounts...', accounts);
        console.log(accounts[0])
        if (accounts[0] === null || accounts[0] === "" || accounts[0] === undefined) {
            console.log("Setting connected to false");
            setConnected(false);
            setAddress("");
        } else {
            console.log("Setting connected to true");
            setConnected(true);
            setAddress(accounts[0]);
        }
    }

    const fetchAccounts = async () => {
        let accounts;
        if (wcProvider.wc.session.connected) {
            console.log("Fetching accounts from wcprovider")
            accounts = wcProvider.wc.session.accounts;
        } else {
            console.log("fetching accounts from metamask");
            accounts = [localStorage.getItem('metamask')];
        }
        checkConnection(accounts)
    }

    const getLotteryStats = async () => {
        const _totalArt = bixcipData.length;
        setTotalArt(_totalArt)
        const totalPlayers = await lcContract.methods.getPlayers().call();
        console.log("total players: ", totalPlayers);
        let artArray = [];
        for (let i = 0; i < totalPlayers.length; i++) {
            let currentPlayer = totalPlayers[i];
            console.log("current player: ", currentPlayer);
            let currentPlayerBets = await lcContract.methods.getPlayerBets(currentPlayer).call();
            console.log("current player wins: ", currentPlayerBets);
            artArray.push(...currentPlayerBets);
        }
        artArray = [... new Set(artArray)];
        console.log("total art played: ", artArray);

        setTotalArtPlayed(artArray.length);

        const _totalEthPlayed = (artArray.length * await lcContract.methods.getTicketFee().call()) / 10 ** 18;
        setTotalEthPlayed(_totalEthPlayed);

        const _timeFrame = await lcContract.methods.timeFrame().call();
        console.log("timeframe: ", _timeFrame);
        const javascriptTime = Date.now() / 1000;
        console.log("javascript time: ", javascriptTime);
        const _startTime = await lcContract.methods.startTime().call();
        const _startDate = new Date(_startTime * 1000);
        setStartDate(_startDate.toString());
        setEndTime(parseInt(_startTime) + parseInt(_timeFrame));
        console.log("start time: ", _startTime);
    }

    const calculateTimeLeft = () => {
        let timeRemaining = Math.floor(endTime - (Date.now() / 1000));
        let daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60));
        let hours = Math.floor((timeRemaining / (60 * 60)) % 24);
        let minutes = Math.floor((timeRemaining / (60)) % 60);
        let seconds = Math.floor((timeRemaining) % 60);
        let timeSentence = timeRemaining < 0 ? "..." : `${daysRemaining} days ${hours} hours ${minutes} minutes ${seconds} seconds `;
        return timeSentence;
    }

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    })

    useEffect(() => {
        fetchAccounts();
        let web3;
        if (wcProvider.wc.session.connected) {
            console.log("connecting to wallet connect web3: ")
            web3 = new Web3(wcProvider);
        } else {
            web3 = new Web3(window.ethereum);
        }
        /* set web3 instance in React state */
        setWeb3(web3);
        setupContractAndAddress(web3);
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            window.ethereum.on('accountsChanged', checkConnection);
            window.ethereum.on('chainChanged', switchChain);
        }

        if (wcProvider.wc.session.connected) {
            wcProvider.on("accountsChanged", checkConnection);
            wcProvider.on("chainChanged", switchChain);
            wcProvider.on("disconnect", disconnectHandler);
        }

        return () => {
            if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
                window.ethereum.removeListener('accountsChanged', checkConnection);
                window.ethereum.removeListener('chainChanged', switchChain);
            }
            if (wcProvider.wc.session.connected) {
                wcProvider.removeListener("accountsChanged", checkConnection);
                wcProvider.removeListener("chainChanged", switchChain);
                wcProvider.removeListener("disconnect", disconnectHandler);
            }
        }
    }, []);


    useEffect(() => {
        if (lcContract != undefined) {
            console.log("lottery contract: ", lcContract);
            getLotteryStats();
        }
    }, [lcContract]);

    const switchChain = async () => {
        console.log("Switching chain...")
        if (wcProvider.wc.session.connected) {
            await wcProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{
                    chainId: rinkebyId
                }]
            })
        } else if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{
                    chainId: rinkebyId
                }]
            })
        }
    }

    const disconnectHandler = () => {
        setAddress("");
        localStorage.removeItem('walletConnect');
        localStorage.removeItem('metamask');
        setConnected(false);
        if (wcProvider.wc.session.connected) {
            wcProvider.wc.killSession();
        }
    }

    const connectWalletConnect = async () => {
        await wcProvider.enable();
        const chainId = await wcProvider.request({ method: "eth_chainId" });
        console.log("Wallet connect chain id: ", chainId);
        if (`0x${chainId}` !== rinkebyId) {
            await switchChain()
        }
        const newChainId = await wcProvider.request({ method: "eth_chainId" });
        console.log("Wallet connect new chain id: ", newChainId);
        console.log("connectWalletConnect: wc connected: ", wcProvider.connected);

        if (!wcProvider.connected) {
            return;
        }

        const _web3 = new Web3(wcProvider);
        const accounts = await _web3.eth.getAccounts();
        console.log("Accounts obtained: ", accounts);
        setAddress(accounts[0]);
        localStorage.setItem('metamask', accounts[0]);
        setConnected(true);


        wcProvider.on("accountsChanged", checkConnection);
        wcProvider.on("chainChanged", switchChain);
        wcProvider.on("disconnect", disconnectHandler);
    }
    return (
        <div>
            <Head>
                <title>BIXCIP Lottery</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <nav className="navbar mt-4 mb-4">
                    <div className="container is-fluid">
                        <div className="navbar-brand">
                            <Link href="/"><Image className="is-clickable" src={bixcipLogo} width="200px" height="100px" /></Link>
                        </div>
                        <div className="navbar-end mt-4 mb-4">
                            {!connected ? <button className="button is-danger is-outlined mr-3" onClick={() => {

                                setConnectClicked(true)

                            }}>Login</button> :
                                <div className='dropdown is-hoverable'>
                                    <div className='dropdown-trigger'>
                                        <button className="button is-danger is-outlined mr-3" aria-haspopup="true" aria-controls="dropdown-menu1">
                                            <span>{address.slice(0, 4)}...{address.slice(-4,)} </span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className='dropdown-menu' id='dropdown-menu1' role="menu">
                                        <div className='dropdown-content'>
                                            <Link href="/account">
                                                <section ref={viewProfileRef} className='dropdown-item is-flex is-clickable  mb-2'>
                                                    <Image src={profileImg} height='20px' width='20px' />
                                                    <p className='ml-2'>
                                                        View Profile
                                                    </p>
                                                </section>
                                            </Link>
                                            <section className='dropdown-item is-flex is-clickable mb-2' onClick={disconnectHandler}>
                                                <Image src={logoutImg} height='20px' width='20px' />
                                                <p className='ml-2'>
                                                    Logout
                                                </p>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            }
                            {!connected ? <button onClick={() => {
                                alert("Login to play")
                            }} className="button is-danger">Play Lottery</button> : <Link href="/play"><button className="button is-danger">Play Lottery</button></Link>}
                        </div>
                    </div>
                </nav>
                <div className="container is-fluid">
                    {connectClicked && <Modal setConnectClicked={setConnectClicked} connectMetamask={connectMetamask} connectWalletConnect={() => {
                        connectWalletConnect();
                    }} />}
                    <p className="is-size-3">Lottery Start Date: </p>
                    <p className="is-size-5">{startDate}</p>
                    <p className="is-size-3">Time Remaining: </p>
                    <p className="is-size-5">{timeLeft}</p>
                    <p className="is-size-1">SELECT ART TO WIN</p>
                    <div className={styles.bixcip_list}>
                        {bixcipElements}
                    </div><div className="is-flex is-justify-content-center mt-6">
                        <p>You selected {bixcipSelected.length} artwork</p>
                    </div>
                    <div className="is-flex is-justify-content-center mt-5">
                        <p>Your next step is to purchase a ticket</p>
                    </div>
                    <div className="is-flex is-flex-direction-column is-align-items-center mt-5 mb-6">
                        <Image className="is-clickable" src={buyTicketsImg} height="100px" width="200px" onClick={enterLotteryHandler} />
                    </div>
                    <section className="columns is-centered mt-5 mb-5">
                        <section className="column is-flex is-flex-direction-column is-align-items-center">
                            <p className="is-size-3">Total Art Available</p>
                            <p className="is-size-3">{totalArt}</p>
                        </section>
                        <section className="column is-flex is-flex-direction-column is-align-items-center">
                            <p className="is-size-3">Total Art Played</p>
                            <p className="is-size-3">{totalArtPlayed}</p>
                        </section>
                        <section className="column is-flex is-flex-direction-column is-align-items-center">
                            <p className="is-size-3">Total Eth Played</p>
                            <p className="is-size-3">{totalEthPlayed}</p>
                        </section>
                    </section>
                    <div className="is-flex is-justify-content-center mt-5 is-size-3 ">
                        <p>HOW IT WORKS</p>
                    </div>
                    <section className='columns is-centered mt-5'>
                        <section className='column is-flex is-flex-direction-column is-align-items-center'>
                            <Image src={img1} height='50px' width='30px' />
                            <p className='mb-6'>Step 1: Select Art</p>
                            <p className='is-size-5'>Pick your favorite art. Cant decide? Pick more than one!</p>
                        </section>
                        <section className='column is-flex is-flex-direction-column is-align-items-center'>
                            <Image src={img2} height='50px' width='50px' />
                            <p className='mb-6'>Step 2: Purchase Ticket</p>
                            <p className='is-size-5'>Purchase a lottery ticket for each art piece. Cant decide? Pick more than one.</p>
                        </section>
                        <section className='column is-flex is-flex-direction-column is-align-items-center'>
                            <Image src={img3} height='50px' width='50px' />
                            <p className='mb-6'>Step 3: Win Art</p>
                            <p className='is-size-5'>Every round has 3 winners. Get lucky and win the art you choose.</p>
                        </section>
                    </section>

                </div>
            </main>
        </div>
    )
}