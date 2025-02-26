// Layout.tsx
import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { HiOutlineClipboardList, HiLogout, HiMenu } from 'react-icons/hi';
import logo from '../assets/hoja.svg';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [toggled, setToggled] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('tablaOrdenes');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar usando react-pro-sidebar */}
      <Sidebar
        toggled={toggled}
        breakPoint="md"
        onBackdropClick={() => setToggled(false)}
        backgroundColor="white"
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
              color: active ? 'white' : 'black',
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

        {/* Pie personalizado para el selector de idioma */}
        <div className="p-4 text-center" style={{ color: 'black' }}>
          <p>Estás navegando en:</p>
          <button
            className="underline"
            onClick={() => {
              // Lógica para cambiar idioma
            }}
          >
            ES / EN
          </button>
        </div>
      </Sidebar>

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow">
        {/* Botón hamburguesa para móvil */}
        <div className="md:hidden p-4">
          <button onClick={() => setToggled(!toggled)}>
            <HiMenu className="h-6 w-6 text-black" />
          </button>
        </div>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
