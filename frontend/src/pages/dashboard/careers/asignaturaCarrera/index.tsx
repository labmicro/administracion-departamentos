// src/pages/dashboard/careers/asignaturaCarrera/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ListaAsignaturaCarrera from './list'; // Asegúrate de que la ruta es correcta

const AsignaturaCarrera = () => {
  const router = useRouter();
  const { idCarrera } = router.query; // Obtenemos el idCarrera de la URL

  return (
    <div>
      <h1 style={{ color: 'black' }}>Asignaturas de la Carrera {idCarrera}</h1>
      <button onClick={() => router.push(`/dashboard/careers/asignaturaCarrera/create`)}> {/* Navega a crear */}
        Agregar Asignatura
      </button>
      <ListaAsignaturaCarrera />
    </div>
  );
};

export default AsignaturaCarrera;
