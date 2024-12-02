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
import { useRouter } from 'next/router'; 
import DashboardMenu from '../../../../dashboard';
import withAuth from "../../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../../utils/config";


const CrearNoDocente = () => {
  const router = useRouter();

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
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
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
        const responsePers = await axios.get(`${API_BASE_URL}/facet/persona/`);
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
    router.push('/dashboard/persons/noDocentes/');
  };

  const handleFilterPersonas = (filtro: string) => {
    return personas.filter((persona) =>
      persona.dni.includes(filtro) ||
      (persona.legajo ?? '').includes(filtro) ||
      persona.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      persona.apellido.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const crearNuevoNoDocenteDepartamento = async () => {
    const nuevoNoDocente = {
      persona: persona?.id,
      observaciones: observaciones,
      estado: estado as 0 | 1,
    };

    try {
      const existeRegistro = await axios.get(`${API_BASE_URL}/facet/nodocente/${persona?.id}/`);
      if (existeRegistro.data) {
        handleOpenModal('Error', 'Ya existe no docente para esta persona', () => {});
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        try {
          await axios.post(`${API_BASE_URL}/facet/nodocente/`, nuevoNoDocente, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          handleOpenModal('Bien', 'Se creó el no docente con éxito', handleConfirmModal);
        } catch (postError) {
          console.error(postError);
          handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
        }
      } else {
        console.error(error);
        handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
      }
    }
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Agregar No Docente
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
                                  setApellido(personafilter.apellido);
                                  setDni(personafilter.dni);
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
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} marginBottom={2}>
              <Button variant="contained" onClick={crearNuevoNoDocenteDepartamento}>
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

export default withAuth(CrearNoDocente);
