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

const EditarPersona : React.FC = () => {

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
    navigate('/dashboard/personas/');
  };

  const { idPersona } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    email: string;
    interno: string;
    legajo: string;
    // Otros campos según sea necesario
  }

  const [persona, setPersona] = useState<Persona>();
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [legajo, setLegajo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [interno, setInterno] = useState('');
  const [estado, setEstado] = useState('');

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/persona/${idPersona}/`);
        const personaData = response.data;
        setPersona(personaData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [idPersona]);
  
  // Manejar la actualización del estado fuera del efecto
  useEffect(() => {
    if (persona) {
      setDni(persona.dni);
      setNombre(persona.nombre)
      setApellido(persona.apellido)
      setLegajo(persona.legajo)
      setTelefono(persona.telefono)
      setEmail(persona.email)
      setInterno(persona.interno)
      setEstado(String(persona.estado))
      // Otros cambios de estado según sea necesario
    }
  }, [persona]);


  const edicionPersona = async () => {

        const personaEditada = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      dni: dni,
      estado: estado,
      email: email,
      interno: interno,
      legajo: legajo,
    };


    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/persona/${idPersona}/`, personaEditada, {
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

  const eliminarPersona = async () => {


try {
  const response = await axios.delete(`http://127.0.0.1:8000/facet/persona/${idPersona}/`,{
    headers: {
      'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
    },
  });
  handleOpenModal('Persona Eliminada', 'La acción se realizó con éxito.');
} catch (error) {
  // console.error('Error al hacer la solicitud PUT:', error);
  handleOpenModal('Error','NO  se pudo realizar la acción.');

}

}

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
    Personas
  </Typography>

  {/* Agrega controles de entrada y botones para los filtros */}
  <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Nombres"
          value={nombre}
          onChange={(e) => setNombre(capitalizeFirstLetter(e.target.value))}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(capitalizeFirstLetter(e.target.value))}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
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
      <Grid item xs={12}>
        <TextField
          label="Email"
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Interno"
          value={interno || ''}
          onChange={(e) => setInterno(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Legajo"
          value={legajo || ''}
          onChange={(e) => setLegajo(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} marginBottom={2}>
      <Button variant="contained" onClick={edicionPersona}>
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
          eliminarPersona();
        }}
      />

        
</Paper>
</Container>
  );
};

export default EditarPersona;