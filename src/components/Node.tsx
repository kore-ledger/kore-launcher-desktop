import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

const ImportCryptoNode: React.FC = () => {
  // Estados para la funcionalidad de greet (opcional, para pruebas)
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  // Estados para manejar `kore_bridge`
  const [bridgeInitialized, setBridgeInitialized] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados locales para la contraseña y la ruta del archivo
  // Si ya existe una contraseña en el vault (guardada previamente), podrías cargarla,
  // pero dado que se requiere que se pida cada cierto número de inicios, se deja como input.
  const [password, setPassword] = useState("");
  const [filePath, setFilePath] = useState("");

  // Opcional: función de greet para pruebas
  async function greet() {
    try {
      const message = await invoke<string>("greet", { name });
      setGreetMsg(message);
    } catch (err) {
      console.error("Error en greet:", err);
    }
  }

  // Función para abrir el selector de archivos (archivo de configuración)
  async function selectFile() {
    try {
      const selectedFile = await open({
        multiple: false,
        directory: false,
        filters: [
          { name: "Configuración", extensions: ["json", "yml", "yaml", "toml"] },
        ],
      });
      if (selectedFile) {
        setFilePath(selectedFile as string);
      }
    } catch (err) {
      console.error("Error al seleccionar archivo:", err);
      setError("Error al seleccionar archivo");
    }
  }

  // Función para inicializar el Bridge (nodo) usando la contraseña ingresada y la ruta del archivo
  async function initBridge() {
    if (!password || !filePath) {
      setError("Debe ingresar una contraseña y seleccionar un archivo.");
      return;
    }

    try {
      // Aquí se invoca el comando Tauri `init_bridge` pasando la contraseña ingresada.
      const response = await invoke<string>("init_bridge", { password, filePath });
      console.log("init_bridge:", response);
      setBridgeInitialized(true);
      setError(null);
    } catch (err) {
      console.error("Error al inicializar el Bridge:", err);
      setError("Error al inicializar el Bridge");
    }
  }

  // Función para obtener el Peer ID del nodo ya inicializado
  async function fetchPeerId() {
    try {
      const id = await invoke<string>("get_peer_id");
      console.log("Peer ID:", id);
      setPeerId(id);
    } catch (err) {
      console.error("Error al obtener Peer ID:", err);
      setError("Error al obtener Peer ID");
    }
  }


  return (
    <main className="container p-4">
      {/* Sección de saludo para pruebas */}
      <form
        className="row mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
          className="px-2 py-1 border rounded mr-2"
        />
        <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded">
          Greet
        </button>
      </form>
      {greetMsg && <p className="mb-8 text-xl">{greetMsg}</p>}

      <hr className="my-4" />

      {/* Sección de Kore Bridge para inicializar el nodo */}
      <h2 className="text-2xl mb-4">Kore Bridge</h2>

      {/* Input para la contraseña */}
      <div className="mb-4">
        <label className="block mb-2">Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-2 py-1 border rounded w-full"
          placeholder="Ingrese su contraseña..."
        />
      </div>

      {/* Selector de archivos */}
      <div className="mb-4">
        <label className="block mb-2">Archivo de configuración:</label>
        <button
          onClick={selectFile}
          className="px-4 py-2 bg-gray-300 text-black rounded"
        >
          {filePath ? "📁 " + filePath : "Seleccionar Archivo"}
        </button>
      </div>

      {/* Botón para inicializar el Bridge */}
      <button
        onClick={initBridge}
        disabled={bridgeInitialized}
        className={`px-4 py-2 rounded ${
          bridgeInitialized ? "bg-gray-500" : "bg-green-500 text-white"
        }`}
      >
        {bridgeInitialized ? "Bridge Inicializado ✅" : "Iniciar Bridge"}
      </button>

      {/* Botón para obtener el Peer ID */}
      <button
        onClick={fetchPeerId}
        disabled={!bridgeInitialized}
        className={`px-4 py-2 ml-2 rounded ${
          bridgeInitialized ? "bg-blue-500 text-white" : "bg-gray-500"
        }`}
      >
        Obtener Peer ID
      </button>

      {/* Mostrar Peer ID si está disponible */}
      {peerId && (
        <p className="mt-4">
          🆔 Peer ID: <strong>{peerId}</strong>
        </p>
      )}

      {/* Mostrar errores si hay */}
      {error && <p className="mt-4 text-red-500">⚠️ {error}</p>}
    </main>
  );
};

export default ImportCryptoNode;
