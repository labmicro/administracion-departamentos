import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ListaAsignaturas = () => {
  const h1Style = {
    color: 'black',
  };

  type EstadoAsignatura = 'Electiva' | 'Obligatoria';

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


  interface Asignatura {
    id: number;
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
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('http://127.0.0.1:8000/facet/asignatura/');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setAsignaturas(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarAsignaturas = () => {
    let url = `http://127.0.0.1:8000/facet/asignatura/?`;
    const params = new URLSearchParams();
    if (filtroNombre !== '') {
      params.append('nombre__icontains', filtroNombre);
    }
    if (filtroCodigo !== '') {
      params.append('codigo__icontains', filtroCodigo);
    }
    if (filtroEstado !== '') {
      params.append('estado', filtroEstado.toString());
    }
    if (filtroTipo !== '') {
      params.append('tipo', filtroTipo);
    }
    if (filtroModulo !== '') {
      params.append('modulo__icontains', filtroModulo);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const descargarExcel = async () => {
    try {
      let allAsignaturas: Asignatura[] = [];

      let url = `http://127.0.0.1:8000/facet/asignatura/?`;
      const params = new URLSearchParams();
      if (filtroNombre !== '') {
        params.append('nombre__icontains', filtroNombre);
      }
      if (filtroEstado !== '') {
        params.append('estado', filtroEstado.toString());
      }
      if (filtroTipo !== '') {
        params.append('tipo', filtroTipo);
      }
      if (filtroModulo !== '') {
        params.append('planestudio__icontains', filtroModulo);
      }
      url += params.toString();

      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;

        allAsignaturas = [...allAsignaturas, ...results];
        url = next;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allAsignaturas);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Asignaturas');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'asignaturas.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <Container maxWidth="lg">
    <div>

    <Link to="/dashboard/asignaturas/crear"> {/* Agrega un enlace a la página deseada */}
    <Button variant="contained" endIcon={<AddIcon />}>
      Agregar Asignatura
    </Button>
    </Link>
    <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
          Descargar Excel
        </Button>
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
            <MenuItem value=""><em>Todos</em></MenuItem>
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
    {asignaturas.map((asignatura) => (
      <TableRow key={asignatura.id}>
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
          {areas.find(area => area.id === asignatura.idarea)?.nombre || 'Area no encontrado'}
        </TableCell>
        <TableCell>
          {departamentos.find(depto => depto.id === asignatura.id)?.nombre || 'Departamento no encontrado'}
        </TableCell>   
        <TableCell style={{ textAlign: 'center' }}>
            <Link to={`/dashboard/asignaturas/docentes/${asignatura.id}`}>
            <GroupIcon />
            </Link>
          </TableCell>       
        <TableCell style={{ textAlign: 'center' }}>
            <Link to={`/dashboard/asignaturas/editar/${asignatura.id}/${asignatura.id}`}>
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

export default ListaAsignaturas;