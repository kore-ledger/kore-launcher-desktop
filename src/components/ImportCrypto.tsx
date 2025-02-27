import { useState } from "react";
import logo from '../assets/logo.svg';
import { HiEye, HiEyeOff, HiArrowLeft } from 'react-icons/hi';
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from '@tauri-apps/api/path';

interface GenerateCryptoProps {
    goBack: () => void;
}

const ImportCrypto: React.FC<GenerateCryptoProps> = ({ goBack }) => {
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [filePath, setFilePath] = useState("");
    const [bridgeInitialized, setBridgeInitialized] = useState(false);

    const [peerId, setPeerId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

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

    const translateError = (errorMsg: string): string => {
        if (errorMsg.includes("PKCS#5 encryption failed")) {
            return t("error.incorrectPassword");
        }
        return errorMsg;
    };

    async function initBridge() {
        try {
            const securePath = await appDataDir();
            const response = await invoke<string>("init_bridge", { password, filePath, securePath });
            console.log("init_bridge:", response);
            setBridgeInitialized(true);
            setError(null);
        } catch (err) {
            console.error("Bridge initialization failed:", err);
            const errorMsg = err instanceof Error ? err.message : String(err);
            setError(translateError(errorMsg));
        }
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!password || !filePath) {
            setError("Debe ingresar una contraseña y seleccionar un archivo.");
            return;
        }

        initBridge();
        if (error == null) {
            // nada
        } else {
            // navigate to
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white-marfil dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                {/* Botón para volver */}
                <button
                    onClick={goBack}
                    className="flex items-center text-[var(--color-primary)] mb-4"
                >
                    <HiArrowLeft className="mr-1" />
                    Volver
                </button>
                {/* Título */}
                <img src={logo} alt="Logo" className="w-100 h-50 mx-auto" />

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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

                    {/* Botón para registrar */}
                    <button
                        type="submit"
                        className="mt-4 w-full py-2 bg-[var(--color-primary)] text-[var(--color-white)] font-semibold rounded hover:bg-[var(--color-brown)] transition-colors"
                    >
                        {t('decryptMaterial')}
                    </button>
                    {/* Mostrar errores si hay */}
                    {error && <p className="mt-4 text-red">⚠️ {error}</p>}
                </form>
            </div>
        </div>
    );
};

export default ImportCrypto;
