import { useState } from "react";
import logo from '../assets/logo.svg';
import { HiEye, HiEyeOff, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { Trans, useTranslation } from "react-i18next";

const RegisterPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const { t } = useTranslation();

  // Condiciones de validación para la contraseña, incluyendo que ambas coincidan
  const passwordConditions = [
    { label: "Al menos un número", isValid: /[0-9]/.test(password) },
    { label: "Mínimo 5 caracteres", isValid: password.length >= 5 },
    { label: "Las contraseñas coinciden", isValid: password !== "" && confirmPassword !== "" && password === confirmPassword },
    { label: "Al menos una letra minúscula", isValid: /[a-z]/.test(password) },
    { label: "Al menos una letra mayúscula", isValid: /[A-Z]/.test(password) },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Verifica que todas las condiciones sean válidas
    const allValid = passwordConditions.every(condition => condition.isValid);
    if (!allValid) {
      alert('La contraseña no cumple con todas las condiciones');
      return;
    }
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    // Aquí la lógica con Stronghold
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-marfil dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Título */}
        <img src={logo} alt="Logo" className="w-100 h-50 mx-auto" />

        {/* Mensaje de alerta/Importante */}
        <p className="text-center text-black dark:text-white font-semibold mb-8">
          Esta contraseña se utilizará para cifrar su material criptográfico.{' '}
          <span className="text-[var(--color-red)]">¡IMPORTANTE!</span>{' '}
          Es muy importante que la anote en <strong>algún lugar seguro</strong>, ya que se le volverá a solicitar si utiliza otro dispositivo.
        </p>

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
      </div>
    </div>
  );
};

export default RegisterPasswordScreen;
