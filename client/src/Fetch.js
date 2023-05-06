import React from "react";
import { useParams } from "react-router-dom";

export default function Fetch() {
    const { shortened } = useParams();
    const [failed, setFailed] = React.useState(false);
    const [passwordPrompt, setPasswordPrompt] = React.useState(false);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        const { readPassword } = formJson;
        fetchUrl(readPassword);
    }

    const fetchUrl = (readPassword) => {
        fetch(`/api/urls/shortened/${shortened}`, {
            method: "POST",
            body: JSON.stringify({ readPassword }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((res) => {
            const { original } = res
            if (original) {
                console.log('original', original)
                window.location.href = original;
            } else if (res.error === "Incorrect password") {
                setPasswordPrompt(true);
            } else {
                console.log('failed')
                setFailed(true);
            }
        })
        .catch((err) => {
            console.error(err);
            setFailed(true);
        })
    };


    React.useEffect(() => fetchUrl());

    const passwordPromptComponent = (
        <form method="post" onSubmit={handleSubmit}>
            <label>
                Password:
                <input type="password" name="readPassword" />
            </label>
            <button>Submit</button>
        </form>
    );

    return (
        <div>
            Password Required for this URL
            {passwordPrompt ? passwordPromptComponent : failed ? "URL not found" : "Redirecting..."}
        </div>
    );
}