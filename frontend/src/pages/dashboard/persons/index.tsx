import React from 'react';
import { useRouter } from 'next/router';
import CrearPersona from './create';
import ListaPersonas from './list';
import Jefes from './jefes';
import Docentes from './docentes';
import NoDocentes from './noDocentes';

const Personas = () => {
  const router = useRouter();
  const { path } = router.query;

  const renderContent = () => {
    if (!path) return <ListaPersonas />;

    switch (path) {
      case 'crear':
        return <CrearPersona />;
      case 'jefes':
        return <Jefes />;
      case 'docentes':
        return <Docentes />;
      case 'nodocentes':
        return <NoDocentes />;
      default:
        return <ListaPersonas />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default Personas;
