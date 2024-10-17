import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Grid, Paper, Typography, TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';

dayjs.extend(utc);
dayjs.extend(timezone);

interface EditarResolucionProps {
  idResolucion: string; // Asegúrate de que este tipo se ajuste a tu lógica
}

const EditarResolucion: React.FC<EditarResolucionProps> = ({ idResolucion }) => {
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
  };

  const [resolucion, setResolucion] = useState<any>(null);
  const [nroExpediente, setNroExpediente] = useState('');
  const [nroResolucion, setNroResolucion] = useState('');
  const [tipo, setTipo] = useState('');
  const [adjunto, setAdjunto] = useState('');
  const [fecha, setFecha] = useState<dayjs.Dayjs | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState<string>('0');

  useEffect(() => {
    const fetchData = async () => {
      if (idResolucion) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/facet/resolucion/${idResolucion}/`);
          setResolucion(response.data);
          setNroExpediente(response.data.nexpediente);
          setNroResolucion(response.data.nresolucion);
          setTipo(response.data.tipo);
          setAdjunto(response.data.adjunto);
          setFecha(dayjs(response.data.fecha));
          setObservaciones(response.data.observaciones);
          setEstado(String(response.data.estado));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [idResolucion]);

  const edicionResolucion = async () => {
    const resolucionEditada = {
      nexpediente: nroExpediente,
      nresolucion: nroResolucion,
      tipo: tipo || "",
      adjunto: adjunto,
      observaciones: observaciones,
      fecha: fecha ? fecha.toISOString() : null,
      estado: estado,
    };

    try {
      await axios.put(`http://127.0.0.1:8000/facet/resolucion/${idResolucion}/`, resolucionEditada, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  const eliminarResolucion = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/facet/resolucion/${idResolucion}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Resolución Eliminada', 'La acción se realizó con éxito.');
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Editar Resolución
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nro Expediente"
              value={nroExpediente}
              onChange={(e) => setNroExpediente(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nro Resolución"
              value={nroResolucion}
              onChange={(e) => setNroResolucion(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Link Documento Adjunto"
              value={adjunto}
              onChange={(e) => setAdjunto(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={0}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={edicionResolucion}>
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
            eliminarResolucion();
          }}
        />
      </Paper>
    </Container>
  );
};

export default EditarResolucion;
