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

    const setupContractAndAddress = async (web3) => {
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts();
        console.log("setupcontractandaddressaccounts: ", accounts);

        if (accounts[0] === undefined) {
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

    const getPlayerWins = async () => {
        let currentWins = await lcContract.methods.getPlayerWins(address).call();
        console.log("current wins: ", currentWins);
        let prizesWon = await lcContract.methods.getPlayerEthWins(address).call();
        setTotalWinnings(prizesWon);
        setPlayerWins(currentWins);
    }


    useEffect(() => {
        async function accountSetup() {
            const accounts = [localStorage.getItem('metamask')];
            console.log("profile page accounts: ", localStorage.getItem('metamask'));
            if (accounts[0] !== null)
                setConnectedAccount(`${accounts[0].slice(0, 4)}...${accounts[0].slice(-4,)}`);

            console.log("Profile tab: ", localStorage.getItem('metamask'));
            const element = profilePic.current;
            if (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(jazzicon(30, accounts[0]))
        }
        accountSetup();
        const web3 = new Web3(window.ethereum);
        setupContractAndAddress(web3);

        window.ethereum.on('accountsChanged', checkConnection);
        window.ethereum.on('chainChanged', switchChain);

        return () => {
            window.ethereum.removeListener('accountsChanged', checkConnection);
            window.ethereum.removeListener('chainChanged', switchChain);
        }

    }, [])

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