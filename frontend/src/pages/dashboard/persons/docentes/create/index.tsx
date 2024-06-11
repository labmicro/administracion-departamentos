import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import { Link, useNavigate} from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearDocente = () => {
  const h1Style = {
    color: 'black',
  };

  const navigate = useNavigate();

  
  interface Persona {
    idpersona: number;
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

  interface Docente {
    idpersona: number;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }


  const [idPersona, setIdPersona] = useState<number>(0); 
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [apellido, SetApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [filtroPersonas, setFiltroPersonas] = useState('');
  const [openPersona, setOpenPersona] = useState(false);
  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
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
    navigate('/dashboard/personas/docentes/');
  };

  const handleOpenPersona = () => {
    setOpenPersona(true);
  };

  const handleClose = () => {
    setOpenPersona(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePers = await axios.get('http://127.0.0.1:8000/facet/api/v1/personas/');
        setPersonas(responsePers.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, []);

  const handleConfirmSelection = () => {
    // Realiza la lógica necesaria con idResolucionSeleccionada
    console.log('ID de la persona seleccionada:', idPersona);

    // Luego, cierra el modal
    handleClose();
  };


  const handleFilterPersonas = (filtro: string) => {
    // Lógica para filtrar las resoluciones según el término de búsqueda
    const personasFiltro = personas.filter((persona) =>
      persona.dni.includes(filtro)||
      (persona.legajo ?? '').includes(filtro)||
      persona.nombre.toLowerCase().includes(filtro.toLowerCase())||
      persona.apellido.toLowerCase().includes(filtro.toLowerCase())
    );
    return personasFiltro;
  };

  const crearNuevoDocente= async () => {


    const nuevoDocente= {
      idpersona: idPersona,
      observaciones: observaciones,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };


    try {
      // Verificar si ya existe un registro con el mismo iddepartamento
      const existeRegistro = await axios.get(`http://127.0.0.1:8000/facet/api/v1/docentes/${idPersona}`);
      console.log(existeRegistro);
      if (existeRegistro.data) {
        // No hay registros existentes, puedes proceder con la creación
        handleOpenModal('Error', 'Ya existe Docente', () => {});
      }
    
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        // Maneja el error 404 sin detener el flujo principal
        const response = await axios.post('http://127.0.0.1:8000/facet/api/v1/docentes/', nuevoDocente, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        handleOpenModal('Bien', 'Se creó el Docente con éxito', handleConfirmModal);
      } else {
        // Maneja otros errores
        console.error(error);
        handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
      }
    }
    
  
    };

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Agregar Docente 
  </Typography>


  {/* Agrega controles de entrada y botones para los filtros */}
  <Grid container spacing={2}>

      <Grid item xs={4}>
      <Button variant="contained" onClick={handleOpenPersona}>
        Seleccionar Persona
      </Button>

      {/* Modal para seleccionar resolución */}
      <Dialog open={openPersona} onClose={handleClose} maxWidth="md" fullWidth >
        {/* Filtrar resoluciones */}
        <TextField
          label="Buscar por DNI , Apellido o Legajo"
          value={filtroPersonas}
          onChange={(e) => setFiltroPersonas(e.target.value)}
          fullWidth
        />

        {/* Mostrar lista de resoluciones */}
        {handleFilterPersonas(filtroPersonas).map((persona) => (
          <div key={persona.idpersona}>
            {/* Puedes agregar más detalles o botones según tus necesidades */}
            <Button
              onClick={() => {setIdPersona(persona.idpersona);SetApellido(persona.apellido);SetDni(persona.dni),setNombre(persona.nombre)}}
              style={{ backgroundColor: persona.idpersona=== idPersona ? '#4caf50' : 'inherit', color: persona.idpersona === idPersona ? 'white' : 'inherit' }}
            >
              DNI {persona.dni} - {persona.apellido} {persona.nombre} - Legajo {persona.legajo}
            </Button>
          </div>
        ))}

        {/* Botón de confirmación para cerrar el modal y realizar la acción */}
        <Button variant="contained" onClick={handleConfirmSelection}
            style={{
              marginTop: 'auto',
              marginBottom: '10px',
              position: 'sticky',
              bottom: 0,
              // backgroundColor: , // Ajusta el fondo según tus necesidades
            }}>
          Confirmar Selección
        </Button>
      </Dialog>
      </Grid>      
    
      <Grid item xs={12}>
        <TextField
          disabled
          label="DNI"
          value={dni}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled
          value={`${apellido} ${nombre}`}
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
        <Button variant="contained" onClick={crearNuevoDocente}>
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

export default CrearDocente;