// Layout.tsx
import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import {
  HiOutlineClipboardList,
  HiLogout,
  HiMenu,
  HiSun,
  HiMoon,
  HiOutlineGlobe,
} from 'react-icons/hi';
import logo from '../assets/hoja.svg';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [toggled, setToggled] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('tablaOrdenes');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const { i18n, t } = useTranslation();

  // Al montar, verifica la preferencia del usuario
  useEffect(() => {
    const userTheme = localStorage.getItem("theme");
    if (
      userTheme === "dark" ||
      (!userTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
    }
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-800">
      {/* Sidebar usando react-pro-sidebar */}
      <Sidebar
        toggled={toggled}
        breakPoint="md"
        onBackdropClick={() => setToggled(false)}
        backgroundColor={darkMode ? 'var(--color-gray-800)' : 'white'}
      >
        {/* Encabezado personalizado */}
        <div className="flex items-center justify-center p-4">
          <img src={logo} alt="Acciona" className="h-15 w-15" />
        </div>

        {/* Menú principal con estilos personalizados */}
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              backgroundColor: active ? 'var(--color-primary)' : undefined,
              color: active ? 'white' : (darkMode ? 'white' : 'black'),
              ...(active && {
                '&:hover': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                },
              }),
            }),
            icon: ({ active }) => ({
              backgroundColor: active ? 'white' : 'var(--color-brown)',
              color: active ? 'var(--color-brown)' : 'white',
              borderRadius: '50%',
              padding: '0.25rem',
            }),
          }}
        >
          <MenuItem
            active={activeItem === 'tablaOrdenes'}
            icon={<HiOutlineClipboardList className="text-2xl" />}
            onClick={() => {
              setActiveItem('tablaOrdenes');
              if (toggled) setToggled(false);
            }}
          >
            Tabla de órdenes
          </MenuItem>
          <MenuItem
            active={activeItem === 'logout'}
            icon={<HiLogout className="text-2xl" />}
            onClick={() => {
              setActiveItem('logout');
              if (toggled) setToggled(false);
              console.log('Cerrando sesión...');
            }}
          >
            Cerrar sesión
          </MenuItem>
        </Menu>

        {/* Pie del Sidebar: Selector de idioma y cambio de tema */}
        <div className="absolute bottom-4 left-0 w-full flex flex-col items-center">
          {/* Selector de idioma con fondo verde e icono */}
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-[var(--color-brown)] transition-colors"
            onClick={() => {
              const newLang = i18n.language === "es" ? "en" : "es";
              i18n.changeLanguage(newLang);
            }}
          >
            <HiOutlineGlobe className="text-lg" />
            {i18n.language.toUpperCase()}
          </button>

          {/* Botón para cambiar el modo oscuro */}
          <button
            className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md shadow-md"
            onClick={toggleDarkMode}
          >
            {darkMode ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
            {darkMode ? t("sidebar.lightMode") : t("sidebar.darkMode")}
          </button>
        </div>
      </Sidebar>

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow dark:bg-gray-800">
        {/* Botón hamburguesa para móvil */}
        <div className="md:hidden p-4">
          <button onClick={() => setToggled(!toggled)}>
            <HiMenu className="h-6 w-6 text-black dark:text-white" />
          </button>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
