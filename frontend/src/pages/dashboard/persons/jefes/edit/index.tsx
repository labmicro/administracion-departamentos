import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Grid, Paper, Typography, TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js

const EditarJefe: React.FC<{ idPersona: string }> = ({ idPersona }) => {
  const router = useRouter();

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
    router.push('/dashboard/personas/jefes/'); // Navegar a la lista de jefes
  };

  interface Jefe {
    idpersona: number;
    observaciones: string;
    estado: 0 | 1;
  }

  const [jefe, setJefe] = useState<Jefe>();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/jefe/${idPersona}/`);
        setPersona(response.data.persona);
        const responsePers = await axios.get(`http://127.0.0.1:8000/facet/persona/${response.data.persona.id}/`);
        setNombre(responsePers.data.nombre);
        setApellido(responsePers.data.apellido);
        SetDni(responsePers.data.dni);
        setJefe(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (idPersona) { // Verifica que idPersona esté definido
      fetchData();
    }
  }, [idPersona]);

  useEffect(() => {
    if (jefe) {
      setEstado(jefe.estado);
      setObservaciones(jefe.observaciones);
    }
  }, [jefe]);

  const edicionDepartamentoJefe = async () => {
    const jefeEditado = {
      persona: persona,
      observaciones: observaciones,
      estado: estado,
    };

    try {
      await axios.put(`http://127.0.0.1:8000/facet/jefe/${idPersona}/`, jefeEditado, {
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
      await axios.delete(`http://127.0.0.1:8000/facet/jefe/${idPersona}/`, {
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
  );
};

export default EditarJefe;
