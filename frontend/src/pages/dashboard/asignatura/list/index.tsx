import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from 'react-router-dom';

const ListaAsignaturas = () => {
  const h1Style = {
    color: 'black',
  };

  type EstadoAsignatura = 'Electiva' | 'Obligatoria';

  interface Area {
    idarea: number;
    iddepartamento: number;
    nombre: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
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

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [asignaturasFiltro, setAsignaturasFiltro] = useState<Asignatura[]>([]);
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroModulo, setFiltroModulo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDeptos = await axios.get('http://127.0.0.1:8000/facet/api/v1/departamentos/');
        setDepartamentos(responseDeptos.data);

        // Obtener áreas después de obtener departamentos
        const responseAreas = await axios.get('http://127.0.0.1:8000/facet/api/v1/areas/');
        setAreas(responseAreas.data);

        const response = await axios.get('http://127.0.0.1:8000/facet/api/v1/asignaturas/');
        setAsignaturas(response.data);
        setAsignaturasFiltro(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  

    fetchData();
  }, []);

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
  const currentItems = asignaturasFiltro.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(asignaturasFiltro.length / itemsPerPage);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };
  

  const filtrarAsignaturas = () => {

    // Implementa la lógica de filtrado aquí usando los estados de los filtros
    // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
    // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

     // Aplica la lógica de filtrado aquí utilizando la función filter
     const asignaturasFiltradas = asignaturas.filter((asignatura) => {
      // Aplica condiciones de filtrado según los valores de los filtros
      const cumpleCodigo = asignatura.codigo.toLowerCase().includes(filtroCodigo.toLowerCase());
      const cumpleNombre = asignatura.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const cumpleTipo = (
        asignatura.tipo.includes(filtroTipo)||filtroTipo=="Todos");
      const cumpleModulo = asignatura.modulo.toLowerCase().includes(filtroModulo.toLowerCase());  

      // Retorna true si la resolución cumple con todas las condiciones de filtrado
      return cumpleCodigo && cumpleNombre && cumpleTipo && cumpleModulo 
      // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
    });

    // Actualiza el estado de resoluciones con el nuevo array filtrado
    setAsignaturasFiltro(asignaturasFiltradas);
    setCurrentPage(1);
  };

  return (
    <Container maxWidth="lg">
    <div>

    <Link to="/dashboard/asignaturas/crear"> {/* Agrega un enlace a la página deseada */}
    <Button variant="contained" endIcon={<AddIcon />}>
      Agregar Asignatura
    </Button>
    </Link>
    </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Asignaturas
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
        <Typography variant="subtitle1">Nombre</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Modulo</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Programa</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Tipo</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Estado</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Area</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Departamento</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Docentes</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        </TableCell>
      {/* Agrega otras columnas de encabezado según sea necesario */}
    </TableRow>
  </TableHead>
  <TableBody>
    {currentItems.map((asignatura) => (
      <TableRow key={asignatura.idasignatura}>
        <TableCell>
          <Typography variant="body1">{asignatura.codigo}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{asignatura.nombre}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{asignatura.modulo}</Typography>
        </TableCell>
        <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <Link to={asignatura.programa} target="_blank" style={{ display: 'inline-block', lineHeight: '0' }}>
              <TextSnippetIcon />
            </Link>
          </TableCell>
        <TableCell>
          <Typography variant="body1">{asignatura.tipo}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{asignatura.estado}</Typography>
        </TableCell>
        <TableCell>
          {areas.find(area => area.idarea === asignatura.idarea)?.nombre || 'Area no encontrado'}
        </TableCell>
        <TableCell>
          {departamentos.find(depto => depto.iddepartamento === asignatura.iddepartamento)?.nombre || 'Departamento no encontrado'}
        </TableCell>   
        <TableCell style={{ textAlign: 'center' }}>
            <Link to={`/dashboard/asignaturas/docentes/${asignatura.idasignatura}`}>
            <GroupIcon />
            </Link>
          </TableCell>       
        <TableCell style={{ textAlign: 'center' }}>
            <Link to={`/dashboard/asignaturas/editar/${asignatura.idasignatura}/${asignatura.iddepartamento}`}>
            <EditIcon />
            </Link>
          </TableCell>
         {/* Agrega otras columnas de datos según sea necesario */}
      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer>
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

export default ListaAsignaturas;