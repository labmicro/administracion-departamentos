import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Grid, Paper, Typography, TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router'; 
import DashboardMenu from '../../..';
import withAuth from "../../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../../utils/config";


const EditarJefe: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Obtén el id del jefe directamente de la URL

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [persona, setPersona] = useState<number>(0);

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    router.push('/dashboard/persons/jefes/'); // Navegar a la lista de jefes
  };

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/facet/jefe/${id}/obtener_jefe/`);

        // Extrae y configura los datos del jefe y la persona asociada
        setPersona(response.data.persona.id);
        setNombre(response.data.persona.nombre);
        setApellido(response.data.persona.apellido);
        SetDni(response.data.persona.dni);
        setObservaciones(response.data.observaciones);
        setEstado(response.data.estado);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (id) { // Verifica que id esté definido
      fetchData();
    }
  }, [id]);

  const edicionDepartamentoJefe = async () => {
    const jefeEditado = {
      persona: persona,
      observaciones: observaciones,
      estado: estado,
    };

    try {
      await axios.put(`${API_BASE_URL}/facet/jefe/${id}/`, jefeEditado, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
      console.error(error);
    }
  };

  const eliminarJefe = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/facet/jefe/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Jefe Eliminado', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Editar Jefe
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField disabled value={`${apellido} ${nombre}`} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="DNI" value={dni} disabled fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="none">
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado-select"
                  value={estado}
                  label="Estado"
                  onChange={(e) => setEstado(Number(e.target.value))}
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
              <Button onClick={() => setConfirmarEliminacion(true)} variant="contained" style={{ marginLeft: '8px' }} color="error">
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
              eliminarJefe();
            }}
          />
        </Paper>
      </Container>
    </DashboardMenu>
  );
};

export default withAuth(EditarJefe);
