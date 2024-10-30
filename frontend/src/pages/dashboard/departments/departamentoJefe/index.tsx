import React from 'react';
import { useRouter } from 'next/router'; 
import ListaDepartamentosJefe from './list';
import CrearDepartamentoJefe from './create';

const DepartamentosJefe = () => {
  const router = useRouter();
  const { path } = router.query;

  const renderContent = () => {
    if (path === 'crear') {
      return <CrearDepartamentoJefe />;
    } else {
      return <ListaDepartamentosJefe />;
    }
  };

  return <>{renderContent()}</>;
};

export default DepartamentosJefe;
