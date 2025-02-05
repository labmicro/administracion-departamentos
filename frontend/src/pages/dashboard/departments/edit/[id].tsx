import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import DashboardMenu from '../..';
import withAuth from "../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../utils/config";
import API from "../../../../api/axiosConfig";


dayjs.extend(utc);
dayjs.extend(timezone);

const EditarDepartamento = () => {
  const router = useRouter();
  const { id: idDepartamento } = router.query; // Obtener el id de la URL

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const [departamento, setDepartamento] = useState({
    nombre: '',
    telefono: '',
    estado: '',
    interno: '',
  });

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    router.push('/dashboard/departments/');
  };

  useEffect(() => {
    if (idDepartamento) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/facet/departamento/${idDepartamento}/`);
          setDepartamento(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [idDepartamento]);

  const edicionDepartamento = async () => {
    try {
      await API.put(`/facet/departamento/${idDepartamento}/`, departamento);
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  const eliminarDepartamento = async () => {
    try {
      await API.delete(`/facet/departamento/${idDepartamento}/`);
      handleOpenModal('Departamento Eliminado', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Departamentos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombres"
                value={departamento.nombre}
                onChange={(e) => setDepartamento({ ...departamento, nombre: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                value={departamento.telefono}
                onChange={(e) => setDepartamento({ ...departamento, telefono: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="none">
                <InputLabel id="estado-label">Estado </InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado-select"
                  value={departamento.estado}
                  label="Estado"
                  onChange={(e) => setDepartamento({ ...departamento, estado: e.target.value })}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={0}>0</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Interno"
                value={departamento.interno}
                onChange={(e) => setDepartamento({ ...departamento, interno: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} marginBottom={2}>
              <Button variant="contained" onClick={edicionDepartamento}>
                Editar
              </Button>
              <Button onClick={() => setConfirmarEliminacion(true)} variant="contained" color="error" style={{ marginLeft: '8px' }}>
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
              eliminarDepartamento();
            }}
          />
        </Paper>
      </Container>
    </DashboardMenu>
  );
};

export default withAuth(EditarDepartamento);
