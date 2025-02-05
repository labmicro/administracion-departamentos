import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import dayjs from 'dayjs';  
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import DashboardMenu from '../../../..';
import withAuth from "../../../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../../../utils/config";
import API from '@/api/axiosConfig';



// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearAsignaturaCarrera = () => {
  const h1Style = {
    color: 'black',
  };

  const router = useRouter();
  const { idCarrera } = router.query; // Obtener idCarrera de la URL

  interface Area {
    id: number;
    departamento: number;
    nombre: string;
    estado: 0 | 1;
  }

  interface Departamento {
    id: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1;
    interno: string;
  }

  type TipoAsignatura = 'Electiva' | 'Obligatoria';
  type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';

  interface Asignatura {
    id: number;
    area: number;
    departamento: number;
    codigo: string;
    nombre: string;
    modulo: string;
    programa: string;
    tipo: TipoAsignatura;
    estado: 0 | 1;
  }

  interface Carrera {
    id: number;
    nombre: string;
    tipo: TipoCarrera;
    planestudio: string;
    sitio: string;
    estado: 0 | 1;
  }

  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [idasignatura, setIdasignatura] = useState<number>();
  const [iddepartamento, setIddepartamento] = useState<number>(0);
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
  const [openAsignatura, setOpenAsignatura] = useState(false);
  const [filtroAsignaturas, setFiltroAsignaturas] = useState('');

  const handleOpenAsignatura = () => {
    setOpenAsignatura(true);
  };

  const handleClose = () => {
    setOpenAsignatura(false);
  };

  const handleOpenModal = (title: string, message: string, onConfirm: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
    setFn(() => onConfirm);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const handleConfirmModal = () => {
    router.push(`/dashboard/careers/asignaturaCarrera/${idCarrera}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/facet/asignatura/`);
        setAsignaturas(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleConfirmSelection = () => {
    handleClose();
  };

  const handleFilterAsignaturas = (filtro: string) => {
    return asignaturas.filter((asignatura) =>
      asignatura.nombre.includes(filtro.toUpperCase()) || asignatura.codigo.includes(filtro.toUpperCase())
    );
  };

  const crearNuevaAsignaturaEnCarrera = async () => {
    const nuevaAsignaturaEnCarrera = {
      carrera: idCarrera,
      asignatura: idasignatura,
      estado: estado,
    };


    try {
      const response = await API.post(`/facet/asignatura-carrera/`, nuevaAsignaturaEnCarrera);
      handleOpenModal('Éxito', 'Se creó la asignatura en carrera con éxito.', handleConfirmModal);
    } catch (error) {
      handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Agregar Asignatura en Carrera
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button variant="contained" onClick={handleOpenAsignatura}>
              Seleccionar Asignatura
            </Button>
            <Dialog open={openAsignatura} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle>Seleccionar Asignatura</DialogTitle>
  <DialogContent>
    <TextField
      label="Buscar por Código o Nombre"
      value={filtroAsignaturas}
      onChange={(e) => setFiltroAsignaturas(e.target.value)}
      fullWidth
      margin="normal"
    />
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Seleccionar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {handleFilterAsignaturas(filtroAsignaturas).map((asignatura) => (
            <TableRow key={asignatura.id}>
              <TableCell>{asignatura.codigo}</TableCell>
              <TableCell>{asignatura.nombre}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIdasignatura(asignatura.id);
                    setNombre(asignatura.nombre);
                    setCodigo(asignatura.codigo);
                    setOpenAsignatura(false);
                  }}
                  style={{
                    backgroundColor: asignatura.id === idasignatura ? '#4caf50' : 'inherit',
                    color: asignatura.id === idasignatura ? 'white' : 'inherit',
                  }}
                >
                  Seleccionar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cerrar</Button>
    <Button variant="contained" onClick={handleConfirmSelection} color="primary">
      Confirmar Selección
    </Button>
  </DialogActions>
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
              label="Código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="none">
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
            <Button variant="contained" onClick={crearNuevaAsignaturaEnCarrera}>
              Crear
            </Button>
          </Grid>
        </Grid>
        <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />
      </Paper>
    </Container>
    </DashboardMenu>
  );
};

export default withAuth(CrearAsignaturaCarrera);
