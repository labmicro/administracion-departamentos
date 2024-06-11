import React from 'react';

const header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold">Logo</div>

      {/* Icono de sesión de usuario */}
      <div className="flex items-center">
        {/* Reemplaza con tu icono de usuario */}
        <img
          src="/user-icon.png"
          alt="Icono de usuario"
          className="w-6 h-6 mr-2"
        />
        <span>Nombre de Usuario</span>
      </div>
    </header>
  );
};

export default header;