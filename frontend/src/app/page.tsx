"use client"; // Esto indica que el componente es del lado del cliente
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Cambiado a 'next/navigation'

const AppWrapper = () => {
  const router = useRouter(); // Usamos useRouter de Next.js
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Estado para verificar autenticación

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('access_token'); // Verifica si hay un token de acceso

    if (isAuthenticated) {
      router.replace('/dashboard/home'); // Redirige al Dashboard si está autenticado
    } else {
      router.replace('/login'); // De lo contrario, redirige a la página de login
    }

    setIsCheckingAuth(false); // Finaliza la verificación de autenticación
  }, [router]);

  // Mientras verifica autenticación, no renderiza nada
  if (isCheckingAuth) {
    return <div>Cargando...</div>; // Puedes reemplazar esto con un loader si lo deseas
  }

  return null; // Evita renderizar contenido después de redirección
};

AppWrapper.displayName = "AppWrapper"; // Agrega un displayName para ESLint
export default AppWrapper;
