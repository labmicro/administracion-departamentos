import React from 'react';
import {Route, Routes,Navigate, useLocation,BrowserRouter  as Router} from 'react-router-dom';
import CrearCarrera from './create';
import ListaCarreras from './list';
import EditarCarrera from './edit';
import AsignaturaCarrera from './asignaturaCarrera';



const Carreras = () => {
  const h1Style = {
    color: 'black',
  };

  return (

      <Routes>

      <Route path="/*" element={<ListaCarreras/>}/>
      <Route path="crear/*" element={<CrearCarrera/>}/>
      <Route path="editar/:idCarrera" Component={EditarCarrera}/>
      <Route path="asignaturas/:idCarrera/*" Component={AsignaturaCarrera}/>
      {/* <Route path="asignaturas/*" element={<AsignaturaCarrera/>}/> */}

      </Routes>
      
  );
};

export default Carreras;