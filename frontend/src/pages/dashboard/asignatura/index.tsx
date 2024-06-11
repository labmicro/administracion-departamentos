import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearAsignatura from './create';
import ListaAsignaturas from './list';
import EditarAsignatura from './edit';
import DocenteAsignatura from './docenteAsignatura';

const Asignaturas = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
      <Route path="/*" element={<ListaAsignaturas/>}/>
      <Route path="crear/*" element={<CrearAsignatura/>}/>
      <Route path="editar/:idAsignatura/:idDepartamento" element={<EditarAsignatura/>}/>
      <Route path="docentes/:idAsignatura/*" element={<DocenteAsignatura/>}/>
      </Routes>
      
  );
};

export default Asignaturas;