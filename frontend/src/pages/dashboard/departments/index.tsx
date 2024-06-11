import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearDepartamento from './create';
import ListaDepartamentos from './list';
import EditarDepartamento from './edit';
import DepartamentosJefe from './departamentoJefe';

const Departamentos = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
    
      <Route path="/*" element={<ListaDepartamentos/>}/>
      <Route path="crear/*" element={<CrearDepartamento/>}/>
      <Route path="editar/:idDepartamento" Component={EditarDepartamento}/>
      <Route path="jefes/*" element={<DepartamentosJefe/>}/>


      </Routes>
      
  );
};

export default Departamentos;