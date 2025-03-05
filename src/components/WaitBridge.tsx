// src/components/WaitBridge.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AiOutlineLoading3Quarters, 
  AiOutlineCopy, 
  AiOutlineCheck 
} from "react-icons/ai";
import { HiArrowLeft } from "react-icons/hi";
import { 
  putAuth, 
  getAllGovernanceIds, 
  getConfigGovernanceIds, 
  updateGovernance, 
  controllerID
} from "../utils/bridgeUtils";

const WaitBridge: React.FC = () => {
  const [controllerId, setControllerId] = useState<string | null>(null);
  const [configGovernance, setConfigGovernance] = useState<string[]>([]);
  const [nodeGovernance, setNodeGovernance] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const navigate = useNavigate();

  // Obtiene el Peer ID
  async function fetchcontrollerId() {
    try {
      const id = await controllerID();
      console.log("controllerId:", id);
      setControllerId(id);
    } catch (err) {
      console.error("Error al obtener controllerId:", err);
      setError("Error al obtener controllerId:");
    }
  }

  // Obtiene los governance IDs configurados
  async function fetchConfigGovernance() {
    try {
      const configGovs = await getConfigGovernanceIds();
      console.log("Config Governance IDs:", configGovs);
      setConfigGovernance(configGovs);
    } catch (err) {
      console.error("Error al obtener governance del config:", err);
      setError("Error al obtener governance del config");
    }
  }

  // Obtiene los governance IDs del nodo
  async function fetchNodeGovernance() {
    try {
      const nodeGovs = await getAllGovernanceIds();
      console.log("Node Governance IDs:", nodeGovs);
      setNodeGovernance(nodeGovs);
    } catch (err) {
      console.error("Error al obtener governance del nodo:", err);
      setError("Error al obtener governance del nodo");
    }
  }

  // Maneja la actualización de una gobernanza faltante
  async function handleUpdate(governance: string) {
    try {
      console.log("Actualizando governance:", governance);
      // Primero, ejecuta putAuth para actualizar la autorización
      await putAuth(governance);
      // Luego, llama a updateGovernance para actualizar la gobernanza en el nodo
      await updateGovernance(governance);
      // Refresca la lista de governances en el nodo
      await fetchNodeGovernance();
    } catch (err) {
      console.error("Error actualizando governance:", err);
      setError("Error actualizando governance");
    }
  }

  // Función para copiar el Peer ID al portapapeles
  const handleCopy = async () => {
    if (controllerId) {
      try {
        await navigator.clipboard.writeText(controllerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copiando el Peer ID", err);
      }
    }
  };

  // Al montar el componente, se obtienen Peer ID, governances configurados y del nodo
  useEffect(() => {
    fetchcontrollerId();
    fetchConfigGovernance();
    fetchNodeGovernance();
  }, []);

  // Calcula cuáles governances están presentes y cuáles faltan
  const missingGovernance = configGovernance.filter(id => !nodeGovernance.includes(id));
  const presentGovernance = configGovernance.filter(id => nodeGovernance.includes(id));

  // Si todos los governance configurados están en el nodo, navega automáticamente a la siguiente pantalla
  useEffect(() => {
    if (configGovernance.length > 0 && nodeGovernance.length > 0 && missingGovernance.length === 0) {
      console.log("Todos los governance están presentes. Navegando...");
      setTimeout(() => navigate("/next"), 2000);
    }
  }, [configGovernance, nodeGovernance, missingGovernance, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-marfil dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-[var(--color-primary)] mb-4"
        >
          <HiArrowLeft className="mr-1" />
          Volver
        </button>

        <div className="flex items-center space-x-4 mb-4">
          <AiOutlineLoading3Quarters className="text-4xl animate-spin text-[var(--color-primary)]" />
          <span className="text-xl font-semibold text-black dark:text-white">
            Verificando condiciones...
          </span>
        </div>

        <div className="mb-4">
          <p className="text-black dark:text-white break-words whitespace-normal">
            Identificador: {controllerId || "Obteniendo..."}
          </p>
          {controllerId && (
            <div className="flex items-center">
              <AiOutlineCheck className="text-2xl text-green-500" />
              <button 
                onClick={handleCopy} 
                className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" 
                title="Copiar"
              >
                <AiOutlineCopy className="text-xl text-[var(--color-primary)]" />
              </button>
            </div>
          )}
          {copied && <p className="mt-2 text-green-500 text-sm">Copiado al portapapeles</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Governances presentes en el nodo */}
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Governances en el nodo
            </h3>
            {presentGovernance.length > 0 ? (
              presentGovernance.map((id, index) => (
                <p key={index} className="text-black dark:text-white break-words whitespace-normal">
                  {id}
                </p>
              ))
            ) : (
              <p className="text-black dark:text-white">Ninguna</p>
            )}
          </div>
          {/* Card: Governances faltantes */}
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Governances faltantes
            </h3>
            {missingGovernance.length > 0 ? (
              missingGovernance.map((id, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <p className="text-black dark:text-white break-words whitespace-normal">{id}</p>
                  <button 
                    onClick={() => handleUpdate(id)} 
                    className="px-2 py-1 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-brown)]"
                  >
                    Actualizar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-black dark:text-white">Ninguna</p>
            )}
          </div>
        </div>

        {/* Botón global para continuar si hay al menos una gobernanza presente */}
        {nodeGovernance.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => navigate("/next")} 
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-brown)]"
            >
              Continuar
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-red-500">⚠️ {error}</p>
        )}
      </div>
    </div>
  );
};

export default WaitBridge;
