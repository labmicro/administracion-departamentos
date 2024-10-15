// src/pages/dashboard/careers/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ListaCarreras from './list'; // Importa el componente ListaCarreras

const Carreras = () => {
  const router = useRouter();

  return (
    <div>
      <h1 style={{ color: 'black' }}>Carreras</h1>
      <button onClick={() => router.push('/dashboard/careers/create')}>
        Agregar Carrera
      </button>
      <ListaCarreras />
    </div>
  );
};

export default Carreras;
