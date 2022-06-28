import React from "react";
import 'bulma/css/bulma.css';

export default function WalletCard(props) {
    return (
        <div class="card m-2" onClick={() => {
            props.connect()
            props.close()
        }}>
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            {props.walletImg}
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title">{props.walletContent}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}