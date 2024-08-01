import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BasicModal from '@/utils/modal';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { Link, useParams ,useNavigate } from 'react-router-dom';

const ListaAsignaturaCarrera = () => {
  const h1Style = {
    color: 'black',
  };

  const { idCarrera } = useParams();

  type EstadoAsignatura = 'Electiva' | 'Obligatoria';
  type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';

  interface Area {
    idarea: number;
    iddepartamento: number;
    nombre: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface AsignaturaCarrera {    
    id: number;
    idcarrera: number;
    idasignatura: number;
    idarea: number;
    iddepartamento: number;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    fechadecreacion: Date;
    fechademodificacion: Date; // Aquí indicas que 'fecha' es de tipo Date
    // Otros campos según sea necesario
  }

  interface Departamento {
    iddepartamento: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    interno: string;
    // Otros campos según sea necesario
  }

  interface Carrera {
    idcarrera: number;
    nombre: string;
    tipo: TipoCarrera;
    planestudio: string;
    sitio: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
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
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }
  const navigate = useNavigate();
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
  const [modalTitle, setModalTitle] = useState(''); // Nuevo estado para el título del modal
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);


  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title); // Establecer el título del modal
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    navigate(`/dashboard/carreras/asignaturas/${idCarrera}`);
  };


  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Obtener áreas después de obtener departamentos
        const responseAreas = await axios.get('http://127.0.0.1:8000/facet/area/');
        setAreas(responseAreas.data.results);
        const responseAsignaturas = await axios.get('http://127.0.0.1:8000/facet/asignatura/');
        setAsignaturas(responseAsignaturas.data.results);
        const responseDeptos = await axios.get('http://127.0.0.1:8000/facet/departamento/');
        setDepartamentos(responseDeptos.data.results);

        // Obtener asignaturas carrera filtradas por idCarrera
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
    margin: '16px 0', // Puedes ajustar según sea necesario
  };
  
  const buttonStyle = {
    marginLeft: '8px', // Puedes ajustar según sea necesario
  };

  // --Paginado
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

    // Implementa la lógica de filtrado aquí usando los estados de los filtros
    // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
    // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

     // Aplica la lógica de filtrado aquí utilizando la función filter
     const asignaturasFiltradas = asignaturasCarrera.filter((asignaturaCarrera) => {
      // Aplica condiciones de filtrado según los valores de los filtros
      const asignatura = asignaturas.find(asignatura => asignatura.idasignatura === asignaturaCarrera.idasignatura);
      if (!asignatura) return false; // Si no se encuentra la asignatura, no la incluyas en los resultados del filtro
      
      // Aplica condiciones de filtrado según las propiedades de la asignatura
      const cumpleCodigo = asignatura.codigo.toLowerCase().includes(filtroCodigo.toLowerCase());
      const cumpleNombre = asignatura.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const cumpleTipo = (asignatura.tipo.includes(filtroTipo) || filtroTipo === "Todos");
      const cumpleModulo = asignatura.modulo.toLowerCase().includes(filtroModulo.toLowerCase());
  
      // Retorna true si la asignatura cumple con todas las condiciones de filtrado
      return cumpleCodigo && cumpleNombre && cumpleTipo && cumpleModulo;
    });

    // Actualiza el estado de resoluciones con el nuevo array filtrado
    setAsignaturasCarreraFiltro(asignaturasFiltradas);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setIdAsignaturaCarrera(id);
    setConfirmarEliminacion(true);
};

  const eliminarCarrera = async () => {


    try {
      const response = await axios.delete(`http://127.0.0.1:8000/facet/asignatura-carrera/${idAsignaturaCarrera}/`,{
        headers: {
          'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
        },
      });
      handleOpenModal('Asignatura Eliminada', 'La acción se realizó con éxito.');
    } catch (error) {
      console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error','NO  se pudo realizar la acción.');
    
    }
    
    }

  return (
    <Container maxWidth="lg">
    <div>

    <Link to={`/dashboard/carreras/asignaturas/${idCarrera}/crear/`}> {/* Agrega un enlace a la página deseada */}
    <Button variant="contained" endIcon={<AddIcon />}>
      Agregar Asignatura
    </Button>
    </Link>
    </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Asignaturas de Carrera
</Typography>

{/* Agrega controles de entrada y botones para los filtros */}
<Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          label="Codigo"
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
      <Grid item xs={4} marginBottom={2}>
        <TextField
          label="Modulo"
          value={filtroModulo}
          onChange={(e) => setFiltroModulo(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarAsignaturas}>
          Filtrar
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>

<TableContainer component={Paper}>
<Table>
  <TableHead>
  <TableRow className='header-row'>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Codigo</Typography>
      </TableCell >
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Asignatura</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Modulo</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Departamento</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Area</Typography>
      </TableCell>

      <TableCell className='header-cell'>
        </TableCell>
      {/* Agrega otras columnas de encabezado según sea necesario */}
    </TableRow>
  </TableHead>
  <TableBody>
    {currentItems.map((asignaturaCarrera) => {
          // Buscar la persona con el idpersona correspondient
      const asignaturaAsociada = asignaturas.find((asignatura)=> asignatura.idasignatura === asignaturaCarrera.idasignatura)
      const departamentoAsociado = departamentos.find((departamento)=> departamento.iddepartamento === asignaturaCarrera.iddepartamento)
      const areaAsociado = areas.find((area)=> area.idarea === asignaturaCarrera.idarea)
          
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
        {/* <TableCell>
          {areas.find(area => area.idarea === asignatura.idarea)?.nombre || 'Area no encontrado'}
        </TableCell> */}
        {/* <TableCell>
          {departamentos.find(depto => depto.iddepartamento === asignatura.iddepartamento)?.nombre || 'Departamento no encontrado'}
        </TableCell>           */}
       <TableCell>
            <DeleteIcon onClick={() => handleDelete(asignaturaCarrera.id)}/>
          </TableCell>
         {/* Agrega otras columnas de datos según sea necesario */}
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