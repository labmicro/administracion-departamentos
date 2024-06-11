import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const ListaDepartamentos = () => {
  const h1Style = {
    color: 'black',
  };

  interface Departamento {
    iddepartamento: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    interno: string;
    // Otros campos según sea necesario
  }

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamentosFiltro, setDepartamentosFiltro] = useState<Departamento[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/facet/api/v1/departamentos/');
        setDepartamentos(response.data);
        setDepartamentosFiltro(response.data);
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
    const currentItems = departamentosFiltro.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(departamentosFiltro.length / itemsPerPage);

    const handleChangePage = (newPage: number) => {
      setCurrentPage(newPage);
    };
    

  const filtrarDepartamentos = () => {

    // Implementa la lógica de filtrado aquí usando los estados de los filtros
    // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
    // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

     // Aplica la lógica de filtrado aquí utilizando la función filter
     const departamentosFiltrados = departamentos.filter((departamento) => {
      // Aplica condiciones de filtrado según los valores de los filtros
      const cumpleNombre = departamento.nombre.toLowerCase().includes(filtroNombre.toLowerCase());

      // Retorn true si la resolución cumple con todas las condiciones de filtrado
      return cumpleNombre
      // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
    });

    // Actualiza el estado de resoluciones con el nuevo array filtrado
    setDepartamentosFiltro(departamentosFiltrados);
    setCurrentPage(1);
  };

  return (
    <Container maxWidth="lg">
      <div>

      <Link to="/dashboard/departamentos/crear"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" endIcon={<AddIcon />}>
        Agregar Departamento
      </Button>
      </Link>

      <Link to="/dashboard/departamentos/jefes"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" color='info'>
        Jefes
      </Button>
      </Link>
      </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Departamentos
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
        <Button variant="contained" onClick={filtrarDepartamentos}>
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
        <Typography variant="subtitle1">Telefono</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Estado</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Interno</Typography>
      </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
      {/* Agrega otras columnas de encabezado según sea necesario */}
    </TableRow>
  </TableHead>
  <TableBody>
    {currentItems.map((departamento) => (
      <TableRow key={departamento.iddepartamento}>
        <TableCell>
          <Typography variant="body1">{departamento.nombre}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{departamento.telefono}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{departamento.estado}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{departamento.interno}</Typography>
        </TableCell>
        <TableCell>
            <Link to={`/dashboard/departamentos/editar/${departamento.iddepartamento}`}>
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

export default ListaDepartamentos;