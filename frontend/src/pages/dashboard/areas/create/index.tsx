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
import Swal from "sweetalert2";


// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearArea = () => {
  const h1Style = {
    color: 'black',
  };

  const navigate = useNavigate();

  interface Area {
    id: number;
    iddepartamento: number;
    nombre: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Departamento {
    id: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    interno: string;
    // Otros campos según sea necesario
  }

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [iddepartamento, setIddepartamento] = useState<number>();// Inicializado con un valor numérico, puedes usar 0 u otro valor inicial
  const [nombre, setNombre] = useState('');
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
    navigate('/dashboard/areas/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/facet/departamento/');
        setDepartamentos(response.data.results);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los datos.',
        });
      }
    };

    

    fetchData();
  }, []);


  const crearNuevoDepartamento= async () => {

    const nuevaArea= {
      departamento: iddepartamento,    
      nombre: nombre,
      estado: estado, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1

    };



    try {
      const response = await axios.post('http://127.0.0.1:8000/facet/area/', nuevaArea, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenModal('Éxito', 'Se creo el area con éxito.',handleConfirmModal);
    } catch (error) {
      handleOpenModal('Error','NO  se pudo realizar la acción.',() => {});

    }
  
    };

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Area
  </Typography>

  {/* Agrega controles de entrada y botones para los filtros */}
  <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(capitalizeFirstLetter(e.target.value))}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
            <FormControl fullWidth margin="none">
        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={iddepartamento || ''}
          onChange={(e) => {
            const selectedId = e.target.value as number;
            setIddepartamento(selectedId);
          }}
        >
          {departamentos.map(departamentos => (
            <MenuItem key={departamentos.id} value={departamentos.id}>
              {departamentos.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
        <Button variant="contained" onClick={crearNuevoDepartamento}>
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

export default CrearArea;