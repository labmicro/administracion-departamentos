// src/pages/dashboard/departments/index.tsx
import React from 'react';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import CrearDepartamento from './create';
import ListaDepartamentos from './list';
import EditarDepartamento from './edit';
import DepartamentosJefe from './departamentoJefe';

const Departamentos = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  // Obtener la ruta actual
  const { path } = router.query;

  const renderComponent = () => {
    switch (path) {
      case 'crear':
        return <CrearDepartamento />;
      case 'editar':
        return <EditarDepartamento />;
      case 'jefes':
        return <DepartamentosJefe />;
      default:
        return <ListaDepartamentos />;
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default Departamentos;
