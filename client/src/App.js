import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Create from "./Create";
import Fetch from "./Fetch";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path=":shortened" element={<Fetch />} />
        </Routes>
      </div>
    </Router>
  );
}