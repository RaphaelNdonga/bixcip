import React from "react";
import 'bulma/css/bulma.css';
import WalletCard from "./WalletCard";
import walletconnectImage from "../images/walletconnect.svg";
import metamaskImage from "../images/metamask.svg";
import Image from "next/image";


export default function Modal(props) {
    return (
        <div class="modal is-active">
            <div class="modal-background" onClick={() => {
                props.setConnectClicked(false)
            }}></div>
            <div class="modal-content">
                <div class="box">
                    <WalletCard close={() => { props.setConnectClicked(false) }} connect={props.connectMetamask} walletImg={<Image src={metamaskImage} alt="placeholder image" />} walletContent="Metamask" />
                    <WalletCard close={() => { props.setConnectClicked(false) }} connect={props.connectWalletConnect} walletImg={<Image src={walletconnectImage} alt="Placeholder image" />} walletContent="Wallet Connect" />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" onClick={() => {
                props.setConnectClicked(false)
            }}></button>
        </div>
    )
}