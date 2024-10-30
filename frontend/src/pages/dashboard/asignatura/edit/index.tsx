import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Typography, Paper, TextField, Button, InputLabel, Select, MenuItem, FormControl, Grid } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useParams } from 'next/navigation'; // Cambiado para Next.js
import { useRouter } from 'next/router'; // Importa useRouter
import Swal from "sweetalert2";
import DashboardMenu from '../../../dashboard';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Define la interfaz para los parámetros de la URL
interface Params {
  idAsignatura: string; // Cambiado a string porque viene como cadena
  [key: string]: string; // Esto permite que se añadan otros parámetros si es necesario
}

// Define el tipo de asignatura
type TipoAsignatura = 'Electiva' | 'Obligatoria';

const EditarAsignatura: React.FC = () => {
  const router = useRouter(); // Inicializa useRouter de Next.js
  const { idAsignatura } = useParams<Params>() || { idAsignatura: '' }; // Proporciona un valor por defecto

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    router.push('/dashboard/asignaturas/');
  };

  const [asignatura, setAsignatura] = useState<any>();
  const [iddepartamento, setIddepartamento] = useState<number>(0); 
  const [idarea, setIdarea] = useState<number>(0); 
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('');
  const [tipo, setTipo] = useState('');
  const [modulo, setModulo] = useState('');
  const [programa, setPrograma] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/asignatura/${idAsignatura}/`);
        const data = response.data;
        setAsignatura(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    if (idAsignatura) {
      fetchData();
    }
  }, [idAsignatura]);
  
  useEffect(() => {
    if (asignatura) {
      setIdarea(asignatura.area);
      setIddepartamento(asignatura.departamento);
      setNombre(asignatura.nombre);
      setCodigo(asignatura.codigo);
      setEstado(String(asignatura.estado));
      setTipo(String(asignatura.tipo));
      setModulo(asignatura.modulo);
      setPrograma(asignatura.programa);
    }
  }, [asignatura]);

  const edicionAsignatura = async () => {
    const asignaturaEditada = {
      area: idarea,
      departamento: iddepartamento, 
      codigo: codigo,    
      nombre: nombre,
      modulo: modulo,
      programa: programa,
      tipo: tipo,
      estado: estado,
    };

    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/asignatura/${idAsignatura}/`, asignaturaEditada, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error','NO se pudo realizar la acción.');
    }
  }

  const eliminarAsignatura = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/facet/asignatura/${idAsignatura}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Asignatura Eliminada', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error','NO se pudo realizar la acción.');
    }
  }

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Asignatura
        </Typography>

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
        </Grid>
        <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} />
        <ModalConfirmacion
          open={confirmarEliminacion}
          onClose={() => setConfirmarEliminacion(false)}
          onConfirm={() => {
            setConfirmarEliminacion(false);
            eliminarAsignatura();
          }}
        />
      </Paper>
    </Container>
    </DashboardMenu>
  );
};

export default EditarAsignatura;
