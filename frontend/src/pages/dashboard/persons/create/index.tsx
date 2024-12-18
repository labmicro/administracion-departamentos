import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import BasicModal from '@/utils/modal';
import { useRouter } from 'next/router';
import DashboardMenu from '../../../dashboard';
import withAuth from "../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../utils/config";


// Componente para crear una nueva persona
const CrearPersona = () => {
  const router = useRouter();

  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [legajo, setLegajo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [interno, setInterno] = useState('');
  const [estado, setEstado] = useState('');
  const [titulo, setTitulo] = useState(''); // Estado para el campo de Título
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

  // Función para capitalizar la primera letra de un texto
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // Funciones de control del modal
  const handleOpenModal = (title: string, message: string, onConfirm: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
    setFn(() => onConfirm);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const handleConfirmModal = () => {
    router.push('/dashboard/persons/');
  };

  // Función para crear una nueva persona
  const crearNuevaPersona = async () => {
    const nuevaPersona = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      dni: dni,
      estado: estado,
      email: email,
      interno: interno,
      legajo: legajo,
      titulo: titulo, // Añadido el campo título en la solicitud
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/facet/persona/`, nuevaPersona, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenModal('Éxito', 'Se creó la persona con éxito.', handleConfirmModal);
    } catch (error) {
      handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
    }
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Personas
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="DNI" value={dni} onChange={(e) => setDni(e.target.value)} fullWidth />
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
              <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select value={estado} label="Estado" onChange={(e) => setEstado(e.target.value)}>
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Interno" value={interno} onChange={(e) => setInterno(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Legajo" value={legajo} onChange={(e) => setLegajo(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField // Campo para el Título
                label="Título"
                value={titulo}
                onChange={(e) => setTitulo(capitalizeFirstLetter(e.target.value))}
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
    </DashboardMenu>
  );
};

export default withAuth(CrearPersona);
