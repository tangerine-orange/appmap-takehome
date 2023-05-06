import React from "react";
import { useParams } from "react-router-dom";

export default function Fetch() {
const { shortened } = useParams();
const [failed, setFailed] = React.useState(false);

React.useEffect(() => {
    fetch(`/api/urls/${shortened}`)
    .then((res) => res.json())
    .then((res) => {
        const { original } = res
        if (original) {
            console.log('original', original)
            window.location.href = original;
        } else {
            console.log('failed')
            setFailed(true);
        }
    })
    .catch((err) => {
        console.error(err);
        setFailed(true);
    })});

    const message = failed ? "URL not found" : "Redirecting...";
    return (
        <div>{message}</div>
    );
}