// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
        password: "Password",
        repeatPassword: "Repeat password",
        enterPassword:"Enter your password",
      passwordInfo:
        "This password will be used to encrypt your cryptographic material. It is very important that you save it somewhere safe, as you will be asked for it again if you use another device.",
      generateMaterial: "Generate cryptographic material",
      passwordConditions: {
        number: "At least one number",
        minLength: "Minimum 5 characters",
        match: "Passwords match",
        lowercase: "At least one lowercase letter",
        uppercase: "At least one uppercase letter",
      },
      sidebar: {
        orders: "Orders Table",
        logout: "Log out",
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
      enterPassword:"Ingresa tu contraseña",
      passwordInfo:
        "Esta contraseña se utilizará para cifrar su material criptográfico. Es muy importante que la anote en algún lugar seguro, ya que se le volverá a solicitar si utiliza otro dispositivo.",
      generateMaterial: "Generar material criptográfico",
      passwordConditions: {
        number: "Al menos un número",
        minLength: "Mínimo 5 caracteres",
        match: "Las contraseñas coinciden",
        lowercase: "Al menos una letra minúscula",
        uppercase: "Al menos una letra mayúscula",
      },
      sidebar: {
        orders: "Tabla de órdenes",
        logout: "Cerrar sesión",
        navigating: "Estás navegando en:",
        language: "ES / EN",
        lightMode: "Modo Claro",
        darkMode: "Modo Oscuro",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es', // idioma por defecto
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
