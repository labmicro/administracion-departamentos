import React from 'react';
import { useRouter } from 'next/router';
import CrearDocenteAsignatura from './[idAsignatura]/create';
import ListaDocenteAsignatura from './[idAsignatura]';
import EditarDocenteAsignatura from './[idAsignatura]/edit/[idDocenteAsignatura]';

const DocenteAsignatura: React.FC = () => {
  const router = useRouter();
  const { idAsignatura, idDocenteAsignatura } = router.query;

  // Función para renderizar el componente correcto según la ruta
  const renderComponent = () => {
    switch (router.asPath) {
      case `/dashboard/asignatura/docenteAsignatura/${idAsignatura}/crear`:
        return <CrearDocenteAsignatura />;
      case `/dashboard/asignatura/docenteAsignatura/${idAsignatura}/editar/${idDocenteAsignatura}`:
        return <EditarDocenteAsignatura />;
      default:
        return <ListaDocenteAsignatura />;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default DocenteAsignatura;
