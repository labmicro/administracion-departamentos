import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Typography, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import DashboardMenu from '../../../../dashboard';


// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const EditarDepartamentoJefe: React.FC = () => {
  const router = useRouter();
  const { idDepartamentoJefe } = router.query; // Obtiene el id del departamento jefe de la ruta

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('0'); // Asegúrate de establecer un valor inicial
  const [interno, setInterno] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (idDepartamentoJefe) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/facet/jefe-departamento/${idDepartamentoJefe}/`);
          const data = response.data;
          setNombre(data.nombre);
          setTelefono(data.telefono);
          setEstado(String(data.estado)); // Asegúrate de convertir el estado a string
          setInterno(data.interno);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [idDepartamentoJefe]);

  const edicionDepartamentoJefe = async () => {
    const jefeDepartamentoEditado = {
      nombre,
      telefono,
      estado: Number(estado), // Convertir a número antes de enviar
      interno,
    };

    try {
      await axios.put(`http://127.0.0.1:8000/facet/jefe-departamento/${idDepartamentoJefe}/`, jefeDepartamentoEditado, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  const eliminarJefeDepartamento = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/facet/jefe-departamento/${idDepartamentoJefe}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Departamento Jefe Eliminado', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud DELETE:', error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    router.push('/dashboard/departments/jefes/'); // Redirige después de cerrar el modal
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Editar Jefe de Departamento
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
            <TextField
              label="Interno"
              value={interno}
              onChange={(e) => setInterno(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="none">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={edicionDepartamentoJefe}>
              Editar
            </Button>
            <Button onClick={() => setConfirmarEliminacion(true)} variant="contained" style={{ marginLeft: '8px' }} color='error'>
              Eliminar
            </Button>
          </Grid>
        </Grid>

        <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} />
        <ModalConfirmacion
          open={confirmarEliminacion}
          onClose={() => setConfirmarEliminacion(false)}
          onConfirm={() => {
            setConfirmarEliminacion(false);
            eliminarJefeDepartamento();
          }}
        />
      </Paper>
    </Container>
    </DashboardMenu>
  );
};

export default EditarDepartamentoJefe;
