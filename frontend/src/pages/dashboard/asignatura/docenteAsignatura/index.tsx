import React from 'react';
import { useRouter } from 'next/router';
import CrearDocenteAsignatura from './create';
import ListaDocenteAsignatura from './list';
import EditarDocenteAsignatura from './edit';

const DocenteAsignatura = () => {
  const router = useRouter();
  const { idDocenteAsignatura } = router.query;

  const h1Style = {
    color: 'black',
  };

  // Función para renderizar el componente correcto según la ruta
  const renderComponent = () => {
    switch (router.pathname) {
      case '/dashboard/docentes/asignatura/crear':
        return <CrearDocenteAsignatura />;
      case `/dashboard/docentes/asignatura/editar/${idDocenteAsignatura}`:
        return <EditarDocenteAsignatura />;
      default:
        return <ListaDocenteAsignatura />;
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default DocenteAsignatura;
