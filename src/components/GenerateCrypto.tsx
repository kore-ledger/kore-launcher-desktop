import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.svg";
import { HiEye, HiEyeOff, HiCheckCircle, HiXCircle, HiArrowLeft } from "react-icons/hi";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { removeAllFiles, saveConfigFiles, selectConfigFile, initBridge, translateError } from "../utils/bridgeUtils";
 
const GenerateCrypto: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [configfilePath, configsetFilePath] = useState("");
  const [configNodefilePath, configNodesetFilePath] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
 
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
    const allValid = passwordConditions.every((cond) => cond.isValid);
    if (!allValid || !configfilePath || !configNodefilePath) {
      alert("La contraseña no cumple con todas las condiciones");
      return;
    }
    try {
      alert("Contraseña válida");
      await removeAllFiles();
      console.log("Files removed");
      await saveConfigFiles(configfilePath, configNodefilePath);
      console.log("Files saveeed");
      await initBridge(password);
      console.log("Bridge initialized");
    } catch (error) {
      alert("Ocurrió un error");
      const errorMsg = error instanceof Error ? error.message : String(error);
      setError(translateError(t, errorMsg));
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-marfil dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <button onClick={() => navigate("/import")} className="flex items-center text-[var(--color-primary)] mb-4">
          <HiArrowLeft className="mr-1" />
          Importar material criptográfico
        </button>
 
        <img src={logo} alt="Logo" className="w-100 h-50 mx-auto" />
 
        <p className="text-center text-black dark:text-white font-semibold mb-4">
          <Trans i18nKey="passwordInfo">
            Esta contraseña se utilizará para cifrar su material criptográfico.
            <strong className="text-red">¡IMPORTANTE!</strong>
            Es muy importante que la anote en <strong>algún lugar seguro</strong>, ya que se le volverá a solicitar si utiliza otro dispositivo.
          </Trans>
        </p>
        <p className="text-center text-black dark:text-white font-semibold mb-8">
          En caso de que ya haya desplegado un nodo se borrará la información anterior.
        </p>
 
        <form onSubmit={handleSubmit}>
          {/* Contenedor animado con layout para ajustar el alto */}
          <motion.div layout className="relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  layout
                >
                  <div className="space-y-4">
                    <div className="mb-4 dark:text-white">
                      <label className="block mb-2">Archivo de configuración:</label>
                      <button
                        type="button"
                        onClick={handleConfigSelectFile}
                        className="px-4 py-2 bg-gray-300 text-black rounded w-full text-left"
                      >
                        {configfilePath ? "📁 " + configfilePath : "Seleccionar Archivo"}
                      </button>
                    </div>
                    <div className="mb-4 dark:text-white">
                      <label className="block mb-2">Archivo del nodo:</label>
                      <button
                        type="button"
                        onClick={handleConfigNodeSelectFile}
                        className="px-4 py-2 bg-gray-300 text-black rounded w-full text-left"
                      >
                        {configNodefilePath ? "📁 " + configNodefilePath : "Seleccionar Archivo"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (configfilePath && configNodefilePath) {
                          setStep(2);
                        } else {
                          alert("Debe seleccionar ambos archivos");
                        }
                      }}
                      className="mt-4 w-full py-2 bg-[var(--color-primary)] text-[var(--color-white)] font-semibold rounded hover:bg-[var(--color-brown)] transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                  layout
                >
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-black dark:text-white font-medium mb-1">
                        {t("password")}
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
 
                    <div>
                      <label htmlFor="confirmPassword" className="block text-black dark:text-white font-medium mb-1">
                        {t("repeatPassword")}
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
 
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                      >
                        Volver
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-4 bg-[var(--color-primary)] text-[var(--color-white)] font-semibold rounded hover:bg-[var(--color-brown)] transition-colors"
                      >
                        {t("generateMaterial")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </form>
        {error && <p className="mt-4 text-red">⚠️ {error}</p>}
      </div>
    </div>
  );
};
 
export default GenerateCrypto;
 