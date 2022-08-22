import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from '../../styles/Home.module.css';
import Image from "next/image";
import bixcipLogo from '../images/bixcip-logo.png';
import "bulma/css/bulma.css"
import { PrismaClient } from "@prisma/client"
import Bixcip from "../components/Bixcip";
import img1 from '../images/letter_1.png';
import img2 from '../images/letter_2.png';
import img3 from '../images/letter_3.png';
import Web3 from 'web3';
import 'bulma/css/bulma.css';
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

export default function Account({ assets }) {
    const [bixcipData, setBixcipData] = useState(assets);
    const bixcipElements = bixcipData.map((data, i) => {
        return <Bixcip key={i} id={i} title={data.title} url={data.url} />
    });

    const [address, setAddress] = useState('');
    const [connected, setConnected] = useState(false);
    const [connectClicked, setConnectClicked] = useState(false);
    const [rinkebyId, setRinkebyId] = useState("0x4");

    const [wcProvider, setWcProvider] = useState(new WalletConnectProvider({
        infuraId: "0f485d121a0f4dc2ad3891e12cb2c626"
    }));

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

            window.ethereum.on('accountsChanged', checkConnection);
            window.ethereum.on('chainChanged', switchChain);
        } else {
            /* MetaMask is not installed */
            console.log("Metamask still not installed")
            alert("Please install MetaMask")
        }
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
        const accounts = [localStorage.getItem('metamask')];
        console.log("account fetchAccounts: ", accounts);
        checkConnection(accounts);
    }

    useEffect(() => {
        fetchAccounts();
        window.ethereum.on('accountsChanged', checkConnection);
        window.ethereum.on('chainChanged', switchChain);

        return () => {
            window.ethereum.removeListener('accountsChanged', checkConnection);
            window.ethereum.removeListener('chainChanged', switchChain);
        }
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
                                            <Link href="/profile">
                                                <section className='dropdown-item is-flex is-clickable  mb-2'>
                                                    <Image src={profileImg} height='20px' width='20px' />
                                                    <p className='ml-2'>
                                                        View Profile
                                                    </p>
                                                </section>
                                            </Link>
                                            <section className='dropdown-item is-flex is-clickable mb-2' onClick={() => {
                                                setAddress("");
                                                localStorage.removeItem('metamask', address);
                                                setConnected(false);
                                            }}>
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
                <div className="container">
                    {connectClicked && <Modal setConnectClicked={setConnectClicked} connectMetamask={connectMetamask} connectWalletConnect={() => {
                        connectWalletConnect();
                    }} />}
                    <p className="is-size-1 mb-4">PROFILE</p>
                    <section className="columns is-mobile">
                        <section className="column is-two-fifths">
                            <p>Connected Wallet: </p>
                            <p>Player Wallet: </p>
                        </section>
                        <section className="column">
                            <p> {address.slice(0, 4)}...{address.slice(-4,)}</p>
                            <p> {address.slice(0, 4)}...{address.slice(-4,)}</p>
                        </section>
                    </section>
                    <p className="is-size-1 mt-4">Current Bets </p>
                    <div className={styles.bixcip_list}>
                        {bixcipElements.slice(7, 10)}
                    </div>
                    <p className="is-size-1">Past Winnings </p>
                    <div className={styles.bixcip_list}>
                        {bixcipElements.slice(23, 29)}
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