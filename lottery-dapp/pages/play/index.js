import React, { useState } from "react";
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
    const bixcipElements = bixcipData.map((data, i) => {
        return <Bixcip key={i} title={data.title} url={data.url} />
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
                            <button className="button is-danger is-outlined mr-3">Login</button>
                            <button className="button is-danger">Play Lottery</button>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <p className="is-size-1">SELECT ART TO WIN</p>
                    <div className={styles.bixcip_list}>
                        {bixcipElements}
                    </div><div className="is-flex is-justify-content-center mt-6">
                        <p>You selected one artwork</p>
                    </div>
                    <div className="is-flex is-justify-content-center mt-5">
                        <p>Your next step is to purchase a ticket</p>
                    </div>
                    <div className="is-flex is-justify-content-center mt-5 mb-6">
                        <Image src={buyTicketsImg} height="100px" width="200px" />
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
            <footer className={styles.footer}>
                <p>&copy; 2022 BIXCIP</p>
            </footer>
        </div>
    )
}