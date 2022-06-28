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
                <WalletCard walletImg={<Image src={metamaskImage} alt="placeshika image" />} walletContent="Metamask" />
                <WalletCard walletImg={<Image src={walletconnectImage} alt="Placeholder image" />} walletContent="Wallet Connect" />
            </div>
            <button class="modal-close is-large" aria-label="close" onClick={() => {
                props.setConnectClicked(false)
            }}></button>
        </div>
    )
}