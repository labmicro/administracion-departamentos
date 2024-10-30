import React from 'react';
import { useRouter } from 'next/router';
import CrearJefe from './create';
import ListaJefe from './list';

const Jefes = () => {
  const router = useRouter();

  const renderContent = () => {
    if (router.pathname.endsWith('/crear')) {
      return <CrearJefe />;
    } else {
      return <ListaJefe />;
    }
  };

  return <>{renderContent()}</>;
};

export default Jefes;
