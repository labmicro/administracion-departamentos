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
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import DashboardMenu from '../../../../dashboard';

const CrearDocente = () => {
  const router = useRouter();
  // Define los estados necesarios
  interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
    estado: 0 | 1;
    email: string;
    interno: string;
    legajo: string;
  }

  const [persona, setPersona] = useState<Persona>();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [apellido, SetApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [filtroPersonas, setFiltroPersonas] = useState('');
  const [openPersona, setOpenPersona] = useState(false);
  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

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

  const handleOpenPersona = () => {
    setOpenPersona(true);
  };

  const handleClose = () => {
    setOpenPersona(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePers = await axios.get('http://127.0.0.1:8000/facet/persona/');
        setPersonas(responsePers.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleConfirmSelection = () => {
    handleClose();
  };

  const handleConfirmModal = () => {
    router.push('/dashboard/persons/docentes/'); // Navega a la lista de jefes
  };

  const handleFilterPersonas = (filtro: string) => {
    return personas.filter((persona) =>
      persona.dni.includes(filtro) ||
      (persona.legajo ?? '').includes(filtro) ||
      persona.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      persona.apellido.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const crearNuevoDocenteDepartamento = async () => {
    const nuevoDocente = {
      persona: persona?.id,
      observaciones: observaciones,
      estado: estado as 0 | 1,
    };

    try {
      const existeRegistro = await axios.get(`http://127.0.0.1:8000/facet/docente/${persona?.id}/`);
      if (existeRegistro.data) {
        handleOpenModal('Error', 'Ya existe docente departamento', () => {});
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        try {
          await axios.post('http://127.0.0.1:8000/facet/docente/', nuevoDocente, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          handleOpenModal('Bien', 'Se creó el docente con éxito', handleConfirmModal);
        } catch (postError) {
          console.error(postError);
          handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
        }
      } else {
        console.error(error);
        handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
      }
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Agregar Docente
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button variant="contained" onClick={handleOpenPersona}>
              Seleccionar Persona
            </Button>

            <Dialog open={openPersona} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle>Seleccionar Persona</DialogTitle>
  <DialogContent>
    <TextField
      label="Buscar por DNI, Apellido o Legajo"
      value={filtroPersonas}
      onChange={(e) => setFiltroPersonas(e.target.value)}
      fullWidth
      margin="normal"
    />

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>DNI</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Legajo</TableCell>
            <TableCell>Seleccionar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {handleFilterPersonas(filtroPersonas).map((personafilter) => (
            <TableRow key={personafilter.id}>
              <TableCell>{personafilter.dni}</TableCell>
              <TableCell>{personafilter.apellido}</TableCell>
              <TableCell>{personafilter.nombre}</TableCell>
              <TableCell>{personafilter.legajo}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setPersona(personafilter);
                    SetApellido(personafilter.apellido);
                    SetDni(personafilter.dni);
                    setNombre(personafilter.nombre);
                  }}
                  style={{
                    backgroundColor: personafilter.id === persona?.id ? '#4caf50' : 'inherit',
                    color: personafilter.id === persona?.id ? 'white' : 'inherit',
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
    <Button
      variant="contained"
      onClick={handleConfirmSelection}
      style={{ marginTop: '10px' }}
    >
      Confirmar Selección
    </Button>
  </DialogActions>
</Dialog>
          </Grid>

          <Grid item xs={12}>
            <TextField disabled label="DNI" value={dni} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField disabled value={`${apellido} ${nombre}`} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="none">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                id="estado-select"
                value={estado}
                label="Estado"
                onChange={(e) => setEstado(Number(e.target.value))}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={crearNuevoDocenteDepartamento}>
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

export default CrearDocente;
