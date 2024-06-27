import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import { Link, useNavigate} from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearCarrera = () => {
  const h1Style = {
    color: 'black',
  };

  const navigate = useNavigate();


  type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';


  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [planEstudio, setPlanEstudio] = useState('');
  const [sitio, setsitio] = useState('');
  const [estado, setEstado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});
  

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  

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
    navigate('/dashboard/carreras/');
  };



  const crearNuevaCarrera= async () => {


    let nuevaCarrera= {
      nombre: nombre,
      tipo:tipo,
      planestudio: planEstudio,
      sitio: sitio,
      estado: 0 | 1,
    };



    try {
      const response = await axios.post('http://127.0.0.1:8000/facet/carrera/', nuevaCarrera, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenModal('Éxito', 'Se creo la carrera con éxito.',handleConfirmModal);
    } catch (error) {
      console.log(error)
      handleOpenModal('Error','NO  se pudo realizar la acción.',() => {});

    }
  
    };

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Asignatura
  </Typography>

  {/* Agrega controles de entrada y botones para los filtros */}
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
        <Button variant="contained" onClick={crearNuevaCarrera}>
          Crear
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>
    <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />

</Paper>
</Container>
  );
};

export default CrearCarrera;