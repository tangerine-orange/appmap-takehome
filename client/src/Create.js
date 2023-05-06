import React from "react";

function Create() {
    const [urls, setUrls] = React.useState(null);

    React.useEffect(() => {
      fetch("/api/urls")
        .then((res) => res.json())
        .then((urls) => setUrls(urls));
    }, []);
    
    const urlItems = urls ? urls.map((url, i) => (
        <li key={i}>{Object.keys(url).map(key => `${key}: ${url[key]} `)}</li>
    )) : [];

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
        });
      }


    return (
    <div className="App">
        <form method="post" onSubmit={handleSubmit}>
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
        <ul>{!urls ? "Loading..." : urlItems}</ul>
    </div>
  );
}

export default Create;
