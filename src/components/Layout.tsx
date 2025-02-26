import React, { useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('tablaOrdenes');

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar para escritorio */}
      <div className="hidden md:block">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>

      {/* Sidebar para móvil (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lighter">
          <Sidebar
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            isMobile={true}
            closeSidebar={() => setSidebarOpen(false)}
          />
          {/* Área de clic para cerrar el overlay */}
          <div className="flex-grow" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow">
        {/* Botón hamburguesa para móvil */}
        <div className="md:hidden p-4">
          <button onClick={() => setSidebarOpen(true)}>
            <HiMenu className="h-6 w-6 text-black" />
          </button>
        </div>
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
