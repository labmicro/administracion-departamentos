import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,Grid} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Persona {
  id: number;
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

const ListaPersonas = () => {
  const h1Style = {
    color: 'black',
  };

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personasFiltro, setPersonasFiltro] = useState<Persona[]>([]);
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroLegajo, setFiltroLegajo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('http://127.0.0.1:8000/facet/persona/');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setPersonas(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    

  const filtrarPersonas = () => {

    let url = `http://127.0.0.1:8000/facet/persona/?`;
    const params = new URLSearchParams();
    if (filtroNombre !== '') {
      params.append('nombre__icontains', filtroNombre);
    }
    if (filtroDni !== '') {
      params.append('dni__icontains', filtroDni);
    }
    if (filtroEstado !== '') {
      params.append('estado', filtroEstado.toString());
    }
    if (filtroApellido !== '') {
      params.append('apellido__icontains', filtroApellido);
    }
    if (filtroLegajo !== '') {
      params.append('legajo__icontains', filtroLegajo);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const descargarExcel = async () => {
    try {
      let allPersona: Persona[] = [];

      let url = `http://127.0.0.1:8000/facet/persona/?`;
      const params = new URLSearchParams();
      if (filtroNombre !== '') {
        params.append('nombre__icontains', filtroNombre);
      }
      if (filtroEstado !== '') {
        params.append('estado', filtroEstado.toString());
      }
      if (filtroApellido !== '') {
        params.append('apellido__icontains', filtroApellido);
      }
      if (filtroLegajo !== '') {
        params.append('legajo__icontains', filtroLegajo);
      }
      url += params.toString();

      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;

        allPersona = [...allPersona, ...results];
        url = next;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allPersona);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Personas');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'personas.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
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
      <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
          Descargar Excel
        </Button>
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
    {personas.map((persona) => (
      <TableRow key={persona.id}>
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
            <Link to={`/dashboard/personas/editar/${persona.id}`}>
            <EditIcon />
            </Link>
          </TableCell>
         {/* Agrega otras columnas de datos según sea necesario */}
      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              prevUrl && setCurrentUrl(prevUrl);
              setCurrentPage(currentPage - 1);
            }}
            disabled={!prevUrl}
          >
            Anterior
          </Button>
          <Typography variant="body1">
            Página {currentPage} de {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              nextUrl && setCurrentUrl(nextUrl);
              setCurrentPage(currentPage + 1);
            }}
            disabled={!nextUrl}
          >
            Siguiente
          </Button>
        </div>
</Paper>
</Container>
  );
};

export default ListaPersonas;