import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import HomeIcon from '@mui/icons-material/Home';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js

const ItemsMenu = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  const handleNavigation = (path: string) => {
    router.push(path); // Navega a la ruta especificada
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={() => handleNavigation('/dashboard/home')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/dashboard/resoluciones')}>
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="Resoluciones" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/dashboard/persons')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Personas" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/dashboard/departments')}>
        <ListItemIcon>
          <ViewComfyIcon />
        </ListItemIcon>
        <ListItemText primary="Departamentos" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/dashboard/areas')}>
        <ListItemIcon>
          <AutoAwesomeMotionIcon />
        </ListItemIcon>
        <ListItemText primary="Area" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/dashboard/asignatura')}>
        <ListItemIcon>
          <NoteAltIcon />
        </ListItemIcon>
        <ListItemText primary="Asignaturas" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/dashboard/careers')}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Carreras" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/dashboard/reportes')}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reportes" />
      </ListItemButton>
    </React.Fragment>
  );
};


export default ItemsMenu;
