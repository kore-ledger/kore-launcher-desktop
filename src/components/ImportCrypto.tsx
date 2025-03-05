import { useState } from "react";
import logo from '../assets/logo.svg';
import { HiEye, HiEyeOff, HiArrowLeft } from 'react-icons/hi';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { initBridge, translateError } from "../utils/bridgeUtils";
 
const ImportCrypto: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
 
 
 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!password) {
            setError("Debe ingresar una contraseña y seleccionar un archivo.");
            return;
        }
        console.log("Iniciando bridge...");
        try {
            alert("Contraseña válida")
            await initBridge(password);
        } catch (error) {
            alert("")
            const errorMsg = error instanceof Error ? error.message : String(error);
            setError(translateError(t, errorMsg));
        }
    };
 
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white-marfil dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                {/* Botón para volver */}
                <button
                    onClick={() => navigate("/generate")}
                    className="flex items-center text-[var(--color-primary)] mb-4"
                >
                    <HiArrowLeft className="mr-1" />
                    Generar material criptográfico
                </button>
                {/* Título */}
                <img src={logo} alt="Logo" className="w-100 h-50 mx-auto" />
 
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
