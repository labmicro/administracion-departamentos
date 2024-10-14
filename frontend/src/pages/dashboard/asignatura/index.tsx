import React from 'react';
import { useRouter } from 'next/router';
import CrearAsignatura from './create';
import ListaAsignaturas from './list';
import EditarAsignatura from './edit';
import DocenteAsignatura from './docenteAsignatura';

const Asignaturas = () => {
  const router = useRouter();
  const { idAsignatura, idDepartamento } = router.query;

  const h1Style = {
    color: 'black',
  };

  // Función para renderizar el componente correcto según la ruta
  const renderComponent = () => {
    switch (router.pathname) {
      case '/dashboard/asignaturas/crear':
        return <CrearAsignatura />;
      case `/dashboard/asignaturas/editar/[idAsignatura]/[idDepartamento]`:
        return <EditarAsignatura />;
      case `/dashboard/asignaturas/docentes/[idAsignatura]`:
        return <DocenteAsignatura />;
      default:
        return <ListaAsignaturas />;
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default Asignaturas;
