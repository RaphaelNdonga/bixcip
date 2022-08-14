import React from "react";
import Image from "next/image";

export default function Bixcip(props) {
    return (
        <>
            <Image src={props.url} height="100px" width="100px" />
            <p className="is-size-5">{props.title}</p>
        </>
    )
}