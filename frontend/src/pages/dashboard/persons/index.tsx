import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearPersona from './create';
import ListaPersonas from './list';
import EditarPersona from './edit';
import Jefes from './jefes';
import Docentes from './docentes';
import NoDocentes from './noDocentes';

const Personas = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
    
      <Route path="/*" element={<ListaPersonas/>}/>
      <Route path="crear/*" element={<CrearPersona/>}/>
      <Route path="editar/:idPersona" Component={EditarPersona}/>
      <Route path="jefes/*" element={<Jefes/>}/>
      <Route path="docentes/*" element={<Docentes/>}/>
      <Route path="nodocentes/*" element={<NoDocentes/>}/>

      </Routes>
      
  );
};

export default Personas;