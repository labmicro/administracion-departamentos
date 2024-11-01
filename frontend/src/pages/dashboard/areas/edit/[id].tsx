import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Typography, Paper, TextField, Button, InputLabel, Select, MenuItem, FormControl, Grid } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router';
import Swal from "sweetalert2";
import DashboardMenu from '../../../dashboard';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditarArea = () => {
  const router = useRouter();
  const { id: idArea } = router.query; // Captura el idArea directamente de la URL

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    router.push('/dashboard/areas/');
  };

  const [area, setArea] = useState<any | null>(null);
  const [iddepartamento, setIddepartamento] = useState<number>(0);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState<number | ''>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (idArea) { // Verifica que idArea no sea undefined
        try {
          const response = await axios.get(`http://127.0.0.1:8000/facet/area/${idArea}/`);
          const data = response.data;
          setArea(data);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los datos.',
          });
        }
      }
    };

    fetchData();
  }, [idArea]);

  useEffect(() => {
    if (area) {
      setIddepartamento(area.departamento);
      setNombre(area.nombre);
      setEstado(area.estado);
    }
  }, [area]);

  const edicionArea = async () => {
    const areaEditada = {
      departamento: iddepartamento,
      nombre: nombre,
      estado: estado,
    };

    try {
      await axios.put(`http://127.0.0.1:8000/facet/area/${idArea}/`, areaEditada, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  const eliminarArea = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/facet/area/${idArea}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Área Eliminada', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Areas
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
              value={area?.departamento || ''}
              disabled
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
                onChange={(e) => setEstado(Number(e.target.value))}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={edicionArea}>
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
            eliminarArea();
          }}
        />
      </Paper>
    </Container>
    </DashboardMenu>
  );
};

export default EditarArea;
