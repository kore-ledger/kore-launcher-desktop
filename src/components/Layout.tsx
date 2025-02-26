// Layout.tsx
import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import {
  HiOutlineClipboardList,
  HiLogout,
  HiMenu,
  HiSun,
  HiMoon,
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

  const { i18n } = useTranslation();

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
    <div className="flex min-h-screen dark:bg-gray-900">
      {/* Sidebar usando react-pro-sidebar */}
      <Sidebar
        toggled={toggled}
        breakPoint="md"
        onBackdropClick={() => setToggled(false)}
        backgroundColor={darkMode ? 'var(--color-black)' : 'white'}
      >
        {/* Encabezado personalizado */}
        <div className="flex items-center justify-center p-4">
          <img src={logo} alt="Acciona" className="h-20 w-20" />
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
        <div className="p-4 text-center text-black dark:text-white">
          <p>Estás navegando en:</p>
          <select
            value={i18n.language}
            onChange={(e) => {
              console.log(e.target.value);
              i18n.changeLanguage(e.target.value);
            }}
            className="underline bg-transparent border-none outline-none appearance-none mx-auto"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
          <button
            className="underline block mt-2"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <>
                <HiSun className="inline-block mr-1" />
                Modo Claro
              </>
            ) : (
              <>
                <HiMoon className="inline-block mr-1" />
                Modo Oscuro
              </>
            )}
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
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
