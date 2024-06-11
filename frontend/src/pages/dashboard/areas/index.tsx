import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearArea from './create';
import ListaArea from './list';
import EditarArea from './edit';

const Areas = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>
    
      <Route path="/*" element={<ListaArea/>}/>
      <Route path="crear/*" element={<CrearArea/>}/>
      <Route path="editar/:idArea" Component={EditarArea}/>


      </Routes>
      
  );
};

export default Areas;