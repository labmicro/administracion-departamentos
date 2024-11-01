import React from 'react';
import { useRouter } from 'next/router';
import CrearAsignatura from './create';
import ListaAsignaturas from './list';
import DocenteAsignatura from './docenteAsignatura';

const Asignaturas = () => {
  const router = useRouter();
  const { path, idAsignatura } = router.query; // Obtiene `path` e `idAsignatura` de la URL

  const renderComponent = () => {
    if (path === 'crear') {
      return <CrearAsignatura />;
    } else if (path === 'docentes' && idAsignatura) {
      return <DocenteAsignatura idAsignatura={idAsignatura as string} />;
    } else {
      return <ListaAsignaturas />; // Renderiza ListaAsignaturas por defecto
    }
  };

  return <div>{renderComponent()}</div>;
};

export default Asignaturas;
