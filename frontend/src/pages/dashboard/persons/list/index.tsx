import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DashboardMenu from '../../../dashboard';

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
  const [personas, setPersonas] = useState<Persona[]>([]);
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
    <DashboardMenu>
    <Container maxWidth="lg">
      <div>
        <Link href="/dashboard/persons/create" style={{ marginLeft: '10px' }} passHref>
          <Button variant="contained" endIcon={<AddIcon />}>
            Agregar Persona
          </Button>
        </Link>
        <Link href="/dashboard/persons/jefes" style={{ marginLeft: '10px' }} passHref>
          <Button variant="contained" color="info">
            Jefes
          </Button>
        </Link>
        <Link href="/dashboard/persons/docentes" style={{ marginLeft: '10px' }} passHref>
          <Button variant="contained" color="info">
            Docentes
          </Button>
        </Link>
        <Link href="/dashboard/persons/noDocentes" style={{ marginLeft: '10px' }} passHref>
          <Button variant="contained" color="info">
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
          <Grid item xs={4} marginBottom={2}>
            <TextField
              label="Legajo"
              value={filtroLegajo}
              onChange={(e) => setFiltroLegajo(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="0">Inactivo</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <Button variant="contained" onClick={filtrarPersonas}>
              Filtrar
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="header-row">
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">Nombre</Typography>
                </TableCell>
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">Apellido</Typography>
                </TableCell>
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">Teléfono</Typography>
                </TableCell>
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">DNI</Typography>
                </TableCell>
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">Estado</Typography>
                </TableCell>
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">Email</Typography>
                </TableCell>
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">Interno</Typography>
                </TableCell>
                <TableCell className="header-cell">
                  <Typography variant="subtitle1">Legajo</Typography>
                </TableCell>
                <TableCell className="header-cell"></TableCell>
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
                    <Link href={`/dashboard/persons/edit/${persona.id}`} passHref>
                      <EditIcon />
                    </Link>
                  </TableCell>
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
            Página {currentPage} de {Math.ceil(totalItems / pageSize)}
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
    </DashboardMenu>
  );
};

export default ListaPersonas;
