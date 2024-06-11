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

const EditarAsignatura : React.FC = () => {

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
    navigate('/dashboard/asignaturas/');
  };

  const { idAsignatura, idDepartamento } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  type TipoAsignatura = 'Electiva' | 'Obligatoria';

  interface Asignatura {
    idasignatura: number;
    idarea: number;
    iddepartamento: number;
    codigo: string;
    nombre: string;
    modulo: string;
    programa: string;
    tipo: TipoAsignatura;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [asignatura, setAsignatura] = useState<Asignatura>();
  const [iddepartamento, setIddepartamento] = useState<number>(0); 
  const [idarea, setIdarea] = useState<number>(0); 
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('');
  const [tipo, setTipo] = useState('');
  const [modulo, setModulo] = useState('');
  const [programa, setPrograma] = useState('');

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/api/v1/asignaturas/${idAsignatura}`);
        const data = response.data;
        setAsignatura(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [idAsignatura]);
  
  // Manejar la actualización del estado fuera del efecto
  useEffect(() => {
    if (asignatura) {
      setIdarea(asignatura.idarea)
      setIddepartamento(asignatura.iddepartamento)
      setNombre(asignatura.nombre)
      setCodigo(asignatura.codigo)
      setEstado(String(asignatura.estado))
      setTipo(String(asignatura.tipo))
      setModulo(asignatura.modulo)
      setPrograma(asignatura.programa)
      // Otros cambios de estado según sea necesario
    }
  }, [asignatura]);


  const edicionAsignatura = async () => {

        const asignaturaEditada = {
      idarea: idarea,
      iddepartamento: iddepartamento, 
      codigo: codigo,    
      nombre: nombre,
      modulo: modulo,
      programa: programa,
      tipo: tipo,
      estado: estado, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1

    };


    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/api/v1/asignaturas/${idAsignatura}/`, asignaturaEditada, {
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

  const eliminarDepartamento = async () => {


try {
  const response = await axios.delete(`http://127.0.0.1:8000/facet/api/v1/asignaturas/${idAsignatura}/`,{
    headers: {
      'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
    },
  });
  handleOpenModal('Asignatura Eliminada', 'La acción se realizó con éxito.');
} catch (error) {
  console.error('Error al hacer la solicitud PUT:', error);
  handleOpenModal('Error','NO  se pudo realizar la acción.');

}

}

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
    Departamentos
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
      <Button variant="contained" onClick={edicionAsignatura}>
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
          eliminarDepartamento();
        }}
      />

        
</Paper>
</Container>
  );
};

export default EditarAsignatura;