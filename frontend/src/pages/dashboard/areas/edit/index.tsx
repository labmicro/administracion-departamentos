import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { Link, useParams ,useNavigate } from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const EditarArea : React.FC = () => {

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
    navigate('/dashboard/areas/');
  };

  const { idArea } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  interface Area {
    id: number;
    departamento: number;
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

  const [area, setArea] = useState<Area | null>(null); // Mejor usar null para datos no cargados
  const [departamento, setDepartamento] = useState<Departamento | null>(null);
  const [iddepartamento, setIddepartamento] = useState<number>(0);
  const [nombre, setNombre] = useState('');
  const [nombreDepto, setNombreDepto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('');
  const [interno, setInterno] = useState('');

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/area/${idArea}/`);
        const data = response.data;
        console.log(response.data)
        setArea(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [idArea]);
  
  // Manejar la actualización del estado fuera del efecto
  useEffect(() => {
    if (area) {
      setIddepartamento(area.departamento)
      setNombre(area.nombre)
      setEstado(String(area.estado))
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/facet/departamento/${area.departamento}/`);
          const data = response.data;
          setDepartamento(data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      // Otros cambios de estado según sea necesario
    };
  }, [area]);


  const edicionArea = async () => {

        const areaEditada = {
      departamento: iddepartamento,    
      nombre: nombre,
      estado: estado, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1

    };


    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/area/${idArea}/`, areaEditada, {
        headers: {
          'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error','NO  se pudo realizar la acción.');

    }

  }

  const eliminarArea = async () => {


try {
  const response = await axios.delete(`http://127.0.0.1:8000/facet/area/${idArea}/`,{
    headers: {
      'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
    },
  });
  handleOpenModal('Area Eliminada', 'La acción se realizó con éxito.');
} catch (error) {
  // console.error('Error al hacer la solicitud PUT:', error);
  handleOpenModal('Error','NO  se pudo realizar la acción.');

}

}

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
    Areas
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
        <TextField
          value={departamento?.nombre || ''} // Proporciona un valor predeterminado
          disabled
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
      <Button variant="contained" onClick={edicionArea}>
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
          eliminarArea();
        }}
      />

        
</Paper>
</Container>
  );
};

export default EditarArea;