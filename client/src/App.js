import React from "react";
import './App.css';

function App() {
    const [urls, setUrls] = React.useState(null);

    React.useEffect(() => {
      fetch("/api/urls")
        .then((res) => res.json())
        .then((urls) => setUrls(urls));
    }, []);
    
    const urlItems = urls ? urls.map((url) => <li>{url.original}</li>) : [];

    return (
    <div className="App">
        <ul>{!urls ? "Loading..." : urlItems}</ul>
    </div>
  );
}

export default App;
