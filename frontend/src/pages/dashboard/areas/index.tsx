import React from 'react';
import { useRouter } from 'next/router';
import CrearArea from './create';
import ListaArea from './list';
import EditarArea from './edit';

const Areas = () => {
  const router = useRouter();
  const { idArea } = router.query; // Obtenemos el idArea desde la query

  const renderComponent = () => {
    if (router.pathname === '/dashboard/areas/crear') {
      return <CrearArea />;
    } else if (router.pathname === '/dashboard/areas/editar/[idArea]') {
      return <EditarArea idArea={typeof idArea === 'string' ? idArea : ''} />; // Asegúrate de que idArea sea un string
    } else {
      return <ListaArea />;
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default Areas;
