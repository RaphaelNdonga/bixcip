import React, { useEffect, useState } from "react";
import { useRef } from "react";
import jazzicon from "@metamask/jazzicon";
import "bulma/css/bulma.css"
import styles from '../../styles/Home.module.css';
import bixcipLogo from '../images/bixcip-logo.png';
import Image from "next/image";
import { PrismaClient } from "@prisma/client";
import Bixcip from "../components/Bixcip";
import Link from 'next/link';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from "web3";
import lotteryAddress from "../blockchain/BIXCIPLotteryAddress.json";
import lotteryAbi from "../blockchain/BIXCIPLotteryAbi.json";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";


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


export default function Profile({ assets }) {

    const [bixcipData, setBixcipData] = useState(assets);

    const bixcipElements = bixcipData.map((data, i) => {
        return <Bixcip key={i} id={i} title={data.title} url={data.url} />
    });

    let profilePic = useRef();
    const [connectedAccount, setConnectedAccount] = useState("");
    const [connected, setConnected] = useState(false);
    const [lcContract, setLcContract] = useState();
    const [wcProvider, setWcProvider] = useState(new WalletConnectProvider({
        infuraId: "0f485d121a0f4dc2ad3891e12cb2c626"
    }));

    const [playerWins, setPlayerWins] = useState([]);
    const [totalWinnings, setTotalWinnings] = useState();

    const [address, setAddress] = useState("");


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
            setAddress(accounts[0])
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

    const disconnectHandler = () => {
        setAddress("");
        localStorage.removeItem('walletConnect');
        localStorage.removeItem('metamask');
        setConnected(false);
        if (wcProvider.wc.session.connected) {
            wcProvider.wc.killSession();
        }
    }

    const setupContractAndAddress = async (web3) => {
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts();
        console.log("setupcontractandaddressaccounts: ", accounts);

        if (accounts[0] === undefined && !wcProvider.wc.connected) {
            console.log("connecting to metamask");
            connectMetamask();
        }

        checkConnection(accounts);

        setAddress(accounts[0]);

        console.log(`lottery details ${lotteryAbi} ${lotteryAddress}`);

        const lc = new web3.eth.Contract(lotteryAbi, lotteryAddress);
        console.log("lc contract: ", lc);
        setLcContract(lc);
    }

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

    const getPlayerWins = async () => {
        console.log("getPlayerWins reads the address as: ", address);
        let currentWins = await lcContract.methods.getPlayerWins(address).call();
        console.log("current wins: ", currentWins);
        let prizesWon = await lcContract.methods.getPlayerEthWins(address).call();
        setTotalWinnings(prizesWon);
        setPlayerWins(currentWins);
    }


    useEffect(() => {
        async function accountSetup() {
            let accounts;

            if (wcProvider.wc.session.connected) {
                accounts = wcProvider.wc.session.accounts;
            } else {
                accounts = [localStorage.getItem('metamask')];
            }
            if (accounts[0] !== null) {
                setAddress(accounts[0]);
                setConnectedAccount(`${accounts[0].slice(0, 4)}...${accounts[0].slice(-4,)}`);
            }

            const element = profilePic.current;
            if (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(jazzicon(30, accounts[0]))
        }
        accountSetup();
        let web3;
        if (wcProvider.wc.session.connected) {
            web3 = new Web3(wcProvider);
        } else {
            web3 = new Web3(window.ethereum);
        }
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
            getPlayerWins();
        }
    }, [lcContract])


    return (
        <>
            <main className={styles.main}>
                <nav className="navbar mt-4 mb-4">
                    <div className="container is-fluid">
                        <div className="navbar-brand">
                            <section>
                                <Link href={"/"}><Image className="is-clickable" src={bixcipLogo} width="200px" height="100px" /></Link>
                            </section>
                        </div>
                        <div className="box navbar-end is-flex is-align-items-center">
                            <div ref={profilePic}></div>
                            <p className="m-1">{connectedAccount}</p>
                        </div>
                    </div>
                </nav>
                <div className="container is-fluid">
                    {playerWins.length > 0 && <section>
                        <section className="mt-5">
                            <p className="is-size-1">TOTAL WINNINGS</p>
                            <p className="is-size-3">{totalWinnings}ETH</p>
                        </section>
                        <section className="mt-5">
                            <p className="is-size-1"> ARTWORK WON</p>
                            <div className={styles.bixcip_list}>
                                {playerWins}
                            </div>
                        </section>
                    </section>}
                    {playerWins.length === 0 &&
                        <section>
                            <p className="is-size-3 mb-3">Are you ready to Win the lottery?</p>
                            {!connected ? <button onClick={() => {
                                alert("Login to play")
                            }} className="button is-danger">Play Lottery</button> : <Link href="/play"><button className="button is-danger">Play Lottery</button></Link>}
                        </section>
                    }
                </div>
            </main>
        </>
    )
}