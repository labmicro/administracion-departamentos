import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import ListaDocentes from './list';
import CrearDocente from './create';
import EditarDocente from './edit';

const Docentes = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
    
      <Route path="/*" element={<ListaDocentes/>}/>
      <Route path="crear/*" element={<CrearDocente/>}/>
      <Route path="editar/:idPersona" Component={EditarDocente}/>


      </Routes>
      
  );
};

export default Docentes;