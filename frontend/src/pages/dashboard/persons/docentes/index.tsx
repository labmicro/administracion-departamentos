import React from 'react';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import ListaDocentes from './list';
import CrearDocente from './create';
import EditarDocente from './edit';

const Docentes = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación
  const { idPersona } = router.query; // Obtiene el id de la persona de la ruta

  const renderContent = () => {
    // Verifica si idPersona es un string antes de pasarlo
    if (typeof idPersona === 'string') {
      return <EditarDocente id={idPersona} />; // Renderiza EditarDocente si hay un id
    } else if (router.pathname.endsWith('/crear')) {
      return <CrearDocente />; // Renderiza CrearDocente si el path es de crear
    } else {
      return <ListaDocentes />; // Renderiza la lista por defecto
    }
  };

  return <>{renderContent()}</>; // Renderiza el contenido correspondiente
};

export default Docentes;
