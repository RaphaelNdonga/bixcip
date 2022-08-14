import React, { useState } from "react";
import Head from "next/head";
import styles from '../../styles/Home.module.css';
import Image from "next/image";
import bixcipLogo from '../images/bixcip-logo.png';
import "bulma/css/bulma.css"
import { PrismaClient } from "@prisma/client"
import Bixcip from "../components/Bixcip";

export async function getStaticProps() {
    const prisma = new PrismaClient();
    const posts = await prisma.assets.findMany();

    return {
        props: {
            assets: posts
        },
    };
}

export default function Play({ assets }) {
    const [bixcipData, setBixcipData] = useState(assets);
    console.log(bixcipData)
    const bixcipElements = bixcipData.map((data) => {
        return <Bixcip title={data.title} url={data.url} />
    });
    console.log(bixcipElements)
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
                            <Image src={bixcipLogo} width="200px" height="100px" />
                        </div>
                        <div className="navbar-end mt-4 mb-4">
                            <button class="button is-danger is-outlined mr-3">Login</button>
                            <button className="button is-danger">Play Lottery</button>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <p className="is-size-1">SELECT ART TO WIN</p>
                    <div className="image-container">
                        {bixcipElements}
                    </div>
                </div>
            </main>
        </div>
    )
}