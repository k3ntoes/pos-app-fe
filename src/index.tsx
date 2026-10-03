import React from "react";
import ReactDOM from "react-dom/client";
import { Providers } from "./app/providers";
import "./theme/globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
);
