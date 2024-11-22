import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Grid, Paper, Typography, TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router';
import DashboardMenu from '../../..';
import withAuth from "../../../../../components/withAut"; 


const EditarDocente: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Obtén el id directamente desde router.query

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [fn, setFn] = useState(() => () => {});
  const [persona, setPersona] = useState<number>(0);

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    router.push('/dashboard/persons/docentes/');
  };

  interface Docente {
    idpersona: number;
    observaciones: string;
    estado: 0 | 1;
  }

  const [docente, setDocente] = useState<Docente>();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/docente/${id}/`);
        setPersona(response.data.persona);
        const responsePers = await axios.get(`http://127.0.0.1:8000/facet/persona/${response.data.persona}/`);
        setNombre(responsePers.data.nombre);
        setApellido(responsePers.data.apellido);
        setDni(responsePers.data.dni);
        setDocente(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (id) { // Verifica que id esté definido
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (docente) {
      setEstado(docente.estado);
      setObservaciones(docente.observaciones);
    }
  }, [docente]);

  const edicionDepartamentoDocente = async () => {
    const docenteEditado = {
      persona: persona,
      observaciones: observaciones,
      estado: estado,
    };

    try {
      await axios.put(`http://127.0.0.1:8000/facet/docente/${id}/`, docenteEditado, {
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

  const eliminarDocente = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/facet/docente/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Docente Eliminado', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Editar Docente
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
              <Button variant="contained" onClick={edicionDepartamentoDocente}>
                Editar
              </Button>
              <Button onClick={() => setConfirmarEliminacion(true)} variant="contained" style={{ marginLeft: '8px' }} color="error">
                Eliminar
              </Button>
            </Grid>
          </Grid>
          <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle}  content={modalMessage} onConfirm={fn} />
          <ModalConfirmacion
            open={confirmarEliminacion}
            onClose={() => setConfirmarEliminacion(false)}
            onConfirm={() => {
              setConfirmarEliminacion(false);
              eliminarDocente();
            }}
          />
        </Paper>
      </Container>
    </DashboardMenu>
  );
};

export default withAuth(EditarDocente);
