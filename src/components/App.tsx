// src/components/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CheckVault from "./Check";
import GenerateCrypto from "./GenerateCrypto";
import ImportCrypto from "./ImportCrypto";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CheckVault />} />
      <Route path="/generate" element={<GenerateCrypto />} />
      <Route path="/import" element={<ImportCrypto />} />
    </Routes>
  );
};

export default App;
