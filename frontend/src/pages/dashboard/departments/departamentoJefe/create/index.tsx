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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import DashboardMenu from '../../../../dashboard';

dayjs.extend(utc);
dayjs.extend(timezone);

const CrearDepartamentoJefe = () => {
  const router = useRouter();

  interface Resolucion {
    id: number;
    nexpediente: string;
    nresolucion: string;
    tipo: string;
    fecha: string;
    observaciones: string;
  }

  interface Jefe {
    id: number;
    persona: Persona;
    observaciones: string;
    estado: 0 | 1;
  }

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

  interface Departamento {
    id: number;
    nombre: string;
  }

  const [fechaInicio, setFechaInicio] = useState<dayjs.Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<dayjs.Dayjs | null>(null);
  const [resolucion, setResolucion] = useState<Resolucion | null>(null);
  const [jefe, setJefe] = useState<Jefe | null>(null);
  const [departamento, setDepartamento] = useState<Departamento | null>(null);

  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [jefes, setJefes] = useState<Jefe[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const [filtroResolucion, setFiltroResolucion] = useState('');
  const [filtroJefe, setFiltroJefe] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('');

  const [openResolucion, setOpenResolucion] = useState(false);
  const [openJefe, setOpenJefe] = useState(false);
  const [openDepartamento, setOpenDepartamento] = useState(false);

  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('');
  
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

  const handleConfirmModal = () => {
    router.push('/dashboard/departments/departamentoJefe/');
  };

  // Fetch data functions for each modal
  const fetchResoluciones = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/facet/resolucion/');
      const resolucionesData = response.data.results.map((res: Resolucion) => ({
        ...res,
        fecha: dayjs(res.fecha, "DD/MM/YYYY HH:mm:ss").isValid()
          ? dayjs(res.fecha, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY")
          : 'Fecha no disponible',
      }));
      setResoluciones(resolucionesData);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener las resoluciones.',
      });
    }
  };

  const fetchJefes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/facet/jefe/list_jefes_persona/');
      setJefes(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener los jefes.',
      });
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/facet/departamento/');
      setDepartamentos(response.data.results);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener los departamentos.',
      });
    }
  };

  // Fetch data when opening modals
  useEffect(() => {
    if (openResolucion) fetchResoluciones();
    if (openJefe) fetchJefes();
    if (openDepartamento) fetchDepartamentos();
  }, [openResolucion, openJefe, openDepartamento]);

  const crearNuevoJefeDepartamento = async () => {
    const nuevoJefeDepartamento = {
      departamento: departamento?.id,
      jefe: jefe?.id,
      resolucion: resolucion?.id,
      fecha_de_inicio: fechaInicio?.toISOString(),
      fecha_de_fin: fechaFin?.toISOString(),
      observaciones: observaciones,
      estado: estado === '1' ? 1 : 0,
    };

    try {
      await axios.post('http://127.0.0.1:8000/facet/jefe-departamento/', nuevoJefeDepartamento, {
        headers: { 'Content-Type': 'application/json' },
      });
      handleOpenModal('Bien', 'Se creó el jefe de departamento con éxito', handleConfirmModal);
    } catch (error) {
      console.error(error);
      handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
    }
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Agregar Jefe Departamento
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="contained" onClick={() => setOpenResolucion(true)}>
                Seleccionar Resolución
              </Button>
              <Dialog open={openResolucion} onClose={() => setOpenResolucion(false)} maxWidth="md" fullWidth>
                <DialogTitle>Seleccionar Resolución</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Filtrar por Nro Resolución o Expediente"
                    value={filtroResolucion}
                    onChange={(e) => setFiltroResolucion(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nro Expediente</TableCell>
                          <TableCell>Nro Resolución</TableCell>
                          <TableCell>Tipo</TableCell>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Seleccionar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {resoluciones
                          .filter((res) =>
                            res.nresolucion.includes(filtroResolucion) || res.nexpediente.includes(filtroResolucion)
                          )
                          .map((res) => (
                            <TableRow key={res.id}>
                              <TableCell>{res.nexpediente}</TableCell>
                              <TableCell>{res.nresolucion}</TableCell>
                              <TableCell>{res.tipo}</TableCell>
                              <TableCell>{res.fecha}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setResolucion(res);
                                    setOpenResolucion(false);
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
                  <Button onClick={() => setOpenResolucion(false)}>Cerrar</Button>
                </DialogActions>
              </Dialog>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={() => setOpenJefe(true)}>
                Seleccionar Jefe
              </Button>
              <Dialog open={openJefe} onClose={() => setOpenJefe(false)} maxWidth="md" fullWidth>
                <DialogTitle>Seleccionar Jefe</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Filtrar por Nombre o DNI"
                    value={filtroJefe}
                    onChange={(e) => setFiltroJefe(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Apellido</TableCell>
                          <TableCell>DNI</TableCell>
                          <TableCell>Seleccionar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
  {jefes
    .filter((j) =>
      (j.persona.nombre && j.persona.nombre.includes(filtroJefe)) ||
      (j.persona.dni && j.persona.dni.includes(filtroJefe))
    )
    .map((j) => (
      <TableRow key={j.id}>
        <TableCell>{j.persona.nombre}</TableCell>
        <TableCell>{j.persona.apellido}</TableCell>
        <TableCell>{j.persona.dni}</TableCell>
        <TableCell>
          <Button
            variant="outlined"
            onClick={() => {
              setJefe(j);
              setOpenJefe(false);
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
                  <Button onClick={() => setOpenJefe(false)}>Cerrar</Button>
                </DialogActions>
              </Dialog>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={() => setOpenDepartamento(true)}>
                Seleccionar Departamento
              </Button>
              <Dialog open={openDepartamento} onClose={() => setOpenDepartamento(false)} maxWidth="md" fullWidth>
                <DialogTitle>Seleccionar Departamento</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Filtrar por Nombre"
                    value={filtroDepartamento}
                    onChange={(e) => setFiltroDepartamento(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Seleccionar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {departamentos
                          .filter((d) => d.nombre.includes(filtroDepartamento))
                          .map((d) => (
                            <TableRow key={d.id}>
                              <TableCell>{d.nombre}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setDepartamento(d);
                                    setOpenDepartamento(false);
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
                  <Button onClick={() => setOpenDepartamento(false)}>Cerrar</Button>
                </DialogActions>
              </Dialog>
            </Grid>

            {resolucion && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Nro Resolución"
                    value={resolucion.nresolucion}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Nro Expediente"
                    value={resolucion.nexpediente}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </>
            )}

            {jefe && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre Jefe"
                    value={`${jefe.persona.nombre} ${jefe.persona.apellido}`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </>
            )}

            {departamento && (
              <Grid item xs={12}>
                <TextField
                  label="Nombre Departamento"
                  value={departamento.nombre}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="none">
                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={estado}
                  label="Estado"
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <MenuItem value="1">Activo</MenuItem>
                  <MenuItem value="0">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} marginBottom={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de Inicio"
                  value={fechaInicio}
                  onChange={(date) => setFechaInicio(date)}
                />
                <DatePicker
                  label="Fecha de Fin"
                  value={fechaFin}
                  onChange={(date) => setFechaFin(date)}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} marginBottom={2}>
              <Button variant="contained" onClick={crearNuevoJefeDepartamento}>
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

export default CrearDepartamentoJefe;
