import React from 'react';
import { useRouter } from 'next/router';
import CrearArea from './create';
import ListaArea from './list';

const Areas = () => {
  const router = useRouter();
  const { path } = router.query;

  const renderComponent = () => {
    if (path === 'crear') {
      return <CrearArea />;
    } else {
      return <ListaArea />; // Renderiza ListaArea por defecto
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default Areas;
