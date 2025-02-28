// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import Layout from "./components/Layout";
import "./i18n/i18n";
import "./styles/Main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
  </React.StrictMode>
);
