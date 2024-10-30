import React from 'react';
import { useRouter } from 'next/router';
import CrearDepartamento from './create';
import ListaDepartamentos from './list';
import DepartamentosJefe from './departamentoJefe';

const Departamentos = () => {
  const router = useRouter();
  const { path } = router.query;

  const renderComponent = () => {
    switch (path) {
      case 'crear':
        return <CrearDepartamento />;
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
