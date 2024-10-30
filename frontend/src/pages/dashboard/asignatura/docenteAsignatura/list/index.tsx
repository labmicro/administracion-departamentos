import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import DashboardMenu from '../../../../dashboard';


const ListaDocenteAsignatura = () => {
  const router = useRouter(); // Usa useRouter para obtener la información de enrutamiento
  const { idAsignatura } = router.query; // Obtén idAsignatura de los parámetros de la ruta

  type EstadoAsignatura = 'Electiva' | 'Obligatoria';
  type Condicion = 'Regular' | 'Interino' | 'Transitorio';
  type Cargo = 'Titular' | 'Asociado' | 'Adjunto' | 'Jtp' | 'Adg' | 'Ayudante_estudiantil';
  type Dedicacion = 'Media' | 'Simple' | 'Exclusiva';

  interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
    estado: 0 | 1;
    email: string;
    interno: string;
    legajo: string;
  }

  type TipoAsignatura = 'Electiva' | 'Obligatoria';
  interface Asignatura {
    id: number;
    area: number;
    asignatura: number;
    codigo: string;
    nombre: string;
    modulo: string;
    programa: string;
    tipo: TipoAsignatura;
    estado: 0 | 1;
  }

  interface Docente {
    id: number;
    persona: Persona;
    observaciones: string;
    estado: 0 | 1;
  }

  interface AsignaturaDocente {
    id: number;
    docente: Docente;
    asignatura: Asignatura;
    resolucion: number;
    condicion: Condicion;
    cargo: Cargo;
    dedicacion: Dedicacion;
    fecha_de_creacion: Date;
    fecha_de_modificacion: Date;
    fecha_de_vencimiento: Date;
    observaciones: string;
    estado: 0 | 1;
  }

  const [asignaturaDocentes, setAsignaturaDocentes] = useState<AsignaturaDocente[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCondicion, setFiltroCondicion] = useState<Condicion | ''>('');
  const [filtroCargo, setFiltroCargo] = useState<Cargo | ''>('');
  const [filtroDedicacion, setFiltroDedicacion] = useState<Dedicacion | ''>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('http://127.0.0.1:8000/facet/asignatura-docente/');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const [asignaturaDocentesRes, personasRes] = await Promise.all([
        axios.get(url),
        axios.get('http://127.0.0.1:8000/facet/persona/'),
      ]);

      setAsignaturaDocentes(asignaturaDocentesRes.data.results);
      setPersonas(personasRes.data.results);
      setNextUrl(asignaturaDocentesRes.data.next);
      setPrevUrl(asignaturaDocentesRes.data.previous);
      setTotalItems(asignaturaDocentesRes.data.count);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarAsignaturaDocentes = () => {
    let url = `http://127.0.0.1:8000/facet/asignatura-docente/?`;
    const params = new URLSearchParams();
    if (filtroNombre !== '') {
      params.append('nombre__icontains', filtroNombre);
    }
    if (filtroCondicion !== '') {
      params.append('condicion', filtroCondicion);
    }
    if (filtroCargo !== '') {
      params.append('cargo', filtroCargo);
    }
    if (filtroDedicacion !== '') {
      params.append('dedicacion', filtroDedicacion);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const descargarExcel = async () => {
    try {
      let allAsignaturaDocentes: AsignaturaDocente[] = [];

      let url = `http://127.0.0.1:8000/facet/asignatura-docente/?`;
      const params = new URLSearchParams();
      if (filtroNombre !== '') {
        params.append('nombre__icontains', filtroNombre);
      }
      if (filtroCondicion !== '') {
        params.append('condicion', filtroCondicion);
      }
      if (filtroCargo !== '') {
        params.append('cargo', filtroCargo);
      }
      if (filtroDedicacion !== '') {
        params.append('dedicacion', filtroDedicacion);
      }
      url += params.toString();

      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;

        allAsignaturaDocentes = [...allAsignaturaDocentes, ...results];
        url = next;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allAsignaturaDocentes);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'AsignaturaDocentes');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'asignatura_docentes.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <div>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => router.push(`/dashboard/asignaturas/docentes/${idAsignatura}/crear`)} // Cambia a usar Next.js
        >
          Agregar Docente Asignatura
        </Button>
        <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
          Descargar Excel
        </Button>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Docentes Asignatura
        </Typography>

        {/* Agrega controles de entrada y botones para los filtros */}
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
              <InputLabel id="demo-simple-select-label">Condicion</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filtroCondicion}
                label="Condicion"
                onChange={(e) => setFiltroCondicion(e.target.value as Condicion)}
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value={"Regular"}>Regular</MenuItem>
                <MenuItem value={"Interino"}>Interino</MenuItem>
                <MenuItem value={"Transitorio"}>Transitorio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth margin="none">
              <InputLabel id="demo-simple-select-label">Cargo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filtroCargo}
                label="Cargo"
                onChange={(e) => setFiltroCargo(e.target.value as Cargo)}
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value={"Titular"}>Titular</MenuItem>
                <MenuItem value={"Asociado"}>Asociado</MenuItem>
                <MenuItem value={"Adjunto"}>Adjunto</MenuItem>
                <MenuItem value={"Jtp"}>JTP</MenuItem>
                <MenuItem value={"Adg"}>ADG</MenuItem>
                <MenuItem value={"Ayudante_estudiantil"}>Ayudante estudiantil</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <FormControl fullWidth margin="none">
              <InputLabel id="demo-simple-select-label">Dedicacion</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filtroDedicacion}
                label="Dedicacion"
                onChange={(e) => setFiltroDedicacion(e.target.value as Dedicacion)}
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value={"Media"}>Media</MenuItem>
                <MenuItem value={"Simple"}>Simple</MenuItem>
                <MenuItem value={"Exclusiva"}>Exclusiva</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <Button variant="contained" color="primary" onClick={filtrarAsignaturaDocentes}>
              Aplicar Filtros
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className='header-row'>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Nombre</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Condicion</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Cargo</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Dedicacion</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asignaturaDocentes.map((docente) => {
                return (
                  <TableRow key={docente.id}>
                    <TableCell>{docente.docente.persona?.nombre} {docente.docente.persona?.apellido}</TableCell>
                    <TableCell>{docente.condicion}</TableCell>
                    <TableCell>{docente.cargo}</TableCell>
                    <TableCell>{docente.dedicacion}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => router.push(`/dashboard/asignaturas/docentes/${idAsignatura}/editar/${docente.id}`)} // Cambia a usar Next.js
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
    </DashboardMenu>
  );
};

export default ListaDocenteAsignatura;
