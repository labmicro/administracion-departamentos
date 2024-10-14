"use client"; // This is a client component
import LoginPage from '@/pages/login';
import DashboardMenu from '@/pages/dashboard';

const AppWrapper = () => {
  return (
    <>
      <Page />
    </>
  );
};

const Page = () => {
  // Aquí decides cuál componente renderizar dependiendo de tu lógica o estado
  // Puedes renderizar directamente ambos componentes
  return (
    <>
      {/* Renderiza las páginas directamente; ajusta según tu lógica */}
      <LoginPage />
      <DashboardMenu />
    </>
  );
};

export default AppWrapper;
