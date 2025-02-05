import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Button, InputLabel, Select, MenuItem, FormControl, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DashboardMenu from '../../../../dashboard';
import { useRouter } from 'next/router';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import withAuth from "../../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../../utils/config";
import API from '@/api/axiosConfig';



const ListaAsignaturaCarrera = () => {
  const router = useRouter();
  const { idCarrera } = router.query;

  interface Area {
    idarea: number;
    iddepartamento: number;
    nombre: string;
    estado: 0 | 1;
  }

  interface AsignaturaCarrera {
    id: number;
    idcarrera: number;
    idasignatura: number;
    idarea: number;
    iddepartamento: number;
    estado: 0 | 1;
  }

  interface Departamento {
    iddepartamento: number;
    nombre: string;
  }

  interface Asignatura {
    idasignatura: number;
    idarea: number;
    iddepartamento: number;
    codigo: string;
    nombre: string;
    modulo: string;
    tipo: 'Electiva' | 'Obligatoria';
    estado: 0 | 1;
  }

  const [asignaturasCarrera, setAsignaturasCarrera] = useState<AsignaturaCarrera[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroModulo, setFiltroModulo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(asignaturasCarrera.length / itemsPerPage);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [idAsignaturaCarrera, setIdAsignaturaCarrera] = useState<number | null>(null);

  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  useEffect(() => {
    if (idCarrera) {
      fetchData();
    }
  }, [idCarrera]);

  const fetchData = async () => {
    try {
      const [areasRes, asignaturasRes, deptosRes, asignaturasCarreraRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/facet/area/`),
        axios.get(`${API_BASE_URL}/facet/asignatura/`),
        axios.get(`${API_BASE_URL}/facet/departamento/`),
        axios.get(`${API_BASE_URL}/facet/asignatura-carrera/`, { params: { idcarrera: idCarrera } }),
      ]);

      setAreas(areasRes.data.results);
      setAsignaturas(asignaturasRes.data.results);
      setDepartamentos(deptosRes.data.results);
      setAsignaturasCarrera(asignaturasCarreraRes.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const descargarExcel = async () => {
    try {
      let allAsignaturasCarrera: AsignaturaCarrera[] = [];
      let url = `${API_BASE_URL}/facet/asignatura-carrera/?idcarrera=${idCarrera}`;
  
      // Aplicar los filtros a la URL
      const params = new URLSearchParams();
      if (filtroCodigo) params.append('codigo__icontains', filtroCodigo);
      if (filtroNombre) params.append('nombre__icontains', filtroNombre);
      if (filtroTipo) params.append('tipo', filtroTipo);
      if (filtroModulo) params.append('modulo__icontains', filtroModulo);
      url += `&${params.toString()}`;
  
      // Obtener todos los datos con paginación
      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;
        allAsignaturasCarrera = [...allAsignaturasCarrera, ...results];
        url = next; // Continuar con la siguiente página si existe
      }
  
      // Generar el archivo Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(
        allAsignaturasCarrera.map((asignaturaCarrera) => {
          const asignatura = asignaturas.find(asig => asig.idasignatura === asignaturaCarrera.idasignatura);
          const departamento = departamentos.find(depto => depto.iddepartamento === asignaturaCarrera.iddepartamento);
          const area = areas.find(area => area.idarea === asignaturaCarrera.idarea);
  
          return {
            Código: asignatura?.codigo || '',
            Asignatura: asignatura?.nombre || '',
            Módulo: asignatura?.modulo || '',
            Departamento: departamento?.nombre || '',
            Área: area?.nombre || '',
          };
        })
      );
  
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Asignaturas de Carrera');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'asignaturas_carrera.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };
  

  const filtrarAsignaturas = () => {
    setAsignaturasCarrera(asignaturasCarrera.filter((asignaturaCarrera) => {
      const asignatura = asignaturas.find(asig => asig.idasignatura === asignaturaCarrera.idasignatura);
      if (!asignatura) return false;

      return (
        asignatura.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()) &&
        asignatura.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        (filtroTipo === '' || asignatura.tipo === filtroTipo) &&
        asignatura.modulo.toLowerCase().includes(filtroModulo.toLowerCase())
      );
    }));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = asignaturasCarrera.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteAsignatura = async () => {
    if (idAsignaturaCarrera !== null) {
      try {
        await API.delete(`/facet/asignatura-carrera/${idAsignaturaCarrera}/`);
        setAsignaturasCarrera((prevAsignaturas) =>
          prevAsignaturas.filter((asignatura) => asignatura.id !== idAsignaturaCarrera)
        );
        handleOpenModal('Asignatura Eliminada', 'La asignatura fue eliminada con éxito.');
      } catch (error) {
        handleOpenModal('Error', 'No se pudo eliminar la asignatura.');
        console.error('Error deleting asignatura:', error);
      }
      setConfirmarEliminacion(false);
    }
  };

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <div>
          <Button 
            variant="contained" 
            endIcon={<AddIcon />} 
            onClick={() => router.push(`/dashboard/careers/asignaturaCarrera/${idCarrera}/create`)}
          >
            Agregar Asignatura
          </Button>
          <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
            Descargar Excel
          </Button>
        </div>

        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>Asignaturas de Carrera</Typography>

          <Grid container spacing={2} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <TextField label="Código" value={filtroCodigo} onChange={(e) => setFiltroCodigo(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Nombre" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  <MenuItem value="Electiva">Electiva</MenuItem>
                  <MenuItem value="Obligatoria">Obligatoria</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField label="Módulo" value={filtroModulo} onChange={(e) => setFiltroModulo(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={filtrarAsignaturas}>Filtrar</Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="header-row">
                  <TableCell className="header-cell"><Typography variant="subtitle1">Código</Typography></TableCell>
                  <TableCell className="header-cell"><Typography variant="subtitle1">Asignatura</Typography></TableCell>
                  <TableCell className="header-cell"><Typography variant="subtitle1">Módulo</Typography></TableCell>
                  <TableCell className="header-cell"><Typography variant="subtitle1">Departamento</Typography></TableCell>
                  <TableCell className="header-cell"><Typography variant="subtitle1">Área</Typography></TableCell>
                  <TableCell className="header-cell"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((asignaturaCarrera) => {
                  const asignaturaAsociada = asignaturas.find(asignatura => asignatura.idasignatura === asignaturaCarrera.idasignatura);
                  const departamentoAsociado = departamentos.find(depto => depto.iddepartamento === asignaturaCarrera.iddepartamento);
                  const areaAsociado = areas.find(area => area.idarea === asignaturaCarrera.idarea);

                  return (
                    <TableRow key={asignaturaCarrera.id}>
                      <TableCell>{asignaturaAsociada?.codigo}</TableCell>
                      <TableCell>{asignaturaAsociada?.nombre}</TableCell>
                      <TableCell>{asignaturaAsociada?.modulo}</TableCell>
                      <TableCell>{departamentoAsociado?.nombre}</TableCell>
                      <TableCell>{areaAsociado?.nombre}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setIdAsignaturaCarrera(asignaturaCarrera.id);
                            setConfirmarEliminacion(true);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Typography variant="body1">Página {currentPage} de {totalPages}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </Paper>

        <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} />
        <ModalConfirmacion
          open={confirmarEliminacion}
          onClose={() => setConfirmarEliminacion(false)}
          onConfirm={handleDeleteAsignatura}
        />
      </Container>
    </DashboardMenu>
  );
};

export default withAuth(ListaAsignaturaCarrera);
