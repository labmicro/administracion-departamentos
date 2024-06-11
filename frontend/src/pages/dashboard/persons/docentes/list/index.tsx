import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

const ListaDocentes = () => {
  const h1Style = {
    color: 'black',
  };



  interface Persona {
    idpersona: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    email: string;
    interno: string;
    legajo: string;
    // Otros campos según sea necesario
  }


  interface Docente {
    idpersona: number;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [docentesFiltro, setDocentesFiltro] = useState<Docente[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDocentes = await axios.get('http://127.0.0.1:8000/facet/api/v1/docentes/')
        const responsPers = await axios.get('http://127.0.0.1:8000/facet/api/v1/personas/')
        setDocentes(responseDocentes.data)
        setDocentesFiltro(responseDocentes.data)
        setPersonas(responsPers.data)
        
        
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
    const currentItems = docentesFiltro.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(docentes.length / itemsPerPage);

    const handleChangePage = (newPage: number) => {
      setCurrentPage(newPage);
    };
    

    const filtrarDocentes = () => {

      // Implementa la lógica de filtrado aquí usando los estados de los filtros
      // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
      // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

      // Aplica la lógica de filtrado aquí utilizando la función filter
      const docentesFiltrados = docentes.filter((docente) => {
        // Aplica condiciones de filtrado según los valores de los filtros

        const personaAsociada = personas.find((persona)=> persona.idpersona === docente.idpersona)
        const cumpleNombre = personaAsociada?.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const cumpleApellido = personaAsociada?.apellido.toLowerCase().includes(filtroNombre.toLowerCase());

        // Retorn true si la resolución cumple con todas las condiciones de filtrado
        return cumpleNombre || cumpleApellido
        // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
      });

      // Actualiza el estado de resoluciones con el nuevo array filtrado
      setDocentesFiltro(docentesFiltrados);
      setCurrentPage(1);
    };

  return (
    <Container maxWidth="lg">
      <div>

      <Link to="/dashboard/personas/docentes/crear"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" endIcon={<AddIcon />}>
        Agregar Docente
      </Button>
      </Link>

      </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Docentes
</Typography>

<Grid container spacing={2}marginBottom={2}>
      <Grid item xs={4}>
        <TextField
          label="Docente"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarDocentes}>
          Filtrar
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>

<TableContainer component={Paper}>
<Table>
  <TableHead>
    <TableRow className='header-row'>
      {/* <TableCell className='header-cell'>
        <Typography variant="subtitle1">Id</Typography>
      </TableCell> */}
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Nombre</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Apellido</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Observacion</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Estado</Typography>
      </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
      {/* Agrega otras columnas de encabezado según sea necesario */}
    </TableRow>
  </TableHead>
  <TableBody>
  {currentItems.map((docente) => {
    // Buscar la persona con el idpersona correspondiente
    const personaAsociada = personas.find((persona) => persona.idpersona === docente.idpersona);

    return (
      
      <TableRow key={docente.idpersona}>
        <TableCell>
          <Typography variant="body1">{personaAsociada?.nombre}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{personaAsociada?.apellido}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{docente.observaciones}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{docente.estado}</Typography>
        </TableCell>
        <TableCell>
            <Link to={`/dashboard/personas/docentes/editar/${docente.idpersona}`}>
            <EditIcon />
            </Link>
          </TableCell>
         {/* Agrega otras columnas de datos según sea necesario */}
      </TableRow>
    );
  })}
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

export default ListaDocentes;