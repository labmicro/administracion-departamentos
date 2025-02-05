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
import API from '@/api/axiosConfig';

const CrearDocente = () => {
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

  const [persona, setPersona] = useState<Persona | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [apellido, SetApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroLegajo, setFiltroLegajo] = useState('');
  const [openPersona, setOpenPersona] = useState(false);
  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    fetchPersonas(`${API_BASE_URL}/facet/persona/`);
  };

  const handleClose = () => {
    setOpenPersona(false);
  };

  const fetchPersonas = async (url: string) => {
    try {
      const response = await axios.get(url);
      setPersonas(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
    } catch (error) {
      console.error('Error fetching paginated data:', error);
    }
  };

  const filtrarPersonas = () => {
    let url = `${API_BASE_URL}/facet/persona/?`;
    const params = new URLSearchParams();

    if (filtroNombre.trim()) params.append('nombre__icontains', filtroNombre);
    if (filtroApellido.trim()) params.append('apellido__icontains', filtroApellido);
    if (filtroDni.trim()) params.append('dni__icontains', filtroDni);
    if (filtroLegajo.trim()) params.append('legajo__icontains', filtroLegajo);

    url += params.toString();
    fetchPersonas(url);
  };

  const crearNuevoDocenteDepartamento = async () => {
  const nuevoDocente = {
    persona: persona?.id,
    observaciones,
    estado,
  };

  try {
    // Busca si ya existe un docente asociado a esta persona
    const response = await axios.get(`${API_BASE_URL}/facet/docente/`, {
      params: {
        persona: persona?.id, // Filtrar por ID de la persona
      },
    });

    // Si hay resultados, significa que ya existe un docente
    if (response.data.results.length > 0) {
      handleOpenModal('Error', 'Ya existe un docente para esta persona', () => {});
      return; // Detenemos la ejecución
    }

    // Si no existe, procedemos a crearlo
    await API.post(`/facet/docente/`, nuevoDocente);

    handleOpenModal('Bien', 'Se creó el docente con éxito', () => {
      router.push('/dashboard/persons/docentes/');
    });
  } catch (error) {
    console.error('Error:', error);
    handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
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
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <TextField
                        label="Nombre"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Apellido"
                        value={filtroApellido}
                        onChange={(e) => setFiltroApellido(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="DNI"
                        value={filtroDni}
                        onChange={(e) => setFiltroDni(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Legajo"
                        value={filtroLegajo}
                        onChange={(e) => setFiltroLegajo(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="contained" onClick={filtrarPersonas}>
                        Filtrar
                      </Button>
                    </Grid>
                  </Grid>

                  <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
                        {personas.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>{p.dni}</TableCell>
                            <TableCell>{p.apellido}</TableCell>
                            <TableCell>{p.nombre}</TableCell>
                            <TableCell>{p.legajo}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setPersona(p);
                                  SetApellido(p.apellido);
                                  SetDni(p.dni);
                                  setNombre(p.nombre);
                                }}
                                style={{
                                  backgroundColor: persona?.id === p.id ? '#4caf50' : 'inherit',
                                  color: persona?.id === p.id ? 'white' : 'inherit',
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
                  <Button
                    variant="contained"
                    disabled={!prevUrl}
                    onClick={() => prevUrl && fetchPersonas(prevUrl)}
                  >
                    Anterior
                  </Button>
                  <Typography style={{ padding: '0 10px' }}>
                    Página {currentPage} de {Math.ceil(totalItems / 10)}
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={!nextUrl}
                    onClick={() => nextUrl && fetchPersonas(nextUrl)}
                  >
                    Siguiente
                  </Button>
                  <Button onClick={handleClose}>Cerrar</Button>
                  <Button
                    variant="contained"
                    onClick={() => handleClose()}
                    disabled={!persona}
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
              <TextField
                label="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado-select"
                  value={estado}
                  onChange={(e) => setEstado(Number(e.target.value))}
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
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

export default withAuth(CrearDocente);
