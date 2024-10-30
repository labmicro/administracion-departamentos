// src/pages/dashboard/careers/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ListaCarreras from './list'; // Importa el componente ListaCarreras

const Carreras = () => {
  const router = useRouter();

  return (
    <div>
      <ListaCarreras />
    </div>
  );
};

export default Carreras;
