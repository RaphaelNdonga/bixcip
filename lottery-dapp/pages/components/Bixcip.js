import React from "react";
import Image from "next/image";
import styles from '../../styles/Home.module.css';

export default function Bixcip(props) {
    return (
        <div className={styles.bixcip_item}>
            <div className={styles.bixcip_img_frame}>
                <Image src={props.url} height="200px" width="200px" />
            </div>
            <p className="is-size-5">{props.title}</p>
        </div>
    )
}