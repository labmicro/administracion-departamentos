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

const CrearAsignatura = () => {
  const h1Style = {
    color: 'black',
  };

  const navigate = useNavigate();

  interface Area {
    idarea: number;
    iddepartamento: number;
    nombre: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Departamento {
    iddepartamento: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    interno: string;
    // Otros campos según sea necesario
  }

  type TipoAsignatura = 'Electiva' | 'Obligatoria';

  interface Asignatura {
    idasignatura: number;
    idarea: number;
    iddepartamento: number;
    codigo: string;
    nombre: string;
    modulo: string;
    programa: string;
    tipo:TipoAsignatura;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [areas, setAreas] = useState<Area[]>([]);
  const [idarea, setIdarea] = useState<number>();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [iddepartamento, setIddepartamento] = useState<number>();// Inicializado con un valor numérico, puedes usar 0 u otro valor inicial
  console.log(idarea,iddepartamento)
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('');
  const [tipo, setTipo] = useState('');
  const [modulo, setModulo] = useState('');
  const [programa, setPrograma] = useState('');
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
    navigate('/dashboard/asignaturas/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/facet/api/v1/departamentos/');
        setDepartamentos(response.data);
        const responseareas = await axios.get('http://127.0.0.1:8000/facet/api/v1/areas/');
        setAreas(responseareas.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, []);


  const crearNuevaAsignatura= async () => {


    const nuevaAsignatura= {
      idarea: idarea,
      iddepartamento: iddepartamento, 
      codigo: codigo,
      nombre: nombre,
      modulo: modulo,
      programa: programa,
      tipo: tipo,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };


    try {
      const response = await axios.post('http://127.0.0.1:8000/facet/api/v1/asignaturas/', nuevaAsignatura, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenModal('Éxito', 'Se creo la asignatura con éxito.',handleConfirmModal);
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
          onChange={(e) => setNombre(e.target.value.toUpperCase())}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Modulo"
          value={modulo}
          onChange={(e) => setModulo(e.target.value.toUpperCase())}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
            <FormControl fullWidth margin="none">
        <InputLabel id="demo-simple-select-label">Area</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={idarea || ''}
          onChange={(e) => {
            const selectedId = e.target.value as number;
            const selectedArea = areas.find(area => area.idarea === selectedId);
            setIdarea(selectedArea?.idarea);
            setIddepartamento(selectedArea?.iddepartamento);
          }}
          >
          {areas.map((area) => (
            <MenuItem key={area.idarea} value={area.idarea}>
              {area.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        </Grid>
        <Grid item xs={12}>
        <TextField
          label="Link Programa Adjunto"
          value={programa}
          onChange={(e) => setPrograma(e.target.value)}
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
            onChange={(e) => setTipo(e.target.value as TipoAsignatura)}
          >
            <MenuItem value="Electiva">Electiva</MenuItem>
            <MenuItem value="Obligatoria">Obligatoria</MenuItem>
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
        <Button variant="contained" onClick={crearNuevaAsignatura}>
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

export default CrearAsignatura;