import React from 'react';

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`
        flex items-center justify-start py-3 px-6 rounded-xl cursor-pointer
        ${active 
          ? 'bg-white'
          : 'text-black hover:bg-[var(--color-grey-light)]'
        }
      `}
    >
      {/* Ícono con fondo redondo y tamaño mayor */}
      <span
        className={`
          mr-2 rounded-full text-2xl p-2 flex items-center justify-center
          ${active 
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-white text-[var(--color-primary)]'
          }
        `}
      >
        {icon}
      </span>
      <span className="font-semibold">
        {label}
      </span>
    </li>
  );
};

export default SidebarItem;
