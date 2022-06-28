import React from "react";
import 'bulma/css/bulma.css';
import WalletCard from "./WalletCard";
import walletconnectImage from "../images/walletconnect.svg";
import metamaskImage from "../images/metamask.svg";
import Image from "next/image";


export default function Modal(props) {
    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={() => {
                props.setConnectClicked(false)
            }}></div>
            <div className="modal-content">
                <div className="box">
                    <p className="subtitle m-2">Connect your wallet</p>
                    <WalletCard close={() => { props.setConnectClicked(false) }} connect={props.connectMetamask} walletImg={<Image src={metamaskImage} alt="placeholder image" />} walletContent="Metamask" />
                    <WalletCard close={() => { props.setConnectClicked(false) }} connect={props.connectWalletConnect} walletImg={<Image src={walletconnectImage} alt="Placeholder image" />} walletContent="WalletConnect" />
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => {
                props.setConnectClicked(false)
            }}></button>
        </div>
    )
}