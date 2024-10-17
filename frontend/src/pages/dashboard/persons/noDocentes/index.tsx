import React from 'react';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import ListaNoDocentes from './list';
import CrearNoDocente from './create';
import EditarNoDocente from './edit';

const NoDocentes = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación
  const { idPersona } = router.query; // Obtiene el id de la persona de la ruta

  const renderContent = () => {
    // Verifica que idPersona esté definido
    if (idPersona) {
      return <EditarNoDocente />; // Renderiza EditarNoDocente si hay un id
    } else if (router.pathname.endsWith('/crear')) {
      return <CrearNoDocente />; // Renderiza CrearNoDocente si el path es de crear
    } else {
      return <ListaNoDocentes />; // Renderiza la lista por defecto
    }
  };

  return <>{renderContent()}</>; // Renderiza el contenido correspondiente
};

export default NoDocentes;
