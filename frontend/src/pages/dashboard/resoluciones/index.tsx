import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearResolucion from './create';
import ListaResoluciones from './list';
import EditarResolucion from './edit';

const Resoluciones = () => {
  const h1Style = {
    color: 'black',
  };

  return (


      <Routes>
      <Route path="/*" element={<ListaResoluciones/>}/>
      <Route path="crear/*" element={<CrearResolucion/>}/>
       <Route path="editar/:idResolucion" Component={EditarResolucion} />
      </Routes>
      
  );
};

export default Resoluciones;