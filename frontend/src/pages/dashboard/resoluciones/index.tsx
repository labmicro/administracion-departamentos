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
    // <div>
    //   <header>
    //     <h1 style={h1Style}>Bienvenido a la Gestigón de Resoluciones</h1>
    //   </header>
    // </div>


      <Routes>
      {/* <Route path="/" element={<LoginPage />}/> */}
      <Route path="/*" element={<ListaResoluciones/>}/>
      <Route path="crear/*" element={<CrearResolucion/>}/>
      {/* <Route path="editar/*" element={<EditarResolucion/>}/> */}
       <Route path="editar/:idResolucion" Component={EditarResolucion} />
      {/* <Route path="about" element={<AboutPage />} /> */}
      </Routes>
      
  );
};

export default Resoluciones;