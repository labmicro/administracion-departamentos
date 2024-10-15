"use client"; // This is a client component
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Cambiado a 'next/navigation'
import LoginPage from '@/pages/login'; // Ajusta la ruta si es necesario
import DashboardMenu from '@/pages/dashboard'; // Ajusta la ruta si es necesario

const AppWrapper = () => {
  const router = useRouter(); // Usamos useRouter de Next.js

  useEffect(() => {
    // Lógica de redirección basada en autenticación
    const isAuthenticated = localStorage.getItem('access_token'); // Verifica si hay un token de acceso
    if (isAuthenticated) {
      router.push('/dashboard/home'); // Redirige al Dashboard si está autenticado
    } else {
      router.push('/login'); // De lo contrario, redirige a la página de login
    }
  }, [router]);

  return <LoginPage />; // Renderiza la página de Login
};

export default AppWrapper;
