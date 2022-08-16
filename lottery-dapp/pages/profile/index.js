import React, { useEffect, useState } from "react";
import { useRef } from "react";
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from "web3";
import jazzicon from "@metamask/jazzicon";
import "bulma/css/bulma.css"
import styles from '../../styles/Home.module.css';
import bixcipLogo from '../images/bixcip-logo.png';
import Image from "next/image";
import { PrismaClient } from "@prisma/client";
import Bixcip from "../components/Bixcip";

let prisma;

export async function getStaticProps() {
    prisma = new PrismaClient();
    const posts = await prisma.assets.findMany();

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


    useEffect(async () => {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setConnectedAccount(`${accounts[0].slice(0, 4)}...${accounts[0].slice(-4,)}`);

        console.log("Profile tab: ", accounts);
        const element = profilePic.current;
        if (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(jazzicon(30, accounts[0]))
    }, [profilePic])


    return (
        <>
            <main className={styles.main}>
                <nav className="navbar mt-4 mb-4">
                    <div className="container">
                        <div className="navbar-brand">
                            <Image src={bixcipLogo} width="200px" height="100px" />
                        </div>
                        <div className="navbar-end mt-4 mb-4 is-flex is-align-items-center">
                            <div ref={profilePic}></div>
                            <p>{connectedAccount}</p>
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