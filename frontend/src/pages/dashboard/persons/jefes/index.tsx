import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import ListaJefe from './list';
import CrearJefe from './create';
import EditarJefe from './edit';

const Jefes = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación
  const { idPersona } = router.query; // Obtiene el id de la persona de la ruta

  const renderContent = () => {
    // Verifica si idPersona es un string antes de pasarlo
    if (typeof idPersona === 'string') {
      return <EditarJefe idPersona={idPersona} />; // Renderiza EditarJefe si hay un id
    } else if (router.pathname.endsWith('/crear')) {
      return <CrearJefe />; // Renderiza CrearJefe si el path es de crear
    } else {
      return <ListaJefe />; // Renderiza la lista por defecto
    }
  };

  return <>{renderContent()}</>; // Renderiza el contenido correspondiente
};

export default Jefes;
