import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import ListaJefe from './list';
import CrearJefe from './create';
import EditarJefe from './edit';

const Jefes = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
    
      <Route path="/*" element={<ListaJefe/>}/>
      <Route path="crear/*" element={<CrearJefe/>}/>
      <Route path="editar/:idPersona" Component={EditarJefe}/>


      </Routes>
      
  );
};

export default Jefes;