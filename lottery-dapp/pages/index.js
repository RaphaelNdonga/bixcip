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

  useEffect(() => {
    updateState()
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
              {!connected ? <button class="button is-danger is-outlined mr-3" onClick={() => {

                setConnectClicked(true)

              }}>Login</button> : <button className="button is-danger is-outlined mr-3" disabled>Connected</button>}
              <button onClick={enterLotteryHandler} className="button is-danger">Play Lottery</button>
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
                  <p>Enter the lottery by sending 0.1 ether</p>
                  <button onClick={enterLotteryHandler} className="button is-link is-large is-light mt-3">Play now</button>
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
              <div className={`${styles.lotteryinfo} column`}>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Lottery History</h2>
                        {
                          (lotteryHistory && lotteryHistory.length > 0) && lotteryHistory.map(item => {
                            if (lotteryId != item.id) {
                              return <div className="history-entry mt-3" key={item.id}>
                                <div>Lottery #{item.id} winner:</div>
                                <div>
                                  <a href={`https://etherscan.io/address/${item.address}`} target="_blank" rel="noreferrer">
                                    {item.address}
                                  </a>
                                </div>
                              </div>
                            }
                          })
                        }
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Players ({lotteryPlayers.length})</h2>
                        <ul className="ml-0">
                          {
                            (lotteryPlayers && lotteryPlayers.length > 0) && lotteryPlayers.map((player, index) => {
                              return <li key={`${player}-${index}`}>
                                <a href={`https://etherscan.io/address/${player}`} target="_blank" rel="noreferrer">
                                  {player}
                                </a>
                              </li>
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Pot</h2>
                        <p>{lotteryPot} Ether</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2022 BIXCIP</p>
      </footer>
    </div>
  )
}
