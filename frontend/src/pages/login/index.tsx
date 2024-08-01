"use client"; // This is a client component
import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Theme, createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function LoginPage() {
  const navigate = useNavigate(); // Obtiene la función de navegación
  const [defaultTheme, setDefaultTheme] = useState<Theme | undefined>();

  useEffect(() => {
    const customTheme = createTheme({
      palette: {
        background: {
          default: '#fff' // Establece el color de fondo por defecto a blanco
        }
      },
      // Puedes añadir más personalizaciones aquí
    });

    setDefaultTheme(customTheme);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
  
    try {
      // Solicita los tokens JWT al backend de Django
      const response = await axios.post('http://127.0.0.1:8000/api/login/token/', {
        email,
        password,
      });
  
      // Guarda los tokens en localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
  
      // Redirige al dashboard o a la ruta que desees
      navigate('/dashboard/home');
    } catch (error) {
      console.error('Error al autenticar:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };
  

  if (!defaultTheme) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Toaster />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inicio de Sesión
          </Typography>
          <Typography component="h2" variant="h5">
            Gestión de departamentos FACET
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recuérdame"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
            <Box
              sx={{
                width: '100%', // Asegura que el Box ocupe todo el ancho.
                textAlign: 'center', // Centra el contenido textual.
                mt: 2, // Agrega un margen superior para separar de los otros elementos
              }}
            >
              {/* <Link href="#" variant="body2">
                ¿Olvidó su contraseña?
              </Link> */}
            </Box>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
