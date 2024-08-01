import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box, Dialog} from '@mui/material';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import { Link, useNavigate, useParams} from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearAsignaturaCarrera = () => {
  const h1Style = {
    color: 'black',
  };

  const { idCarrera } = useParams();

  const navigate = useNavigate();

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

  type TipoAsignatura = 'Electiva' | 'Obligatoria';
  type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';3

  interface Asignatura {
    id: number;
    area: number;
    departamento: number;
    codigo: string;
    nombre: string;
    modulo: string;
    programa: string;
    tipo:TipoAsignatura;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Carrera {
    id: number;
    nombre: string;
    tipo: TipoCarrera;
    planestudio: string;
    sitio: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface AsignaturaCarrera {
    id: number;
    carrera: number;
    asignatura: number;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    fechadecreacion: Date;
    fechademodificacion: Date; // Aquí indicas que 'fecha' es de tipo Date
    // Otros campos según sea necesario
  }

  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [idcarrera, setIdCarreras] = useState<number>();
  const [idarea, setIdarea] = useState<number>();
  const [idasignatura, setIdasignatura] = useState<number>();
  const [iddepartamento, setIddepartamento] = useState<number>();// Inicializado con un valor numérico, puedes usar 0 u otro valor inicial
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  console.log(idarea,iddepartamento)
  const [fecha, setFecha] = useState<dayjs.Dayjs | null>(null);;
  const fechaActual = new Date();
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('');
  const [modulo, setModulo] = useState('');
  const [programa, setPrograma] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});
  const [openAsignatura, setOpenAsignatura] = useState(false);
  const [filtroAsignaturas, setFiltroAsignaturas] = useState('');
  

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  
  const handleOpenAsignatura = () => {
    setOpenAsignatura(true);
  };

  
  const handleClose = () => {
    setOpenAsignatura(false);
  };

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
    navigate(`/dashboard/carreras/asignaturas/${idCarrera}`);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/facet/asignatura/');
        setAsignaturas(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, []);

  const handleConfirmSelection = () => {
    // Realiza la lógica necesaria con idResolucionSeleccionada
    console.log('ID de la asignatura seleccionada:', idasignatura);

    // Luego, cierra el modal
    handleClose();
  };
  
  const handleFilterAsignaturas = (filtro: string) => {
    // Lógica para filtrar las resoluciones según el término de búsqueda
    const asignaturasFiltro = asignaturas.filter((asignatura) =>
      asignatura.nombre.includes(filtro.toUpperCase())||asignatura.codigo.includes(filtro.toUpperCase())
      // (persona.legajo ?? '').includes(filtro)||
      // persona.nombre.toLowerCase().includes(filtro.toLowerCase())||
      // persona.apellido.toLowerCase().includes(filtro.toLowerCase())
    );
    return asignaturasFiltro;
  };

  const crearNuevaAsignaturaEnCarrera = async () => {
    const nuevaAsignaturaEnCarrera = {
      carrera: idCarrera,
      asignatura: idasignatura,
      estado: estado, // Estado de la asignatura en carrera
      fecha_de_creacion: fechaActual,
      fecha_de_modificacion: fechaActual,
      // fecha: fecha ? fecha.toISOString() : null, // Convierte la fecha a formato ISO si existe
    };
  
    try {
      console.log(nuevaAsignaturaEnCarrera)
      const response = await axios.post('http://127.0.0.1:8000/facet/asignatura-carrera/', nuevaAsignaturaEnCarrera, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Éxito', 'Se creó la asignatura en carrera con éxito.', handleConfirmModal);
    } catch (error) {
      console.log(error);
      handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
    }
  };
  

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Agregar Asignatura en Carrera
  </Typography>

  {/* Agrega controles de entrada y botones para los filtros */}
  <Grid container spacing={2}>
  <Grid item xs={4}>
      <Button variant="contained" onClick={handleOpenAsignatura}>
        Seleccionar Asignatura
      </Button>

      {/* Modal para seleccionar resolución */}
      <Dialog open={openAsignatura} onClose={handleClose} maxWidth="md" fullWidth >
        {/* Filtrar resoluciones */}
        <TextField
          label="Buscar Asignatura"
          value={filtroAsignaturas}
          onChange={(e) => setFiltroAsignaturas(e.target.value)}
          fullWidth
        />

        {/* Mostrar lista de resoluciones */}
        {handleFilterAsignaturas(filtroAsignaturas).map((asignatura) => (
          <div key={asignatura.id}>
            {/* Puedes agregar más detalles o botones según tus necesidades */}
            <Button
              onClick={() => {setIdasignatura(asignatura.id),setIdarea(asignatura.id),setNombre(asignatura.nombre),
              setCodigo(asignatura.codigo)}}
              style={{ backgroundColor: asignatura.id=== idasignatura ? '#4caf50' : 'inherit', color: asignatura.id === idasignatura ? 'white' : 'inherit' }}
            >
              {asignatura.codigo} - {asignatura.nombre} 
              {/* - {persona.apellido} {persona.nombre} - Legajo {persona.legajo} */}
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
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value.toUpperCase())}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          fullWidth
          disabled
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
        <Button variant="contained" onClick={crearNuevaAsignaturaEnCarrera}>
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

export default CrearAsignaturaCarrera;