import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Typography, TextField, Button, InputLabel, Select, MenuItem, FormControl, Grid, Paper } from '@mui/material';
import dayjs from 'dayjs'; // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import DashboardMenu from '../../../dashboard';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface EditarCarreraProps {
  idCarrera: string;
}

const EditarCarrera: React.FC = () => {
  const router = useRouter(); // Usamos useRouter de Next.js
  const { idCarrera } = router.query; // Obtenemos el idCarrera desde la ruta

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState(''); // Nuevo estado para el título del modal
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title); // Establecer el título del modal
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    router.push('/dashboard/carreras/'); // Usamos router.push para la navegación
  };

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';

  interface Carrera {
    idCarrera: number;
    nombre: string;
    tipo: TipoCarrera;
    planestudio: string;
    sitio: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [carrera, setCarrera] = useState<Carrera>();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [planEstudio, setPlanEstudio] = useState('');
  const [sitio, setsitio] = useState('');
  const [estado, setEstado] = useState('');

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  useEffect(() => {
    const fetchData = async () => {
      if (idCarrera) { // Verificamos que idCarrera esté definido
        try {
          const response = await axios.get(`http://127.0.0.1:8000/facet/carrera/${idCarrera}/`);
          const data = response.data;
          setCarrera(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [idCarrera]);

  // Manejar la actualización del estado fuera del efecto
  useEffect(() => {
    if (carrera) {
      setNombre(carrera.nombre);
      setEstado(String(carrera.estado));
      setTipo(String(carrera.tipo));
      setPlanEstudio(carrera.planestudio);
      setsitio(carrera.sitio);
      // Otros cambios de estado según sea necesario
    }
  }, [carrera]);

  const edicionCarrera = async () => {
    const carreraEditada = {
      nombre: nombre,
      tipo: tipo,
      planestudio: planEstudio,
      sitio: sitio,
      estado: estado, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };

    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/carrera/${idCarrera}/`, carreraEditada, {
        headers: {
          'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  const eliminarCarrera = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/facet/carrera/${idCarrera}/`, {
        headers: {
          'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
        },
      });
      handleOpenModal('Asignatura Eliminada', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud DELETE:', error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Carreras
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
            <FormControl fullWidth>
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                id="tipo-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoCarrera)}
              >
                <MenuItem value="Pregrado">Pregrado</MenuItem>
                <MenuItem value="Grado">Grado</MenuItem>
                <MenuItem value="Posgrado">Posgrado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Plan de Estudio"
              value={planEstudio}
              onChange={(e) => setPlanEstudio(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Sitio"
              value={sitio}
              onChange={(e) => setsitio(e.target.value)}
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
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={edicionCarrera}>
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
            eliminarCarrera();
          }}
        />
      </Paper>
    </Container>
    </DashboardMenu>
  );
};

export default EditarCarrera;
