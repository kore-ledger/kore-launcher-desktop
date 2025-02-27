// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      password: "Password",
      repeatPassword: "Repeat password",
      enterPassword: "Enter your password",
      passwordInfo: "This password will be used to encrypt your cryptographic material. <1>IMPORTANT!</1> It is very important that you write it down in <3>a safe place</3>, as you will be asked for it again if you use another device.",
      generateMaterial: "Generate cryptographic material",
      decryptMaterial: "Decrypt cryptographic material",
      error: {
        incorrectPassword: "Incorrect password",
        missingFields: "You must enter a password and select a file.",
        fileSelection: "Error when selecting file"
      },
      passwordConditions: {
        number: "At least one number",
        minLength: "Minimum 5 characters",
        match: "Passwords match",
        lowercase: "At least one lowercase letter",
        uppercase: "At least one uppercase letter",
      },
      sidebar: {
        navigating: "You are browsing in:",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
      },
    },
  },
  es: {
    translation: {
      password: "Contraseña",
      repeatPassword: "Repetir contraseña",
      enterPassword: "Ingresa tu contraseña",
      passwordInfo: "Esta contraseña se utilizará para cifrar su material criptográfico. <1>¡IMPORTANTE!</1> Es muy importante que la anote en <3>algún lugar seguro</3>, ya que se le volverá a solicitar si utiliza otro dispositivo.",
      generateMaterial: "Generar material criptográfico",
      decryptMaterial: "Desencriptar material criptográfico",
      error: {
        incorrectPassword: "La contraseña es incorrecta.",
        missingFields: "Debe ingresar una contraseña y seleccionar un archivo.",
        fileSelection: "Error al seleccionar archivo"
      },
      passwordConditions: {
        number: "Al menos un número",
        minLength: "Mínimo 5 caracteres",
        match: "Las contraseñas coinciden",
        lowercase: "Al menos una letra minúscula",
        uppercase: "Al menos una letra mayúscula",
      },
      sidebar: {
        navigating: "Estás navegando en:",
        lightMode: "Modo Claro",
        darkMode: "Modo Oscuro",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: true,
  },
});

export default i18n;
