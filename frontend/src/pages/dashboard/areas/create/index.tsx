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
import BasicModal from '@/utils/modal';
import { useRouter } from 'next/router';
import DashboardMenu from '../../../dashboard';
import Swal from 'sweetalert2';
import withAuth from "../../../../components/withAut"; // Importa el HOC
import { API_BASE_URL } from "../../../../utils/config";


const CrearArea = () => {
  const router = useRouter();

  interface Departamento {
    id: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1;
    interno: string;
  }

  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<Departamento | null>(null);
  const [openDepartamentoModal, setOpenDepartamentoModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [filtroDepartamentos, setFiltroDepartamentos] = useState('');

  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(`${API_BASE_URL}/facet/departamento/`);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10; // Número de elementos por página


  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

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
    router.push('/dashboard/areas/');
  };

  const handleOpenDepartamentoModal = () => {
    setOpenDepartamentoModal(true);
  };

  const handleCloseDepartamentoModal = () => {
    setOpenDepartamentoModal(false);
  };

  useEffect(() => {
    if (openDepartamentoModal) {
      fetchDepartamentos(currentUrl);
    }
  }, [openDepartamentoModal, currentUrl]);

  const fetchDepartamentos = async (url: string) => {
    try {
      const response = await axios.get(url);
  
      setDepartamentos(response.data.results); // Lista de departamentos paginados
      setNextUrl(response.data.next); // URL para la página siguiente
      setPrevUrl(response.data.previous); // URL para la página anterior
      setTotalItems(response.data.count); // Total de elementos en la base de datos
  
      // Calcular la página actual usando offset
      const offset = new URL(url).searchParams.get('offset') || '0';
      setCurrentPage(Math.floor(Number(offset) / pageSize) + 1);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener los departamentos.',
      });
    }
  };
  
  const filtrarDepartamentos = () => {
    let url = `${API_BASE_URL}/facet/departamento/?`;
    const params = new URLSearchParams();
  
    if (filtroDepartamentos) params.append('nombre__icontains', filtroDepartamentos);
  
    url += params.toString();
    setCurrentUrl(url); // Actualiza la URL, lo que dispara el useEffect
  };
  

  const handleFilterDepartamentos = (filtro: string) => {
    return departamentos.filter((departamento) =>
      departamento.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const crearNuevaArea = async () => {
    if (!departamentoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe seleccionar un departamento.',
      });
      return;
    }

    const nuevaArea = {
      departamento: departamentoSeleccionado.id,
      nombre: nombre,
      estado: estado,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/facet/area/`, nuevaArea, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Éxito', 'Se creó el área con éxito.', handleConfirmModal);
    } catch (error) {
      handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
    }
  };

  const confirmarSeleccionDepartamento = () => {
    handleCloseDepartamentoModal();
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Área
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button variant="contained" onClick={handleOpenDepartamentoModal}>
                Seleccionar Departamento
              </Button>

              <Dialog open={openDepartamentoModal} onClose={handleCloseDepartamentoModal} maxWidth="md" fullWidth>
  <DialogTitle>Seleccionar Departamento</DialogTitle>
  <DialogContent>
    {/* Filtro */}
    <TextField
      label="Buscar por Nombre"
      value={filtroDepartamentos}
      onChange={(e) => setFiltroDepartamentos(e.target.value)}
      fullWidth
      margin="normal"
    />
    <Button variant="contained" onClick={filtrarDepartamentos} style={{ marginBottom: '16px' }}>
      Filtrar
    </Button>

    {/* Tabla de Departamentos */}
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Seleccionar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departamentos.map((departamento) => (
            <TableRow key={departamento.id}>
              <TableCell>{departamento.nombre}</TableCell>
              <TableCell>{departamento.telefono}</TableCell>
              <TableCell>{departamento.estado == 1 ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => setDepartamentoSeleccionado(departamento)}
                  style={{
                    backgroundColor:
                      departamentoSeleccionado?.id === departamento.id ? '#4caf50' : 'inherit',
                    color: departamentoSeleccionado?.id === departamento.id ? 'white' : 'inherit',
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

    {/* Paginación */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
      <Button
        variant="contained"
        onClick={() => prevUrl && setCurrentUrl(prevUrl)}
        disabled={!prevUrl}
      >
        Anterior
      </Button>
      <Typography>
        Página {currentPage} de {Math.ceil(totalItems / pageSize)}
      </Typography>
      <Button
        variant="contained"
        onClick={() => nextUrl && setCurrentUrl(nextUrl)}
        disabled={!nextUrl}
      >
        Siguiente
      </Button>
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDepartamentoModal}>Cerrar</Button>
    <Button
      variant="contained"
      color="primary"
      onClick={confirmarSeleccionDepartamento}
      disabled={!departamentoSeleccionado}
    >
      Confirmar Selección
    </Button>
  </DialogActions>
</Dialog>
            </Grid>

            <Grid item xs={12}>
              <TextField disabled label="Departamento" value={departamentoSeleccionado?.nombre || ''} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(capitalizeFirstLetter(e.target.value))}
                fullWidth
              />
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
              <Button variant="contained" onClick={crearNuevaArea}>
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

export default withAuth(CrearArea);
