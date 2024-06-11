import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import Dialog from '@mui/material/Dialog';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { Link, useParams ,useNavigate } from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const EditarDocente : React.FC = () => {

  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState(''); // Nuevo estado para el título del modal
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [fn, setFn] = useState(() => () => {});

  
  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title); // Establecer el título del modal
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    navigate('/dashboard/personas/docentes/');
  };

  const { idPersona } = useParams();
  console.log(idPersona)

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  interface Docente {
    idpersona: number;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [docente, setDocente] = useState<Docente>();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('');

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/api/v1/docentes/${idPersona}`);
        const responsePers = await axios.get(`http://127.0.0.1:8000/facet/api/v1/personas/${idPersona}`);
        setNombre(responsePers.data.nombre);
        setApellido(responsePers.data.apellido);
        SetDni(responsePers.data.dni)  
        setDocente(response.data)


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [idPersona]);
  
  // Manejar la actualización del estado fuera del efecto
  useEffect(() => {
    if (docente) {
      setEstado(String(docente.estado))
      setObservaciones(docente.observaciones)
    
  }}, [docente]);




  const edicionDocente = async () => {

    const docenteEditado= {
      idpersona: idPersona,
      observaciones: observaciones,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };


    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/api/v1/docentes/${idPersona}/`, docenteEditado, {
        headers: {
          'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      // console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error','NO  se pudo realizar la acción.');

    }

  }

  const eliminarDocente = async () => {


try {
  const response = await axios.delete(`http://127.0.0.1:8000/facet/api/v1/docentes/${idPersona}/`,{
    headers: {
      'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
    },
  });
  handleOpenModal('Docente Eliminado', 'La acción se realizó con éxito.');
} catch (error) {
  // console.error('Error al hacer la solicitud PUT:', error);
  handleOpenModal('Error','NO  se pudo realizar la acción.');

}

}

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Editar Docente 
  </Typography>


  {/* Agrega controles de entrada y botones para los filtros */}
  <Grid container spacing={2}>

      {/* Seleccionar resolucion */}
      
      
      

      <Grid item xs={12}>
        <TextField
          disabled
          // label="Apellido y Nombre"
          value={`${apellido} ${nombre}`}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="DNI"
          value={dni}
          disabled
          fullWidth
        />
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
        <Button variant="contained" onClick={edicionDocente}>
          Editar
        </Button>
        <Button onClick={() => setConfirmarEliminacion(true)} variant="contained" style={{ marginLeft: '8px' }} color='error'>
          Eliminar
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>
    <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />
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
  );
};

export default EditarDocente;