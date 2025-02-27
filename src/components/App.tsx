import React, { useState, useEffect } from "react";
import { appDataDir } from '@tauri-apps/api/path';
import GenerateCrypto from "./GenerateCrypto";
import ImportCrypto from "./ImportCrypto";


// Componente de elección para el usuario si el vault no tiene aún la key "password"
const GenerateOrImportChoice: React.FC<{ onSelect: (option: "generate" | "import") => void }> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h2 className="mb-4 text-xl font-semibold">Seleccione una opción</h2>
      <button
        onClick={() => onSelect("generate")}
        className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Generar nuevo material criptográfico
      </button>
      <button
        onClick={() => onSelect("import")}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Importar material criptográfico
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [vaultHasPassword, setVaultHasPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"generate" | "import" | null>(null);
  const [store, setStore] = useState<any>(null);

  // Si ya existe la key "password", mostramos directamente el componente de importación

    // Si no existe, mostramos la pantalla de elección
    if (!selectedOption) {
      return <GenerateOrImportChoice onSelect={setSelectedOption} />;
    } else if (selectedOption === "generate") {
      return <GenerateCrypto goBack={() => setSelectedOption(null)}/>;
    } else {
      return <ImportCrypto goBack={() => setSelectedOption(null)}/>;
    }
};

export default App;
