import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import ListaNoDocentes from './list';
import CrearNoDocente from './create';
import EditarNoDocente from './edit';

const NoDocentes = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
    
      <Route path="/*" element={<ListaNoDocentes/>}/>
      <Route path="crear/*" element={<CrearNoDocente/>}/>
      <Route path="editar/:idPersona" Component={EditarNoDocente}/>


      </Routes>
      
  );
};

export default NoDocentes;