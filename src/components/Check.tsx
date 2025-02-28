// src/components/CheckVault.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appDataDir } from "@tauri-apps/api/path";
import { exists } from '@tauri-apps/plugin-fs';

const CheckVault: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function check() {
      try {
        const dir = await appDataDir();
        const vaultPath = `${dir}/keys`;
        const fileExists = await exists(vaultPath);
        if (fileExists) {
          navigate("/import", { replace: true });
        } else {
          navigate("/generate", { replace: true });
        }
      } catch (err) {
        console.error("Error al verificar el vault:", err);
        navigate("/generate", { replace: true });
      }
    }
    check();
  }, [navigate]);

  return <div>Cargando...</div>;
};

export default CheckVault;
