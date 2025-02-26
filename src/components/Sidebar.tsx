import React from 'react';
import SidebarItem from './SidebarItem';
import { HiOutlineClipboardList, HiLogout } from 'react-icons/hi';
import logo from '../assets/hoja.svg';

interface SidebarProps {
  activeItem: string;
  setActiveItem: (id: string) => void;
  isMobile?: boolean;
  closeSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  setActiveItem,
  isMobile = false,
  closeSidebar
}) => {
  return (
    <aside
      className={`
        flex flex-col w-64 p-4 bg-[var(--color-white)]
      `}
    >
      {/* Botón de cierre solo en móvil */}
      {isMobile && (
        <button onClick={closeSidebar} className="mb-4 self-end">
          {/* Puedes reemplazar este "X" por un ícono si lo deseas */}
          <span className="text-white text-xl">X</span>
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <img src={logo} alt="logo" className="h-auto w-auto" />
      </div>

      {/* Menú principal */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <SidebarItem
            icon={<HiOutlineClipboardList />}
            label="Tabla de órdenes"
            active={activeItem === 'tablaOrdenes'}
            onClick={() => {
              setActiveItem('tablaOrdenes');
              if (closeSidebar) closeSidebar();
            }}
          />
        </ul>
      </nav>

      {/* Sección inferior */}
      <div className="mt-auto">
        <ul className="space-y-2">
          <SidebarItem
            icon={<HiLogout />}
            label="Cerrar sesión"
            active={activeItem === 'logout'}
            onClick={() => {
              setActiveItem('logout');
              if (closeSidebar) closeSidebar();
              // Lógica de logout aquí
            }}
          />
        </ul>

        {/* Selector de idioma */}
        <div className="mt-4 text-white">
          <p>Estás navegando en:</p>
          <button className="underline">
            ES / EN
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
