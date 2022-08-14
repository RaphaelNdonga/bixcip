import React from "react";
import Image from "next/image";
import styles from '../../styles/Home.module.css';

export default function Bixcip(props) {
    return (
        <div className={styles.bixcip_item}>
            <Image src={props.url} height="200px" width="200px" />
            <p className="is-size-5">{props.title}</p>
        </div>
    )
}