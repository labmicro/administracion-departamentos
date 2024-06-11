import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearAsignaturaCarrera from './create';
import ListaAsignaturaCarrera from './list';
import EditarAsignaturaCarrera from './edit';


const AsignaturaCarrera = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>

      {/* <Route path="/:idCarrera/*" Component={ListaAsignaturaCarrera}/>     */}
      <Route path="/*" element={<ListaAsignaturaCarrera/>}/>
      <Route path="crear/*" Component={CrearAsignaturaCarrera}/>
      <Route path="editar/:idCarrera" Component={EditarAsignaturaCarrera}/>

      </Routes>
      
  );
};

export default AsignaturaCarrera;