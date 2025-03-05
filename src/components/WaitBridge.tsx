// src/components/WaitBridge.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters, AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { HiArrowLeft } from "react-icons/hi";
import { getAuth, peerID, putAuth } from "../utils/bridgeUtils";

const WaitBridge: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [authSubjects, setAuthSubjects] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const navigate = useNavigate();

  // Función para obtener el Peer ID
  async function fetchPeerId() {
    try {
      const id = await peerID();
      console.log("Peer ID:", id);
      setPeerId(id);
    } catch (err) {
      console.error("Error al obtener Peer ID:", err);
      setError("Error al obtener Peer ID");
    }
  }

  // Función para obtener los sujetos autorizados
  async function fetchAuth() {
    try {
      let auth = await getAuth();
      console.log("Auth subjects:", auth);
      if (auth.length === 0) {
        console.log("No hay sujetos autorizados. Ejecutando putAuth...");
        await putAuth();
        console.log("putAuth ejecutado correctamente");
        // Vuelve a obtener la autorización después de ejecutar putAuth
        auth = await getAuth();
        console.log("Auth subjects tras putAuth:", auth);
      }
      setAuthSubjects(auth);
    } catch (err) {
      console.error("Error al obtener autorización:", err);
      setError("Error al obtener autorización");
    }
  }

  // Al montar el componente se disparan ambas verificaciones
  useEffect(() => {
    fetchPeerId();
    fetchAuth();
  }, []);

  // Cuando ambas condiciones se cumplen, redirige a la siguiente pestaña
  useEffect(() => {
/*     if (peerId && authSubjects && authSubjects.length > 0) {
      // Si ambas condiciones están cumplidas, espera 2 segundos y navega
      setTimeout(() => navigate("/next"), 2000);
    } */
  }, [peerId, authSubjects, navigate]);

  // Función para copiar el Peer ID al portapapeles
  const handleCopy = async () => {
    if (peerId) {
      try {
        await navigator.clipboard.writeText(peerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copiando el Peer ID", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-marfil dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center">
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
        <div className="w-full">
          {/* Condición 1: Autorización */}
          <div className="flex items-center justify-between p-2 border border-gray-300 dark:border-gray-600 rounded mb-2">
            <span className="text-black dark:text-white">
              Autorización:{" "}
              {authSubjects && authSubjects.length > 0
                ? authSubjects[0]
                : "No autorizado"}
            </span>
            {authSubjects && authSubjects.length > 0 && (
              <AiOutlineCheck className="text-2xl text-green-500" />
            )}
          </div>
          {/* Condición 2: Peer ID */}
          <div className="flex items-center justify-between p-2 border border-gray-300 dark:border-gray-600 rounded">
            <span className="text-black dark:text-white flex-1 break-all">
              Peer ID: {peerId || "Obteniendo..."}
            </span>
            {peerId && (
              <AiOutlineCheck className="text-2xl text-green-500" />
            )}
            {peerId && (
              <button
                onClick={handleCopy}
                className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Copiar"
              >
                <AiOutlineCopy className="text-xl text-[var(--color-primary)]" />
              </button>
            )}
          </div>
        </div>
        {copied && (
          <p className="mt-2 text-green-500 text-sm">
            Copiado al portapapeles
          </p>
        )}
        {error && (
          <p className="mt-4 text-center text-red-500">
            ⚠️ {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default WaitBridge;
