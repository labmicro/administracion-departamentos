import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js

const ListaAsignaturaCarrera = () => {
  const h1Style = {
    color: 'black',
  };

  const router = useRouter();
  const { idCarrera } = router.query; // Obtener idCarrera de la URL

  type EstadoAsignatura = 'Electiva' | 'Obligatoria';
  type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';

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
    fechadecreacion: Date;
    fechademodificacion: Date; 
  }

  interface Departamento {
    iddepartamento: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; 
    interno: string;
  }

  interface Carrera {
    idcarrera: number;
    nombre: string;
    tipo: TipoCarrera;
    planestudio: string;
    sitio: string;
    estado: 0 | 1; 
  }

  interface Asignatura {
    idasignatura: number;
    idarea: number;
    iddepartamento: number;
    codigo: string;
    nombre: string;
    modulo: string;
    programa: string;
    tipo: EstadoAsignatura;
    estado: 0 | 1; 
  }

  const [idAsignaturaCarrera, setIdAsignaturaCarrera] = useState<number>();
  const [asignaturasCarrera, setAsignaturasCarrera] = useState<AsignaturaCarrera[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [asignaturasCarreraFiltro, setAsignaturasCarreraFiltro] = useState<AsignaturaCarrera[]>([]);
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroModulo, setFiltroModulo] = useState('');

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
    router.push(`/dashboard/careers/asignaturas/${idCarrera}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAreas = await axios.get('http://127.0.0.1:8000/facet/area/');
        setAreas(responseAreas.data.results);
        const responseAsignaturas = await axios.get('http://127.0.0.1:8000/facet/asignatura/');
        setAsignaturas(responseAsignaturas.data.results);
        const responseDeptos = await axios.get('http://127.0.0.1:8000/facet/departamento/');
        setDepartamentos(responseDeptos.data.results);

        const response = await axios.get(`http://127.0.0.1:8000/facet/asignatura-carrera/`, {
          params: {
            idcarrera: idCarrera
          }
        });
        setAsignaturasCarrera(response.data.results);
        setAsignaturasCarreraFiltro(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idCarrera]);

  const paginationContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '16px 0',
  };

  const buttonStyle = {
    marginLeft: '8px',
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = asignaturasCarreraFiltro.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(asignaturasCarreraFiltro.length / itemsPerPage);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filtrarAsignaturas = () => {
    const asignaturasFiltradas = asignaturasCarrera.filter((asignaturaCarrera) => {
      const asignatura = asignaturas.find(asignatura => asignatura.idasignatura === asignaturaCarrera.idasignatura);
      if (!asignatura) return false; 

      const cumpleCodigo = asignatura.codigo.toLowerCase().includes(filtroCodigo.toLowerCase());
      const cumpleNombre = asignatura.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const cumpleTipo = (asignatura.tipo.includes(filtroTipo) || filtroTipo === "Todos");
      const cumpleModulo = asignatura.modulo.toLowerCase().includes(filtroModulo.toLowerCase());

      return cumpleCodigo && cumpleNombre && cumpleTipo && cumpleModulo;
    });

    setAsignaturasCarreraFiltro(asignaturasFiltradas);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setIdAsignaturaCarrera(id);
    setConfirmarEliminacion(true);
  };

  const eliminarCarrera = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/facet/asignatura-carrera/${idAsignaturaCarrera}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleOpenModal('Asignatura Eliminada', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud DELETE:', error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.');
    }
  };

  return (
    <Container maxWidth="lg">
      <div>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => router.push(`/dashboard/careers/asignaturaCarrera/create`)} // Navegación a la página de creación
        >
          Agregar Asignatura
        </Button>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Asignaturas de Carrera
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Código"
              value={filtroCodigo}
              onChange={(e) => setFiltroCodigo(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth margin="none">
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filtroTipo}
                label="Tipo"
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <MenuItem value={"Todos"}>Todos</MenuItem>
                <MenuItem value={"Electiva"}>Electiva</MenuItem>
                <MenuItem value={"Obligatoria"}>Obligatoria</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Módulo"
              value={filtroModulo}
              onChange={(e) => setFiltroModulo(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={filtrarAsignaturas}>
              Filtrar
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className='header-row'>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Código</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Asignatura</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Módulo</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Departamento</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Área</Typography>
                </TableCell>
                <TableCell className='header-cell'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((asignaturaCarrera) => {
                const asignaturaAsociada = asignaturas.find(asignatura => asignatura.idasignatura === asignaturaCarrera.idasignatura);
                const departamentoAsociado = departamentos.find(departamento => departamento.iddepartamento === asignaturaCarrera.iddepartamento);
                const areaAsociado = areas.find(area => area.idarea === asignaturaCarrera.idarea);
                
                return (
                  <TableRow key={asignaturaCarrera.idasignatura}>
                    <TableCell>
                      <Typography variant="body1">{asignaturaAsociada?.codigo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{asignaturaAsociada?.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{asignaturaAsociada?.modulo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{departamentoAsociado?.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{areaAsociado?.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <DeleteIcon onClick={() => handleDelete(asignaturaCarrera.id)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} />
        <ModalConfirmacion
          open={confirmarEliminacion}
          onClose={() => setConfirmarEliminacion(false)}
          onConfirm={() => {
            setConfirmarEliminacion(false);
            eliminarCarrera();
          }}
        />
      </Paper>

      <div style={paginationContainerStyle}>
        <Typography>Página {currentPage} de {totalPages}</Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            style={buttonStyle}
          >
            Anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={buttonStyle}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ListaAsignaturaCarrera;
