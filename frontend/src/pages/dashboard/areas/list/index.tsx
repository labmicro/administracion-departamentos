import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const ListaAreas = () => {
  const h1Style = {
    color: 'black',
  };

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

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [areasFiltro, setAreasFiltro] = useState<Area[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener departamentos
        const responseDeptos = await axios.get('http://127.0.0.1:8000/facet/api/v1/departamentos/');
        setDepartamentos(responseDeptos.data);

        // Obtener áreas después de obtener departamentos
        const responseAreas = await axios.get('http://127.0.0.1:8000/facet/api/v1/areas/');
        setAreasFiltro(responseAreas.data);
        setAreas(responseAreas.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Llamar a la función para cargar datos
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

  

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
    const currentItems = areasFiltro.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(areasFiltro.length / itemsPerPage);

    const handleChangePage = (newPage: number) => {
      setCurrentPage(newPage);
    };
    

  const filtrarAreas = () => {

    // Implementa la lógica de filtrado aquí usando los estados de los filtros
    // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
    // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

     // Aplica la lógica de filtrado aquí utilizando la función filter
     const departamentosFiltrados = areas.filter((area) => {
      // Aplica condiciones de filtrado según los valores de los filtros
      const cumpleNombre = area.nombre.toLowerCase().includes(filtroNombre.toLowerCase());

      // Retorn true si la resolución cumple con todas las condiciones de filtrado
      return cumpleNombre
      // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
    });

    // Actualiza el estado de resoluciones con el nuevo array filtrado
    setAreasFiltro(departamentosFiltrados);
    setCurrentPage(1);
  };

  return (
    <Container maxWidth="lg">
      <div>

      <Link to="/dashboard/areas/crear"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" endIcon={<AddIcon />}>
        Agregar Area
      </Button>
      </Link>
      </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Area
</Typography>

<Grid container spacing={2}marginBottom={2}>
      <Grid item xs={4}>
        <TextField
          label="Nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarAreas}>
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
        <Typography variant="subtitle1">Departamento</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Estado</Typography>
      </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
      {/* Agrega otras columnas de encabezado según sea necesario */}
    </TableRow>
  </TableHead>
  <TableBody>
    {currentItems.map((area) => (
      <TableRow key={area.idarea}>
        <TableCell>
          <Typography variant="body1">{area.nombre}</Typography>
        </TableCell>
        <TableCell>
          {departamentos.find(depto => depto.iddepartamento === area.iddepartamento)?.nombre || 'Departamento no encontrado'}
          </TableCell>
        <TableCell>
          <Typography variant="body1">{area.estado}</Typography>
        </TableCell>
        <TableCell>
            <Link to={`/dashboard/areas/editar/${area.idarea}`}>
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

export default ListaAreas;