import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,Grid} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const ListaPersonas = () => {
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

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personasFiltro, setPersonasFiltro] = useState<Persona[]>([]);
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroLegajo, setFiltroLegajo] = useState('');
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/facet/api/v1/personas/');
        setPersonas(response.data);
        setPersonasFiltro(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, [])


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
  const currentItems = personasFiltro.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(personasFiltro.length / itemsPerPage);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };
    

  const filtrarPersonas = () => {

    // Implementa la lógica de filtrado aquí usando los estados de los filtros
     // Aplica la lógica de filtrado aquí utilizando la función filter
     const personasFiltradas = personas.filter((persona) => {
      // Aplica condiciones de filtrado según los valores de los filtros
      const cumpleDni = persona.dni.includes(filtroDni);
      const cumpleNombre = persona.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const cumpleApellido = persona.apellido.toLowerCase().includes(filtroApellido.toLowerCase());
      const cumpleLegajo =((persona.legajo && persona.legajo.includes(filtroLegajo)) ||
      persona.legajo === null);

      // Retorna true si la resolución cumple con todas las condiciones de filtrado
      return cumpleDni && cumpleNombre && cumpleApellido && cumpleLegajo
      // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
    });

    // Actualiza el estado de resoluciones con el nuevo array filtrado
    setPersonasFiltro(personasFiltradas);
    setCurrentPage(1);
  };

  return (
    <Container maxWidth="lg">
    <div>

      <Link to="/dashboard/personas/crear"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" endIcon={<AddIcon />}>
        Agregar Persona
      </Button>
      </Link>
      <Link to="/dashboard/personas/jefes"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" color='info'>
        Jefes
      </Button>
      </Link>
      <Link to="/dashboard/personas/docentes"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" color='info'>
        Docentes
      </Button>
      </Link>
      <Link to="/dashboard/personas/nodocentes"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" color='info'>
        No Docentes
      </Button>
      </Link>
    </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Personas
</Typography>

<Grid container spacing={2}>
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
          label="Nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Apellido"
          value={filtroApellido}
          onChange={(e) => setFiltroApellido(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}  marginBottom={2}>
        <TextField
          label="Legajo"
          value={filtroLegajo}
          onChange={(e) => setFiltroLegajo(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarPersonas}>
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
        <Typography variant="subtitle1">Nombre</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Apellido</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Telefono</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">DNI</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Estado</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Email</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Interno</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Legajo</Typography>
      </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
      {/* Agrega otras columnas de encabezado según sea necesario */}
    </TableRow>
  </TableHead>
  <TableBody>
    {currentItems.map((persona) => (
      <TableRow key={persona.idpersona}>
        <TableCell>
          <Typography variant="body1">{persona.nombre}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persona.apellido}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persona.telefono}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persona.dni}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persona.estado}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persona.email}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persona.interno}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persona.legajo}</Typography>
        </TableCell>
        <TableCell>
            <Link to={`/dashboard/personas/editar/${persona.idpersona}`}>
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

export default ListaPersonas;