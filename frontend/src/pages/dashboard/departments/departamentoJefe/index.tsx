import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import ListaDepartamentosJefe from './list';
import CrearDepartamentoJefe from './create';
import EditarDepartamentoJefe from './edit';

const DepartamentosJefe = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
    
      <Route path="/*" element={<ListaDepartamentosJefe/>}/>
      <Route path="crear/*" element={<CrearDepartamentoJefe/>}/>
      <Route path="editar/:idDepartamento" Component={EditarDepartamentoJefe}/>


      </Routes>
      
  );
};

export default DepartamentosJefe;