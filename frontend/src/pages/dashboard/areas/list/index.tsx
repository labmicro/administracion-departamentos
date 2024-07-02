import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


interface Area {
  id: number;
  iddepartamento: number;
  nombre: string;
  estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
  // Otros campos según sea necesario
}

interface Departamento {
  id: number;
  nombre: string;
  telefono: string;
  estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
  interno: string;
  // Otros campos según sea necesario
}
const ListaAreas = () => {
  const h1Style = {
    color: 'black',
  };

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [areasFiltro, setAreasFiltro] = useState<Area[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('http://127.0.0.1:8000/facet/area/');
  const [currentUrlDepto, setCurrentUrlDepto] = useState<string>('http://127.0.0.1:8000/facet/departamento/');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl,currentUrlDepto);
  }, [currentUrl,currentUrlDepto]);

  const fetchData = async (url: string,url2: string) => {
    try {
      const response = await axios.get(url);
      const deptos = await axios.get(url2);
      setAreas(response.data.results);
      setDepartamentos(deptos.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarAreas = () => {
    let url = `http://127.0.0.1:8000/facet/area/?`;
    const params = new URLSearchParams();
    if (filtroNombre !== '') {
      params.append('nombre__icontains', filtroNombre);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const descargarExcel = async () => {
    try {
      let allAreas: Area[] = [];

      let url = `http://127.0.0.1:8000/facet/area/?`;
      const params = new URLSearchParams();
      if (filtroNombre !== '') {
        params.append('nombre__icontains', filtroNombre);
      }
      url += params.toString();

      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;

        allAreas = [...allAreas, ...results];
        url = next;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allAreas);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Areas');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'areas.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <div>

      <Link to="/dashboard/areas/crear"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" endIcon={<AddIcon />}>
        Agregar Area
      </Button>
      </Link>
      <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
          Descargar Excel
        </Button>
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
    {areas.map((area) => (
      <TableRow key={area.id}>
        <TableCell>
          <Typography variant="body1">{area.nombre}</Typography>
        </TableCell>
        <TableCell>
          {departamentos.find(depto => depto.id === area.id)?.nombre || 'Departamento no encontrado'}
          </TableCell>
        <TableCell>
          <Typography variant="body1">{area.estado}</Typography>
        </TableCell>
        <TableCell>
            <Link to={`/dashboard/areas/editar/${area.id}`}>
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

export default ListaAreas;