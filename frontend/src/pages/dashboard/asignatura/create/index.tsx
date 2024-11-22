import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import dayjs from 'dayjs';  
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import DashboardMenu from '../../../dashboard';
import withAuth from "../../../../components/withAut"; // Importa el HOC


dayjs.extend(utc);
dayjs.extend(timezone);

const CrearAsignatura = () => {
  const router = useRouter();

  interface Area {
    id: number;
    departamento: number;
    nombre: string;
    estado: 0 | 1;
  }

  interface Departamento {
    id: number;
    nombre: string;
    estado: 0 | 1;
  }

  type TipoAsignatura = 'Electiva' | 'Obligatoria';

  const [areas, setAreas] = useState<Area[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]); // Definimos departamentos correctamente
  const [filtroAreas, setFiltroAreas] = useState('');
  const [openAreaModal, setOpenAreaModal] = useState(false);
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
    router.push('/dashboard/asignatura/');
  };

  const handleOpenAreaModal = () => {
    setOpenAreaModal(true);
  };

  const handleCloseAreaModal = () => {
    setOpenAreaModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDepartamentos = await axios.get('http://127.0.0.1:8000/facet/departamento/');
        setDepartamentos(responseDepartamentos.data.results); // Guardamos los departamentos en el estado
        const responseareas = await axios.get('http://127.0.0.1:8000/facet/area/');
        setAreas(responseareas.data.results);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los datos.',
        });
      }
    };

    fetchData();
  }, []);

  const handleFilterAreas = (filtro: string) => {
    return areas.filter((area) =>
      area.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const crearNuevaAsignatura = async () => {
    if (!areaSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe seleccionar un área.',
      });
      return;
    }

    const nuevaAsignatura = {
      area: areaSeleccionada.id,
      departamento: areaSeleccionada.departamento,
      codigo: codigo,
      nombre: nombre,
      modulo: modulo,
      programa: programa,
      tipo: tipo,
      estado: estado,
    };

    try {
      await axios.post('http://127.0.0.1:8000/facet/asignatura/', nuevaAsignatura, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenModal('Éxito', 'Se creó la asignatura con éxito.', handleConfirmModal);
    } catch (error) {
      handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
    }
  };

  const confirmarSeleccionArea = () => {
    handleCloseAreaModal();
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Asignatura
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button variant="contained" onClick={handleOpenAreaModal}>
                Seleccionar Área
              </Button>

              <Dialog open={openAreaModal} onClose={handleCloseAreaModal} maxWidth="md" fullWidth>
                <DialogTitle>Seleccionar Área</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Buscar por Nombre"
                    value={filtroAreas}
                    onChange={(e) => setFiltroAreas(e.target.value)}
                    fullWidth
                    margin="normal"
                  />

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Departamento</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Seleccionar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {handleFilterAreas(filtroAreas).map((area) => (
                          <TableRow key={area.id}>
                            <TableCell>{area.nombre}</TableCell>
                            <TableCell>{departamentos.find(dep => dep.id === area.departamento)?.nombre}</TableCell>
                            <TableCell>{area.estado === 1 ? 'Activo' : 'Inactivo'}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                onClick={() => setAreaSeleccionada(area)}
                                style={{
                                  backgroundColor:
                                    areaSeleccionada?.id === area.id ? '#4caf50' : 'inherit',
                                  color: areaSeleccionada?.id === area.id ? 'white' : 'inherit',
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
                  <Button onClick={handleCloseAreaModal}>Cerrar</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={confirmarSeleccionArea}
                    disabled={!areaSeleccionada}
                  >
                    Confirmar Selección
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

            <Grid item xs={12}>
              <TextField disabled label="Área Seleccionada" value={areaSeleccionada?.nombre || ''} fullWidth />
            </Grid>
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
              <FormControl fullWidth margin="none">
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado-select"
                  value={estado}
                  label="Estado"
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
          </Grid>
          <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />
        </Paper>
      </Container>
    </DashboardMenu>
  );
};

export default withAuth(CrearAsignatura);
