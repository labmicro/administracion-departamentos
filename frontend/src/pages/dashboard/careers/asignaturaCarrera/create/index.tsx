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
  Dialog,
} from '@mui/material';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import dayjs from 'dayjs';  
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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
    router.push(`/dashboard/carreras/asignaturas/${idCarrera}`);
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
    console.log('ID de la asignatura seleccionada:', idasignatura);
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

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button variant="contained" onClick={handleOpenAsignatura}>
              Seleccionar Asignatura
            </Button>
            <Dialog open={openAsignatura} onClose={handleClose} maxWidth="md" fullWidth>
              <TextField
                label="Buscar Asignatura"
                value={filtroAsignaturas}
                onChange={(e) => setFiltroAsignaturas(e.target.value)}
                fullWidth
              />
              {handleFilterAsignaturas(filtroAsignaturas).map((asignatura) => (
                <div key={asignatura.id}>
                  <Button
                    onClick={() => {
                      setIdasignatura(asignatura.id);
                      setNombre(asignatura.nombre);
                      setCodigo(asignatura.codigo);
                    }}
                    style={{
                      backgroundColor: asignatura.id === idasignatura ? '#4caf50' : 'inherit',
                      color: asignatura.id === idasignatura ? 'white' : 'inherit',
                    }}
                  >
                    {asignatura.codigo} - {asignatura.nombre}
                  </Button>
                </div>
              ))}
              <Button variant="contained" onClick={handleConfirmSelection} style={{ marginTop: 'auto', marginBottom: '10px', position: 'sticky', bottom: 0 }}>
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
  );
};

export default CrearAsignaturaCarrera;
