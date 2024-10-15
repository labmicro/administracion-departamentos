import React from 'react';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import ListaDepartamentosJefe from './list';
import CrearDepartamentoJefe from './create';
import EditarDepartamentoJefe from './edit';

const DepartamentosJefe = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación
  const { idDepartamentoJefe } = router.query; // Obtiene el id del departamento jefe de la ruta

  const renderContent = () => {
    // Verifica si idDepartamentoJefe es un string antes de pasarlo
    if (typeof idDepartamentoJefe === 'string') {
      return <EditarDepartamentoJefe />; // Renderiza EditarDepartamentoJefe si hay un id, no le pases el id como prop
    } else if (router.pathname.endsWith('/crear')) {
      return <CrearDepartamentoJefe />; // Renderiza CrearDepartamentoJefe si el path es de crear
    } else {
      return <ListaDepartamentosJefe />; // Renderiza la lista por defecto
    }
  };

  return <>{renderContent()}</>; // Renderiza el contenido correspondiente
};

export default DepartamentosJefe;
