import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";
import Layout from './components/Layout';
import './i18n/i18n'; 
import "./styles/Main.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>,
);
