import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Web3 from 'web3';
import styles from '../styles/Home.module.css';
import 'bulma/css/bulma.css';
import Modal from './components/Modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Image from "next/image";
import bixcipLogo from '../pages/images/bixcip-logo.png';
// import slurpyImg from '../pages/images/slurpy.png'
import animationOne from '../pages/images/animation-one.gif'
import animationTwo from '../pages/images/animation-two.gif'
import metamaskWalletImg from '../pages/images/metamask_wallet.png';
import chainlinkImg from './images/chainlink.png';
import ethImg from './images/eth.png';
import artLeftImg from './images/artleft.png';
import walletImg from './images/wallet.png';
import roundWinnersImg from './images/round_winners.png';
import img1 from './images/letter_1.png';
import img2 from './images/letter_2.png';
import img3 from './images/letter_3.png';
import profileImg from './images/profile.png';
import logoutImg from './images/logout.png';
import Link from 'next/link';

export default function Home() {
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [connectClicked, setConnectClicked] = useState(false);
  const [rinkebyId, setRinkebyId] = useState("0x4");

  const [wcProvider, setWcProvider] = useState(new WalletConnectProvider({
    infuraId: "0f485d121a0f4dc2ad3891e12cb2c626"
  }));

  const howItWorksRef = useRef(null);

  const addPrismaAccount = async (account) => {
    const response = await fetch('api/accounts', {
      method: 'POST',
      body: JSON.stringify(account)
    })

    if (!response.ok) {
      console.log("Response: ", response);
      console.log("Response.body(): ", response.body);
      throw new Error(response.statusText);
    }

    return await response.json();
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
      setAddress(requestedAccount[0]);
      addPrismaAccount(requestedAccount[0]);

      localStorage.setItem('metamask', requestedAccount);
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
      console.log(accounts[0]);
      console.log("Setting connected to false");
      setConnected(false)
      setAddress("");
    } else {
      console.log(accounts[0]);
      console.log("Setting connected to true");
      setConnected(true)
      setAddress(accounts[0])
    }
  }

  const fetchAccounts = async () => {
    let accounts;
    if (wcProvider.wc.session.connected) {
      console.log("fetching accounts from wc provider");
      accounts = wcProvider.wc.session.accounts;
    } else {
      console.log("fetching accounts from metamask");
      accounts = [localStorage.getItem('metamask')];
    }
    checkConnection(accounts)
  }

  useEffect(() => {
    fetchAccounts();
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

  const disconnectHandler = async () => {
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
    addPrismaAccount(accounts[0]);
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
              <Image src={bixcipLogo} width="200px" height="100px" />
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
          <section className="mt-5">
            <div className="columns">
              <div className="column">
                <section className="mt-5">
                  <p className='is-size-1'>WIN ART EVERY WEEK!</p>
                  <p className='is-size-5 mb-5'>BIXCIP is a blockchain lottery for artists and art collectors. It uses Chainlink oracle to randomize winner selection for every art piece sold!</p>
                  <button className='button is-danger is-outlined mr-3' onClick={() => {
                    howItWorksRef.current.scrollIntoView();
                  }}>See how it works</button>
                  {!connected ? <button onClick={() => {
                    alert("Login to play")
                  }} className="button is-danger">Play Lottery</button> : <Link href="/play"><button className="button is-danger">Play Lottery</button></Link>}
                </section>
              </div>
              <div className='column is-flex is-justify-content-center'>
                <section className="mt-5">
                  {/* <Image src={slurpyImg} height='300px' width='250px' /> */}
                  <Image src={animationOne} height='300px' width='300px' />
                </section>
              </div>
            </div>
          </section>
          <section className='is-flex is-justify-content-center mt-5'>
            <p className='is-size-5'>Trusted by millions of developers </p>
          </section>
          <section className='is-flex is-justify-content-center'>
            <p className='is-size-5'>&amp;</p>
          </section>
          <section className='is-flex is-justify-content-center'>
            <p className='is-size-5'>Built on secure platforms</p>
          </section>
          <section className='columns is-mobile is-centered is-multiline mt-6'>
            <section className='column is-narrow is-flex is-flex-direction-column is-align-items-center mr-5'>
              <Image src={ethImg} height='50px' width='50px' />
              <p>Ethereum</p>
            </section>
            <section className='column is-narrow is-flex is-flex-direction-column is-align-items-center mr-5'>
              <Image src={metamaskWalletImg} height='50px' width='50px' />
              <p>Metamask/WalletConnect Wallet</p>
            </section>
            <section className='column is-narrow is-flex is-flex-direction-column is-align-items-center mr-5'>
              <Image src={chainlinkImg} height='50px' width='50px' />
              <p>Chainlink</p>
            </section>
          </section>
          <section className='is-flex is-justify-content-center mt-6 mb-6'>
            <p className='is-size-3'>FEATURES</p>
          </section>
          <section className='is-flex is-flex-direction-column'>
            <section className='columns'>
              <section className='column is-flex is-flex-direction-column is-align-items-start'>
                <p className='is-size-1 mt-5 mb-5'>Dope Art</p>
                <p className='is-size-5'>We work with artists, creators, innovators and designers to bring you the best art work from around the world</p>
              </section>
              <section className='column is-flex is-justify-content-center'>
                <Image src={artLeftImg} height='300px' width='250px' />
              </section>
            </section>
            <section className='columns'>
              <section className='column is-flex is-justify-content-center'>
                <Image src={walletImg} height='300px' width='400px' />
              </section>
              <section className='column is-flex is-flex-direction-column is-align-items-start'>
                <p className='is-size-1 mt-5 mb-5'>Anonymous Play</p>
                <p className='is-size-5'>The BIXCIP Lottery is truly anonymous. Not even the BIXCIP team knows the identity of those playing the lottery thanks to Ethereum</p>
              </section>
            </section>
            <section className='columns'>
              <section className='column is-flex is-flex-direction-column is-align-items-start'>
                <p className='is-size-1 mt-5 mb-5'>Truly Random</p>
                <p className='is-size-5'>The BIXCIP Lottery is truly random. Nobody can predict the winner in advance. Behind the hood, we use Chainlink, a decentralized oracle</p>
              </section>
              <section className='column is-flex is-justify-content-center'>
                <Image src={roundWinnersImg} height='300px' width='400px' />
              </section>
            </section>
          </section>
          <section className='is-flex is-justify-content-center mt-6'>
            <p className='is-size-3 mt-6 mb-6'>HOW IT WORKS</p>
          </section>
          <section className='columns is-centered'>
            <section ref={howItWorksRef} className='column is-flex is-flex-direction-column is-align-items-center'>
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
          <section className='is-flex is-justify-content-center mt-6'>
            <p className='is-size-3 mt-6 mb-6'>WHAT ARE YOU WAITING FOR?</p>
          </section>
          <section className='columns is-centered'>
            <p>
              <Image src={animationTwo} height='349px' width='698.5px' />
            </p>
          </section>
          <section className='columns is-centered' style={{ marginTop: 2 + 'em' }}>
            <p>
              <Link href="/play"><button className="button is-danger">Play Lottery</button></Link>
            </p>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2022 BIXCIP Team in collaboration with <a href="https://phoenixteam.io/">Phoenix Team</a></p>
      </footer>
    </div>
  )
}
