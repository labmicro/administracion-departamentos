import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import DashboardMenu from '../../dashboard';

const Home = () => {
  return (
    <DashboardMenu>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: '40px', marginTop: '30px', textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom style={{ color: '#3f51b5' }}>
            Bienvenido a la Gestión de Departamentos
          </Typography>
          <Typography variant="h5" component="p" gutterBottom style={{ color: '#757575' }}>
            La plataforma para gestionar asignaturas, docentes, resoluciones y personas de manera eficiente y organizada.
          </Typography>
          <Box mt={3}>
            <Typography variant="body1" component="p">
              Utilice el menú de navegación para acceder a las secciones de administración. Estamos aquí para ayudarle a optimizar su flujo de trabajo y
              gestionar la información académica con facilidad.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </DashboardMenu>
  );
};

export default Home;
