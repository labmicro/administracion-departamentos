import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearDocenteAsignatura  from './create';
import ListaDocenteAsignatura from './list';
import EditarDocenteAsignatura from './edit';

const DocenteAsignatura = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
      <Route path="/*" element={<ListaDocenteAsignatura/>}/>
      <Route path="crear/*" element={<CrearDocenteAsignatura/>}/>
      <Route path="editar/:idPersona" element={<EditarDocenteAsignatura/>}/>
      </Routes>
      
  );
};

export default DocenteAsignatura;