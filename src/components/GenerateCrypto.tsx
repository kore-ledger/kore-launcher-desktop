import { useState } from "react";
import logo from '../assets/logo.svg';
import { HiEye, HiEyeOff, HiCheckCircle, HiXCircle, HiArrowLeft } from 'react-icons/hi';
import { Trans, useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from '@tauri-apps/api/path';
import { initBridge, saveConfigFiles, selectConfigFile, translateError } from "../utils/bridgeUtils";

const GenerateCrypto: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [configfilePath, configsetFilePath] = useState("");
  const [configNodefilePath, configNodesetFilePath] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();


  // Condiciones de validación para la contraseña, incluyendo que ambas coincidan
  const passwordConditions = [
    { label: t("passwordConditions.number"), isValid: /[0-9]/.test(password) },
    { label: t("passwordConditions.minLength"), isValid: password.length >= 5 },
    { label: t("passwordConditions.match"), isValid: password !== "" && confirmPassword !== "" && password === confirmPassword },
    { label: t("passwordConditions.lowercase"), isValid: /[a-z]/.test(password) },
    { label: t("passwordConditions.uppercase"), isValid: /[A-Z]/.test(password) },
  ];


  async function handleConfigSelectFile() {
    try {
      const path = await selectConfigFile(t);
      configsetFilePath(path);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConfigNodeSelectFile() {
    try {
      const path = await selectConfigFile(t);
      configNodesetFilePath(path);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const allValid = passwordConditions.every(condition => condition.isValid);
    if (!allValid || !configfilePath || !configNodefilePath) {
      alert('La contraseña no cumple con todas las condiciones');
      return;
    }
    try {
      alert("Contraseña válida")
      // mover a support los dos archivos que se han leido
      saveConfigFiles(configfilePath, configNodefilePath);
      initBridge(password, configNodefilePath);
    } catch (error) {
      alert("asdasdasd")
      const errorMsg = error instanceof Error ? error.message : String(error);
      setError(translateError(t, errorMsg));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-marfil dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Botón para volver */}
        <button
          onClick={() => navigate("/import")}
          className="flex items-center text-[var(--color-primary)] mb-4"
        >
          <HiArrowLeft className="mr-1" />
          Importar material criptográfico
        </button>

        {/* Título */}
        <img src={logo} alt="Logo" className="w-100 h-50 mx-auto" />

        {/* Mensaje de alerta/Importante */}
        <p className="text-center text-black dark:text-white font-semibold mb-8">
          <Trans i18nKey="passwordInfo">
            Esta contraseña se utilizará para cifrar su material criptográfico.
            <strong className="text-red">¡IMPORTANTE!</strong>
            Es muy importante que la anote en <strong>algún lugar seguro</strong>, ya que se le volverá a solicitar si utiliza otro dispositivo.
          </Trans>
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Selector de archivos */}
          <div className="mb-4">
            <label className="block mb-2">Archivo de configuración:</label>
            <button
             type="button"
              onClick={handleConfigSelectFile}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              {configfilePath ? "📁 " + configfilePath : "Seleccionar Archivo"}
            </button>
          </div>
          {/* Selector de archivos */}
          <div className="mb-4">
            <label className="block mb-2">Archivo del nodo:</label>
            <button
             type="button"
              onClick={handleConfigNodeSelectFile}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              {configNodefilePath ? "📁 " + configNodefilePath : "Seleccionar Archivo"}
            </button>
          </div>
          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-black dark:text-white font-medium mb-1">
              {t('password')}
            </label>
            <div className="relative">
              <input
                id="password"
                autoCapitalize="none"
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border dark:text-white bg-white dark:bg-gray-800 dark:border-gray-600 border-[var(--color-grey-dark)] rounded focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5 text-[var(--color-black)] dark:text-white" />
                ) : (
                  <HiEye className="h-5 w-5 text-[var(--color-black)] dark:text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Campo Repetir Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-black dark:text-white font-medium mb-1">
              {t('repeatPassword')}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                autoCapitalize="none"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-2 border dark:text-white bg-white dark:bg-gray-800 dark:border-gray-600 border-[var(--color-grey-dark)] rounded focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <HiEyeOff className="h-5 w-5 text-[var(--color-black)] dark:text-white" />
                ) : (
                  <HiEye className="h-5 w-5 text-[var(--color-black)] dark:text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Lista de condiciones: se muestra solo si se ha empezado a escribir */}
          {password && (
            <div className="mt-2 text-center">
              <ul className="text-sm space-y-1">
                {passwordConditions.map((cond, index) => (
                  <li key={index} className="flex justify-center items-center">
                    {cond.isValid ? (
                      <HiCheckCircle className="text-green mr-2" />
                    ) : (
                      <HiXCircle className="text-red mr-2" />
                    )}
                    <span className={cond.isValid ? "text-green" : "text-red"}>
                      {cond.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón para registrar */}
          <button
            type="submit"
            className="mt-4 w-full py-2 bg-[var(--color-primary)] text-[var(--color-white)] font-semibold rounded hover:bg-[var(--color-brown)] transition-colors"
          >
            {t('generateMaterial')}
          </button>
        </form>
        {/* Mostrar errores si hay */}
        {error && <p className="mt-4 text-red">⚠️ {error}</p>}
      </div>
    </div>
  );
};

export default GenerateCrypto;
