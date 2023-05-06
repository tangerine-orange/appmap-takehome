import React from "react";
import { Link } from "react-router-dom";

const Form = ({ onSubmit }) => (
    <form method="post" onSubmit={onSubmit}>
        <div>
            <label>
                url:
                <input name="originalUrl" />
            </label>
            <br/>
            <label>
                read password (optional):
                <input type="password" name="readPassword" />
            </label>
            <br/>
            <label>
                write password (optional):
                <input type="password" name="writePassword" />
            </label>
        </div>
        <button>Shorten</button>
    </form>
);

const Result = ({ shortened }) => (
    <div>
        <p>Shortened URL: <Link to={`/${shortened}`}>{`${window.location.host}/${shortened}`}</Link></p>
    </div>
);

const Create = () => {
    const [urls, setUrls] = React.useState(null);
    const [shortened, setShortened] = React.useState(null);
    const [failed, setFailed] = React.useState(false);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
    
        const originalUrl = formJson.originalUrl;
        const escapedUrl = encodeURIComponent(originalUrl);
    
        fetch(`/api/url/${escapedUrl}`, {
            method: form.method,
            body: new URLSearchParams(formData),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((res) => res.json())
        .then((res) => {
            const { shortened } = res
            if (shortened) {
                setShortened(shortened);
            }
        })
        .catch((err) => {
            console.error(err);
            setFailed(true);
        });
    }

    React.useEffect(() => {
      fetch("/api/urls")
        .then((res) => res.json())
        .then((urls) => setUrls(urls));
    }, []);
    
    const urlItems = urls ? urls.map((url, i) => (
        <li key={i}>{Object.keys(url).map(key => `${key}: ${url[key]} `)}</li>
    )) : [];


    return (
    <div>
        {failed ? "Failed to shorten URL" : shortened ? <Result shortened={shortened} /> : <Form onSubmit={handleSubmit} />}

        All URLs (for testing)
        <ul>{!urls ? "Loading..." : urlItems}</ul>
    </div>
  );
}

export default Create;
