
import React from 'react';
import { useRouter } from 'next/router';
import CrearDocenteAsignatura from './create';
import ListaDocenteAsignatura from './list';
import EditarDocenteAsignatura from './edit';

interface DocenteAsignaturaProps {
  idAsignatura: string;
}

const DocenteAsignatura: React.FC<DocenteAsignaturaProps> = ({ idAsignatura }) => {
  const router = useRouter();
  const { idDocenteAsignatura } = router.query;

  // Función para renderizar el componente correcto según la ruta
  const renderComponent = () => {
    switch (router.pathname) {
      case '/dashboard/asignaturas/docentes/[idAsignatura]/crear':
        return <CrearDocenteAsignatura />;
      case `/dashboard/asignaturas/docentes/[idAsignatura]/editar/[idDocenteAsignatura]`:
        return <EditarDocenteAsignatura />;
      default:
        return <ListaDocenteAsignatura idAsignatura={idAsignatura} />;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default DocenteAsignatura;