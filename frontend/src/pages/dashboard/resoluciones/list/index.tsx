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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const ListaResoluciones = () => {

  interface Resolucion {
    idresolucion: number;
    nexpediente: string;
    nresolucion: string;
    tipo: string;
    fechadecarga: Date;
    fecha: Date; // Aquí indicas que 'fecha' es de tipo Date
    adjunto:string;
    observaciones:string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [resolucionesFiltro, setResolucionesFiltro] = useState<Resolucion[]>([]);
  const [filtroNroExpediente, setFiltroNroExpediente] = useState('');
  const [filtroNroResolucion, setFiltroNroResolucion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState<dayjs.Dayjs | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/facet/api/v1/resoluciones/');
        setResoluciones(response.data);
        setResolucionesFiltro(response.data);
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
    const currentItems = resolucionesFiltro.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(resolucionesFiltro.length / itemsPerPage);
  
    const handleChangePage = (newPage: number) => {
      setCurrentPage(newPage);
    };

  const filtrarResoluciones = () => {

    // Implementa la lógica de filtrado aquí usando los estados de los filtros
    // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
    // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

     // Aplica la lógica de filtrado aquí utilizando la función filter
     const resolucionesFiltradas = resoluciones.filter((resolucion) => {
      // Aplica condiciones de filtrado según los valores de los filtros
      const cumpleNroExpediente = resolucion.nexpediente.includes(filtroNroExpediente);
      const cumpleNroResolucion = resolucion.nresolucion.includes(filtroNroResolucion);
      const cumpleTipo = (
        resolucion.tipo.includes(filtroTipo)||filtroTipo=="Todos");
      const fechaResolucion = dayjs.utc(resolucion.fecha);
      const cumpleFecha = (
        filtroFecha instanceof dayjs &&
        fechaResolucion instanceof dayjs &&
        filtroFecha.format('YYYY-MM-DD') === fechaResolucion.format('YYYY-MM-DD') ||
        (filtroFecha ===null || !filtroFecha.isValid())
      );

      // Retorna true si la resolución cumple con todas las condiciones de filtrado
      return cumpleNroExpediente && cumpleNroResolucion && cumpleTipo && cumpleFecha
      // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
    });

    // Actualiza el estado de resoluciones con el nuevo array filtrado
    setResolucionesFiltro(resolucionesFiltradas);
    setCurrentPage(1);
  };

  return (

<Container maxWidth="lg">
<div>
    <Link to="/dashboard/resoluciones/crear"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" endIcon={<AddIcon />}>
        Agregar Resolucion
      </Button>
    </Link>
 </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Resoluciones
  </Typography>

  {/* Agrega controles de entrada y botones para los filtros */}
  <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          label="Nro Expediente"
          value={filtroNroExpediente}
          onChange={(e) => setFiltroNroExpediente(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Nro Resolución"
          value={filtroNroResolucion}
          onChange={(e) => setFiltroNroResolucion(e.target.value)}
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
            <MenuItem value={"Rector"}>Rector</MenuItem>
            <MenuItem value={"Decano"}>Decano</MenuItem>
            <MenuItem value={"Consejo_Superior"}>Consejo Superior</MenuItem>
            <MenuItem value={"Consejo_Directivo"}>Consejo Directivo</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} marginBottom={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Fecha"
        value={filtroFecha}
        onChange={(date) => {
          if (date) {
            const fechaSeleccionada = dayjs(date).utc();  // Usa .utc() para evitar problemas de zona horaria
            setFiltroFecha(fechaSeleccionada);
            // console.log(fechaSeleccionada); // Imprime la fecha en la consola
          }
        }}
      />
      </LocalizationProvider>
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarResoluciones}>
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
          <Typography variant="subtitle1">Nro Expediente</Typography>
        </TableCell>
        <TableCell className='header-cell'>
          <Typography variant="subtitle1">Nro Resolución</Typography>
        </TableCell>
        <TableCell className='header-cell'>
          <Typography variant="subtitle1">Tipo</Typography>
        </TableCell>
        <TableCell className='header-cell'>
          <Typography variant="subtitle1">Fecha</Typography>
        </TableCell>
        <TableCell className='header-cell'>
          <Typography variant="subtitle1">Carga</Typography>
        </TableCell>
        <TableCell className='header-cell'>
          <Typography variant="subtitle1">Estado</Typography>
        </TableCell>
        <TableCell className='header-cell'>
          <Typography variant="subtitle1">Adjunto</Typography>
        </TableCell>
        <TableCell className='header-cell'>
          <Typography variant="subtitle1">Observaciones</Typography>
        </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
        {/* Agrega otras columnas de encabezado según sea necesario */}
      </TableRow>
    </TableHead>
    <TableBody>
      {currentItems.map((resolucion) => (
        <TableRow key={resolucion.idresolucion}>
          <TableCell>
            <Typography variant="body1">{resolucion.nexpediente}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">{resolucion.nresolucion}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">
            {resolucion.tipo === 'Consejo_Superior' ? 'Consejo Superior' : 
            (resolucion.tipo === 'Consejo_Directivo' ? 'Consejo Directivo' : resolucion.tipo)}
              </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">{resolucion.fecha.toLocaleString().split('T')[0]}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">{resolucion.fechadecarga.toLocaleString().split('T')[0]}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">{resolucion.estado}</Typography>
          </TableCell>
          <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <Link to={resolucion.adjunto} target="_blank" style={{ display: 'inline-block', lineHeight: '0' }}>
              <TextSnippetIcon />
            </Link>
          </TableCell>
          <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <Tooltip title={resolucion.observaciones}>
              <VisibilityIcon/>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Link to={`/dashboard/resoluciones/editar/${resolucion.idresolucion}`}>
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

export default ListaResoluciones;