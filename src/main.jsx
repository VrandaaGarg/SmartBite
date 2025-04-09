import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import "./index.css"; // Assuming you have a CSS file for global styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          {/* Add more routes here as you build them */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
