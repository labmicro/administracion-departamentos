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
import { Link } from 'react-router-dom';

export const ItemsMenu = (
  <React.Fragment>
    <Link to="/dashboard/home"> {/* Agrega un enlace a la página deseada */}
    <ListItemButton>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Inicio" />
    </ListItemButton>
    </Link>
    <Link to="/dashboard/resoluciones"> 
    <ListItemButton>
      <ListItemIcon>
        <ArticleIcon />
      </ListItemIcon>
      <ListItemText primary="Resoluciones" />
    </ListItemButton>
    </Link>
    <Link to="/dashboard/personas"> 
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Personas" />
    </ListItemButton>
    </Link>
    <Link to="/dashboard/departamentos"> 
    <ListItemButton>
      <ListItemIcon>
        <ViewComfyIcon />
      </ListItemIcon>
      <ListItemText primary="Departamentos" />
    </ListItemButton>
    </Link>
    <Link to="/dashboard/areas"> 
    <ListItemButton>
      <ListItemIcon>
        <AutoAwesomeMotionIcon />
      </ListItemIcon>
      <ListItemText primary="Area" />
    </ListItemButton>
    </Link>
    <Link to="/dashboard/asignaturas"> 
    <ListItemButton>
      <ListItemIcon>
        <NoteAltIcon />
      </ListItemIcon>
      <ListItemText primary="Asignaturas" />
    </ListItemButton>
    </Link>
    <Link to="/dashboard/carreras"> 
    <ListItemButton>
      <ListItemIcon>
        <SchoolIcon />
      </ListItemIcon>
      <ListItemText primary="Carreras" />
    </ListItemButton>
    </Link>
    <Link to="/dashboard/reportes"> 
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reportes" />
    </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Reportes Guardados
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reporte 1" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reporte 2" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reporte 3" />
    </ListItemButton>
  </React.Fragment>
);