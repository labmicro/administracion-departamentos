import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Paper, TextField, Button, InputLabel, Select, MenuItem, FormControl, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs'; // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import { useRouter } from 'next/router';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearPersona = () => {
  const h1Style = {
    color: 'black',
  };

  const router = useRouter();

  interface Persona {
    idPersona: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    email: string;
    interno: string;
    legajo: string;
    // Otros campos según sea necesario
  }

  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [legajo, setLegajo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [interno, setInterno] = useState('');
  const [estado, setEstado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleOpenModal = (title: string, message: string, onConfirm: () => void) => {
    setModalTitle(title); // Establecer el título del modal
    setModalMessage(message);
    setModalVisible(true);
    setFn(() => onConfirm);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const handleConfirmModal = () => {
    router.push('/dashboard/personas/');
  };

  const crearNuevaPersona = async () => {
    const nuevaPersona = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      dni: dni,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
      email: email,
      interno: interno,
      legajo: legajo,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/facet/persona/', nuevaPersona, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenModal('Éxito', 'Se creó la persona con éxito.', handleConfirmModal);
    } catch (error) {
      console.log(error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Personas
        </Typography>

        {/* Agrega controles de entrada y botones para los filtros */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombres"
              value={nombre}
              onChange={(e) => setNombre(capitalizeFirstLetter(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Apellido"
              value={apellido}
              onChange={(e) => setApellido(capitalizeFirstLetter(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="none">
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={estado}
                label="Tipo"
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Interno"
              value={interno}
              onChange={(e) => setInterno(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Legajo"
              value={legajo}
              onChange={(e) => setLegajo(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={crearNuevaPersona}>
              Crear
            </Button>
          </Grid>
        </Grid>
        <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />
      </Paper>
    </Container>
  );
};

export default CrearPersona;
