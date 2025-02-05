import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import dayjs from 'dayjs';  
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import DashboardMenu from '../../../../dashboard';
import withAuth from "../../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../../utils/config";
import API from '@/api/axiosConfig';



// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const EditarAsignaturaCarrera: React.FC = () => {
  const router = useRouter();
  const { idAsignatura } = router.query; // Obtener idAsignatura de la URL

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
    router.push('/dashboard/asignaturas/'); // Navega a la página de asignaturas
  };

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
    estado: 0 | 1;
  }

  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
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
      if (!idAsignatura) return; // Asegúrate de que idAsignatura esté disponible
      try {
        const response = await axios.get(`${API_BASE_URL}/facet/asignatura/${idAsignatura}`);
        const data = response.data;
        setAsignatura(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idAsignatura]);

  useEffect(() => {
    if (asignatura) {
      setIdarea(asignatura.idarea);
      setIddepartamento(asignatura.iddepartamento);
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
      idarea: idarea,
      iddepartamento: iddepartamento,
      codigo: codigo,
      nombre: nombre,
      modulo: modulo,
      programa: programa,
      tipo: tipo,
      estado: estado,
    };

    try {
      await API.put(`/facet/asignatura/${idAsignatura}/`, asignaturaEditada);
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  const eliminarAsignatura = async () => {
    try {
      await API.delete(`/facet/asignatura/${idAsignatura}/`);
      handleOpenModal('Asignatura Eliminada', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud DELETE:', error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Editar Asignatura
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
              label="Código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Módulo"
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
            <FormControl fullWidth>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                id="estado-select"
                value={estado}
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
            <Button
              onClick={() => setConfirmarEliminacion(true)}
              variant="contained"
              style={{ marginLeft: '8px' }}
              color='error'
            >
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

export default withAuth(EditarAsignaturaCarrera);
