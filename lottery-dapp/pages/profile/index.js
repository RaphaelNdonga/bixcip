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


    useEffect(() => {
        async function accountSetup() {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts[0] !== undefined)
                setConnectedAccount(`${accounts[0].slice(0, 4)}...${accounts[0].slice(-4,)}`);

            console.log("Profile tab: ", accounts);
            const element = profilePic.current;
            if (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(jazzicon(30, accounts[0]))
        }
        accountSetup();

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