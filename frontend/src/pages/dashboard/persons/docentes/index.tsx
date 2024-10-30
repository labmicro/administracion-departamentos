import React from 'react';
import { useRouter } from 'next/router';
import CrearDocente from './create';
import ListaDocentes from './list';

const Docentes = () => {
  const router = useRouter();

  const renderContent = () => {
    if (router.pathname.endsWith('/crear')) {
      return <CrearDocente />;
    } else {
      return <ListaDocentes />;
    }
  };

  return <>{renderContent()}</>;
};

export default Docentes;
