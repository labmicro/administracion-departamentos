import React from 'react';
import { useRouter } from 'next/router';
import CrearResolucion from './create';
import ListaResoluciones from './list';

const Resoluciones = () => {
  const router = useRouter();
  const { path } = router.query;

  const renderContent = () => {
    if (path === 'crear') {
      return <CrearResolucion />;
    } else {
      return <ListaResoluciones />;
    }
  };

  return <>{renderContent()}</>;
};

export default Resoluciones;
