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
import { useRouter } from 'next/navigation'; // Usamos useRouter de Next.js
import axios from 'axios';
import Swal from "sweetalert2";

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
  const router = useRouter(); // Usamos useRouter de Next.js
  const [defaultTheme, setDefaultTheme] = useState<Theme | undefined>();

  useEffect(() => {
    const customTheme = createTheme({
      palette: {
        background: {
          default: '#fff'
        }
      },
    });

    setDefaultTheme(customTheme);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/token/', {
        email,
        password,
      });
  
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
  
      router.push('/dashboard/home'); // Redirige al Dashboard después de iniciar sesión
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Correo electrónico o contraseña incorrectos.',
      });
    }
  };
  
  if (!defaultTheme) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Inicio de Sesión</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Correo Electrónico" name="email" autoComplete="email" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" autoComplete="current-password" />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Recuérdame" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Iniciar Sesión</Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
