import React from "react";
import 'bulma/css/bulma.css';
import '../../styles/Home.module.css';

export default function WalletCard(props) {
    return (
        <div className="card m-2" onClick={() => {
            props.connect()
            props.close()
        }}>
            <div className="card-content">
                <div className="media">
                    <div className="columns is-vcentered is-multiline is-mobile">
                        <div className="column is-one-quarter mr-4">
                            <figure className="image is-48x48">
                                {props.walletImg}
                            </figure>
                        </div>
                        <div className="column">
                            <p>{props.walletContent}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}