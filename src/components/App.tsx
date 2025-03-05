// src/components/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CheckVault from "./Check";
import GenerateCrypto from "./GenerateCrypto";
import ImportCrypto from "./ImportCrypto";
import WaitBridge from "./WaitBridge";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CheckVault />} />
      <Route path="/generate" element={<GenerateCrypto />} />
      <Route path="/import" element={<ImportCrypto />} />
      <Route path="/wait" element={<WaitBridge />} />
    </Routes>
  );
};

export default App;
