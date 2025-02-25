import { useState } from "react";
import logo from './assets/logo.svg';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import "./App.css";

const RegisterPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    // Aquí la lógica con Stronghold
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        {/* Título */}
        <img src={logo} alt="Logo" className="w-30 h-30 mx-auto mb-8" />

        {/* Mensaje de alerta/Importante */}
        <p className="text-center text-red font-semibold mb-8">
          IMPORTANTE NO OLVIDAR LA CONTRASEÑA
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-black font-medium mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border border-grey rounded focus:outline-none focus:border-primary"
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
                  <HiEyeOff className="h-5 w-5 text-black" />
                ) : (
                  <HiEye className="h-5 w-5 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Campo Repetir Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-black font-medium mb-1">
              Repetir Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-2 border border-grey rounded focus:outline-none focus:border-primary"
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
                  <HiEyeOff className="h-5 w-5 text-black" />
                ) : (
                  <HiEye className="h-5 w-5 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Botón para registrar */}
          <button
            type="submit"
            className="mt-4 w-full py-2 bg-primary text-white font-semibold rounded hover:bg-green-700 transition-colors"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPasswordScreen;
