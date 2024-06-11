import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { Link, useParams ,useNavigate } from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const EditarResolucion : React.FC = () => {

  const navigate = useNavigate();

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
    navigate('/dashboard/resoluciones/');
  };

  const { idResolucion } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  interface Resolucion {
    idresolucion: number;
    nexpediente: string;
    nresolucion: string;
    tipo: string;
    fechadecarga: Date;
    fecha: Date; // Aquí indicas que 'fecha' es de tipo Date
    adjunto:string;
    observaciones:string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [resolucion, setResolucion] = useState<Resolucion>();
  const [nroExpediente, setNroExpediente] = useState('');
  const [nroResolucion, setNroResolucion] = useState('');
  const [tipo, setTipo] = useState('');
  const [adjunto, setAdjunto] = useState('');
  const [fecha, setFecha] = useState<dayjs.Dayjs | null>(null);
  const [fechaCarga, setFechaCarga] = useState<dayjs.Dayjs | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/api/v1/resoluciones/${idResolucion}`);
        const resolucionData = response.data;
        setResolucion(resolucionData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [idResolucion]);
  
  // Manejar la actualización del estado fuera del efecto
  useEffect(() => {
    if (resolucion) {
      setNroExpediente(resolucion.nexpediente);
      setNroResolucion(resolucion.nresolucion)
      setTipo(resolucion.tipo)
      setAdjunto(resolucion.adjunto)
      const fechaDayjs = dayjs(resolucion.fecha).utc();
      setFecha(fechaDayjs);
      setEstado(String(resolucion.estado));
      setObservaciones(resolucion.observaciones);
      const fechaCargaDayjs = dayjs(resolucion.fechadecarga).utc();
      setFechaCarga(fechaCargaDayjs)
      // Otros cambios de estado según sea necesario
    }
  }, [resolucion]);


  const edicionResolucion = async () => {

        const resolucionEditada = {
      nexpediente: nroExpediente, // Puedes usar el operador de fusión nula (||) para manejar el caso en que sea nulo
      nresolucion: nroResolucion,
      tipo: tipo || "",
      adjunto: adjunto, // Puedes asignar el valor que corresponda
      observaciones: observaciones, // Puedes asignar el valor que corresponda
      fechadecarga: fechaCarga ? fechaCarga.toISOString() : null, // Convierte la fecha a formato ISO si existe
      fecha: fecha ? fecha.toISOString() : null, // Convierte la fecha a formato ISO si existe
      estado: estado, // Puedes asignar el valor que corresponde
    };


    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/api/v1/resoluciones/${idResolucion}/`, resolucionEditada, {
        headers: {
          'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
      // navigate('/dashboard/resoluciones/');
      // console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      // console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error','NO  se pudo realizar la acción.');

    }

  }

  const eliminarResolucion = async () => {


try {
  const response = await axios.delete(`http://127.0.0.1:8000/facet/api/v1/resoluciones/${idResolucion}/`,{
    headers: {
      'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
    },
  });
  handleOpenModal('Resolución Eliminada', 'La acción se realizó con éxito.');
  // navigate('/dashboard/resoluciones/');
  // console.log('Respuesta del servidor:', response.data);
} catch (error) {
  // console.error('Error al hacer la solicitud PUT:', error);
  handleOpenModal('Error','NO  se pudo realizar la acción.');

}

}

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Resoluciones
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
            <MenuItem value={"Todos"}>Todos</MenuItem>
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
          <InputLabel id="demo-simple-select-label">Estado </InputLabel>
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Fecha"
        value={fecha}
        onChange={(date) => {
          if (date) {
            const fechaSeleccionada = dayjs(date).utc();  // Usa .utc() para evitar problemas de zona horaria
            setFecha(fechaSeleccionada);
            // console.log(fechaSeleccionada); // Imprime la fecha en la consola
          }
        }}
      />
      </LocalizationProvider>
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
      <Grid>
        
      </Grid>
        <Button variant="contained" onClick={edicionResolucion}>
          Editar
        </Button>
        <Button onClick={() => setConfirmarEliminacion(true)} variant="contained" style={{ marginLeft: '8px' }} color='error'>
          Eliminar
        </Button>
        
      </Grid>

      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
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
    
        {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
        <TextField label="Estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} /> */}
        
</Paper>
</Container>
  );
};

export default EditarResolucion;