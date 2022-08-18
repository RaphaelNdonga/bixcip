import React, { useState, useEffect } from "react";
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
            console.log("Data: ", bixcipData[event.target.id]);
            setBixcipSelected(oldArray => [...oldArray, bixcipData[event.target.id]]);
            console.log("items selected: ", bixcipSelected);
        } else {
            setBixcipSelected(oldArray => oldArray.filter((bixcip) => {
                return bixcip.id !== (parseInt(event.target.id) + 1);
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

    const [wcProvider, setWcProvider] = useState(new WalletConnectProvider({
        infuraId: "0f485d121a0f4dc2ad3891e12cb2c626"
    }));

    const enterLotteryHandler = async () => {
        try {
            console.log("Lottery Address: ", lotteryAddress);
            const ticketFee = await lcContract.methods.getTicketFee().call();
            console.log("ticket fee: ", ticketFee);
            const bigTicketFee = BigNumber.from(ticketFee).mul(bixcipSelected.length);
            console.log("Ticket fee: ", bigTicketFee);
            await lcContract.methods.enter(bixcipSelected.length).send({
                from: address,
                value: bigTicketFee
            });
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
            await window.ethereum.request({ method: "eth_requestAccounts" });
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
        const accounts = await web3.eth.getAccounts();

        checkConnection(accounts);

        setAddress(accounts[0]);

        console.log(`lottery details ${lotteryAbi} ${lotteryAddress}`);

        const lc = new web3.eth.Contract(lotteryAbi, lotteryAddress);
        setLcContract(lc);
    }

    const checkConnection = (accounts) => {
        console.log('checking accounts...', accounts);
        console.log(accounts[0])
        if (accounts[0] === undefined) {
            console.log("Setting connected to false");
            setConnected(false)
        } else {
            console.log("Setting connected to true");
            setConnected(true)
        }
        setAddress(accounts[0])
    }

    const fetchAccounts = async () => {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        checkConnection(accounts)
    }

    useEffect(() => {
        fetchAccounts();
        const web3 = new Web3(window.ethereum);
        /* set web3 instance in React state */
        setWeb3(web3);
        setupContractAndAddress(web3);
    }, []);

    const switchChain = async () => {
        console.log("Switching chain...")
        if (wcProvider.connected) {
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
        console.log("Wallet disconnected")
        localStorage.clear();
        setConnected(false);
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
        const web3 = new Web3(wcProvider);
        setWeb3(web3);

        setupContractAndAddress(web3);

        console.log("connectWalletConnect: wc connected: ", wcProvider.connected);

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
                    <div className="container">
                        <div className="navbar-brand">
                            <Link href={"/"}><Image className="is-clickable" src={bixcipLogo} width="200px" height="100px" /></Link>
                        </div>
                        <div className="navbar-end mt-4 mb-4">
                            {!connected ? <button className="button is-danger is-outlined mr-3" onClick={() => {

                                setConnectClicked(true)

                            }}>Login</button> : <Link href="/profile"><button className="button is-danger is-outlined mr-3" >View Profile</button></Link>}
                            <Link href="/play"><button className="button is-danger">Play Lottery</button></Link>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    {connectClicked && <Modal setConnectClicked={setConnectClicked} connectMetamask={connectMetamask} connectWalletConnect={() => {
                        connectWalletConnect();
                    }} />}
                    <p className="is-size-1">SELECT ART TO WIN</p>
                    <div className={styles.bixcip_list}>
                        {bixcipElements}
                    </div><div className="is-flex is-justify-content-center mt-6">
                        <p>You selected {bixcipSelected.length} artwork</p>
                    </div>
                    <div className="is-flex is-justify-content-center mt-5">
                        <p>Your next step is to purchase a ticket</p>
                    </div>
                    <div className="is-flex is-justify-content-center mt-5 mb-6">
                        <Image className="is-clickable" src={buyTicketsImg} height="100px" width="200px" onClick={enterLotteryHandler} />
                    </div>
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