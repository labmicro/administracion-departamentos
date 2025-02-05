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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import DashboardMenu from '../..';
import withAuth from "../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../utils/config";
import API from '@/api/axiosConfig';


// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearResolucion = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  interface Resolucion {
    idresolucion: number;
    nexpediente: string;
    nresolucion: string;
    tipo: string;
    fechadecarga: Date;
    fecha: Date; // Aquí indicas que 'fecha' es de tipo Date
    adjunto: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [nroExpediente, setNroExpediente] = useState('');
  const [nroResolucion, setNroResolucion] = useState('');
  const [tipo, setTipo] = useState('');
  const [adjunto, setAdjunto] = useState('');
  const [fechaCarga, setFechaCarga] = useState('');
  const [fecha, setFecha] = useState<dayjs.Dayjs | null>(null);
  const [estado, setEstado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

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
    router.push('/dashboard/resoluciones/'); // Navegar a la lista de resoluciones
  };

  const crearNuevaResolucion = async () => {
    const nuevaResolucion = {
      nexpediente: nroExpediente,
      nresolucion: nroResolucion,
      tipo: tipo || '',
      adjunto: adjunto,
      observaciones: '', // Puedes asignar el valor que corresponda
      fechadecarga: new Date(), // Usamos la fecha actual
      fecha: fecha ? fecha.toISOString() : null, // Convierte la fecha a formato ISO si existe
      estado: estado,
    };

    try {
      const response = await API.post(`/facet/resolucion/`, nuevaResolucion);
      handleOpenModal('Éxito', 'Se creó la resolución con éxito.', handleConfirmModal);
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Crear Resolución
        </Typography>

        {/* Agrega controles de entrada y botones para los filtros */}
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
            <FormControl fullWidth margin="none">
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tipo}
                label="Tipo"
                onChange={(e) => setTipo(e.target.value)}
              >
                <MenuItem value={"Rector"}>Rector</MenuItem>
                <MenuItem value={"Decano"}>Decano</MenuItem>
                <MenuItem value={"Consejo_Superior"}>Consejo Superior</MenuItem>
                <MenuItem value={"Consejo_Directivo"}>Consejo Directivo</MenuItem>
              </Select>
            </FormControl>
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
            <FormControl fullWidth margin="none">
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={estado}
                label="Estado"
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha"
                value={fecha}
                onChange={(date) => {
                  if (date) {
                    const fechaSeleccionada = dayjs(date).utc(); // Usa .utc() para evitar problemas de zona horaria
                    setFecha(fechaSeleccionada);
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={crearNuevaResolucion}>
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

export default withAuth(CrearResolucion);
