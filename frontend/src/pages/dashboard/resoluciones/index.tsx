import React from 'react';
import { useRouter } from 'next/router';
import CrearResolucion from './create';
import ListaResoluciones from './list';
import EditarResolucion from './edit';

const Resoluciones = () => {
  const router = useRouter();
  const { idResolucion } = router.query; // Obtiene el id de la resolución de la ruta

  const renderContent = () => {
    // Verifica si idResolucion está definido y es un string
    if (typeof idResolucion === 'string') {
      return <EditarResolucion idResolucion={idResolucion} />; // Renderiza EditarResolucion si hay un id
    } else if (router.pathname.endsWith('/crear')) {
      return <CrearResolucion />; // Renderiza CrearResolucion si el path es de crear
    } else {
      return <ListaResoluciones />; // Renderiza la lista por defecto
    }
  };

  return <>{renderContent()}</>; // Renderiza el contenido correspondiente
};

export default Resoluciones;
