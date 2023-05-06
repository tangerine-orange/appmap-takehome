import React from "react";
import './App.css';

function App() {
    const [urls, setUrls] = React.useState(null);

    React.useEffect(() => {
      fetch("/api/urls")
        .then((res) => res.json())
        .then((urls) => setUrls(urls));
    }, []);
    
    const urlItems = urls ? urls.map((url, i) => <li key={i}>id: {url.id} Original: {url.original} Shortened: {url.shortened}</li>) : [];

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        const originalUrl = formData.get('originalUrl');
        const escapedUrl = encodeURIComponent(originalUrl);
    
        // You can pass formData as a fetch body directly:
        fetch(`/api/url/${escapedUrl}`, { method: form.method, body: formData });
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
      }


    return (
    <div className="App">
        <form method="post" onSubmit={handleSubmit}>
            <div>
                <label>
                    <input name="originalUrl" />
                </label>
            </div>
            <button>Shorten</button>
        </form>
        <ul>{!urls ? "Loading..." : urlItems}</ul>
    </div>
  );
}

export default App;
