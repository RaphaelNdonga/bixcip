import { useState, useEffect } from 'react';
import Head from 'next/head';
import Web3 from 'web3';
import styles from '../styles/Home.module.css';
import 'bulma/css/bulma.css';
import lotteryAddress from "./blockchain/BIXCIPLotteryAddress.json";
import lotteryAbi from "./blockchain/BIXCIPLotteryAbi.json"
import Modal from './components/Modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BigNumber, ethers } from 'ethers';
import Image from "next/image";
import bixcipLogo from '../pages/images/bixcip-logo.png';
import slurpyImg from '../pages/images/slurpy.png'
import metamaskWalletImg from '../pages/images/metamask_wallet.png';
import chainlinkImg from './images/chainlink.png';
import ethImg from './images/eth.png';
import artLeftImg from './images/artleft.png';
import walletImg from './images/wallet.png';
import roundWinnersImg from './images/round_winners.png';
import img1 from './images/letter_1.png';
import img2 from './images/letter_2.png';
import img3 from './images/letter_3.png';
import Link from 'next/link';

export default function Home() {
  const [address, setAddress] = useState('');
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [lotteryPlayers, setPlayers] = useState([]);
  const [lotteryHistory, setLotteryHistory] = useState([]);
  const [lotteryId, setLotteryId] = useState();
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [connected, setConnected] = useState(false);
  const [connectClicked, setConnectClicked] = useState(false);
  const [rinkebyId, setRinkebyId] = useState("0x4");
  const [web3, setWeb3] = useState();

  const [wcProvider, setWcProvider] = useState(new WalletConnectProvider({
    infuraId: "0f485d121a0f4dc2ad3891e12cb2c626"
  }));

  const updateState = () => {
    if (lcContract) {
      getPot()
      getLotteryId()
      getPlayers()
    }
  }

  const getPot = async () => {
    const pot = await web3.eth.getBalance(lotteryAddress);
    console.log("Pot is : ", pot);
    setLotteryPot(ethers.utils.formatEther(pot));
  }

  const getPlayers = async () => {
    const players = await lcContract.methods.getPlayers().call()
    setPlayers(players)
  }

  const getHistory = async (id) => {
    setLotteryHistory([])
    for (let i = parseInt(id); i > 0; i--) {
      const winnerAddress = await lcContract.methods.lotteryHistory(i).call()
      const historyObj = {}
      historyObj.id = i
      historyObj.address = winnerAddress
      setLotteryHistory(lotteryHistory => [...lotteryHistory, historyObj])
    }
  }

  const getLotteryId = async () => {
    const lotteryId = await lcContract.methods.lotteryId().call()
    setLotteryId(lotteryId)
    await getHistory(lotteryId)
  }

  const enterLotteryHandler = async () => {
    setError('')
    setSuccessMsg('')
    try {
      console.log("Lottery Address: ", lotteryAddress);
      const ticketFee = await lcContract.methods.getTicketFee().call();
      const bigTicketFee = BigNumber.from(ticketFee);
      console.log("Ticket fee: ", bigTicketFee);
      await lcContract.methods.enter().send({
        from: address,
        value: bigTicketFee
      });
      updateState();
    } catch (err) {
      setError(err.message)
    }
  }

  const connectMetamask = async () => {
    setError('');
    setSuccessMsg('');
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
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    checkConnection(accounts)
  }

  useEffect(() => {
    fetchAccounts();
    updateState();
  }, [lcContract]);

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
    setWeb3(web3)

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
              <Image src={bixcipLogo} width="200px" height="100px" />
            </div>
            <div className="navbar-end mt-4 mb-4">
              {!connected ? <button className="button is-danger is-outlined mr-3" onClick={() => {

                setConnectClicked(true)

              }}>Login</button> : <Link href="/profile"><button className="button is-danger is-outlined mr-3" >View Profile</button></Link>}
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
          <section className="mt-5">
            <div className="columns">
              <div className="column">
                <section className="mt-5">
                  <p className='is-size-1'>WIN ART EVERY WEEK!</p>
                  <p className='is-size-5 mb-5'>BIXCIP is a blockchain lottery for artists and art collectors. It uses Chainlink oracle to randomize winner selection for every art piece sold!</p>
                  <button className='button is-danger is-outlined mr-3'>See how it works</button>
                  {!connected ? <button onClick={() => {
                    alert("Login to play")
                  }} className="button is-danger">Play Lottery</button> : <Link href="/play"><button className="button is-danger">Play Lottery</button></Link>}
                </section>
                <section>
                  <div className="container has-text-danger mt-6">
                    <p>{error}</p>
                  </div>
                </section>
                <section>
                  <div className="container has-text-success mt-6">
                    <p>{successMsg}</p>
                  </div>
                </section>
              </div>
              <div className='column is-flex is-justify-content-center'>
                <section className="mt-5">
                  <Image src={slurpyImg} height='300px' width='250px' />
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
              <section className='column is-flex is-flex-direction-column is-align-items-end'>
                <Image src={artLeftImg} height='300px' width='250px' />
              </section>
            </section>
            <section className='columns'>
              <section className='column is-flex is-flex-direction-column is-align-items-start'>
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
              <section className='column is-flex is-flex-direction-column is-align-items-end'>
                <Image src={roundWinnersImg} height='300px' width='400px' />
              </section>
            </section>
          </section>
          <section className='is-flex is-justify-content-center mt-6'>
            <p className='is-size-3 mt-6 mb-6'>HOW IT WORKS</p>
          </section>
          <section className='columns is-centered'>
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
