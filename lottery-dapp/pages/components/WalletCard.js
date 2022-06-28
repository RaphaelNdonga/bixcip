import React from "react";
import 'bulma/css/bulma.css';

export default function WalletCard(props) {
    return (
        <div class="card">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            {props.walletImg}
                        </figure>
                    </div>
                    <div class="media-content">
                        <p>{props.walletContent}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}