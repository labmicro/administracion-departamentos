import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Link } from 'react-router-dom';

const ListaCarreras = () => {
  const h1Style = {
    color: 'black',
  };

  type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';

  interface Carrera {
    idcarrera: number;
    nombre: string;
    tipo: TipoCarrera;
    planestudio: string;
    sitio: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrerasFiltro, setCarrerasFiltro] = useState<Carrera[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroPlanEstudio, setFiltroPlanEstudio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/facet/api/v1/carreras/');
        setCarreras(response.data);
        setCarrerasFiltro(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, []);

  const filtrarCarreras = () => {

    // Implementa la lógica de filtrado aquí usando los estados de los filtros
    // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
    // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

     // Aplica la lógica de filtrado aquí utilizando la función filter
     const carrerasFiltradas = carreras.filter((carrera) => {
      // Aplica condiciones de filtrado según los valores de los filtros
      const cumpleNombre = carrera.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const cumpleTipo = (
        carrera.tipo.includes(filtroTipo)||filtroTipo=="Todos");
      const cumplePlanEstudio = carrera.planestudio.includes(filtroPlanEstudio);  

      // Retorna true si la resolución cumple con todas las condiciones de filtrado
      return cumplePlanEstudio && cumpleNombre && cumpleTipo  
      // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
    });

    // Actualiza el estado de resoluciones con el nuevo array filtrado
    setCarrerasFiltro(carrerasFiltradas);
  };


  return (
    <Container maxWidth="lg">
    <div>

    <Link to="/dashboard/carreras/crear"> {/* Agrega un enlace a la página deseada */}
    <Button variant="contained" endIcon={<AddIcon />}>
      Agregar Carrera
    </Button>
    </Link>
    </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Carreras
</Typography>

<Grid container spacing={2}>
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
            <MenuItem value={"Pregado"}>Pregado</MenuItem>
            <MenuItem value={"Grado"}>Grado</MenuItem>
            <MenuItem value={"Posgrado"}>Posgrado</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <TextField
          label="Plan de Estudio"
          value={filtroPlanEstudio}
          onChange={(e) => setFiltroPlanEstudio(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarCarreras}>
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
        <Typography variant="subtitle1">Tipo</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Plan de Estudio</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Sitio</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Asignaturas</Typography>
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
    {carrerasFiltro.map((carrera) => (
      <TableRow key={carrera.idcarrera}>
        <TableCell>
          <Typography variant="body1">{carrera.nombre}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{carrera.tipo}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{carrera.planestudio}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{carrera.sitio}</Typography>
        </TableCell>
        <TableCell style={{ textAlign: 'center' }}>
            <Link to={`/dashboard/carreras/asignaturas/${carrera.idcarrera}`}>
            <NoteAltIcon />
            </Link>
          </TableCell>
        <TableCell style={{ textAlign: 'center' }}>
          <Typography variant="body1">{carrera.estado}</Typography>
        </TableCell>
        <TableCell>
            <Link to={`/dashboard/carreras/editar/${carrera.idcarrera}`}>
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
</Container>
  );
};

export default ListaCarreras;