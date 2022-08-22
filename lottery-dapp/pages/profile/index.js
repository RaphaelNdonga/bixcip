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

    const bixcipElements = bixcipData.slice(0, 3).map((data, i) => {
        return <Bixcip key={i} id={i} title={data.title} url={data.url} />
    });

    let profilePic = useRef();
    const [connectedAccount, setConnectedAccount] = useState("");
    const [connected, setConnected] = useState(false);
    const [wcProvider, setWcProvider] = useState(new WalletConnectProvider({
        infuraId: "0f485d121a0f4dc2ad3891e12cb2c626"
    }));


    const checkConnection = (accounts) => {
        console.log('checking accounts...', accounts);
        console.log(accounts[0])
        if (accounts[0] === null) {
            console.log("Setting connected to false");
            setConnected(false)
        } else {
            console.log("Setting connected to true");
            setConnected(true)
        }
        setConnectedAccount(accounts[0])
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


    useEffect(() => {
        async function accountSetup() {
            const accounts = [localStorage.getItem('metamask')];
            if (accounts[0] !== null)
                setConnectedAccount(`${accounts[0].slice(0, 4)}...${accounts[0].slice(-4,)}`);

            console.log("Profile tab: ", accounts);
            const element = profilePic.current;
            if (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(jazzicon(30, accounts[0]))
        }
        accountSetup();

        window.ethereum.on('accountsChanged', checkConnection);
        window.ethereum.on('chainChanged', switchChain);

        return () => {
            window.ethereum.removeListener('accountsChanged', checkConnection);
            window.ethereum.removeListener('chainChanged', switchChain);
        }

    }, [profilePic])


    return (
        <>
            <main className={styles.main}>
                <nav className="navbar mt-4 mb-4">
                    <div className="container">
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
                <div className="container">
                    <section className="mt-5">
                        <p className="is-size-1">TOTAL WINNINGS</p>
                        <p className="is-size-3">{Math.random().toFixed(3) * 10}ETH</p>
                    </section>
                    <section className="mt-5">
                        <p className="is-size-1"> ARTWORK WON</p>
                        <div className={styles.bixcip_list}>
                            {bixcipElements}
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}