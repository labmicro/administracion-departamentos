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
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router';
import DashboardMenu from '../../..';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import withAuth from "../../../../../components/withAut"; // Importa el HOC
import { API_BASE_URL } from "../../../../../utils/config";


const ListaDocenteAsignatura: React.FC = () => {
  const router = useRouter();
  const { idAsignatura } = router.query;

  type Condicion = 'Regular' | 'Interino' | 'Transitorio';
  type Cargo = 'Titular' | 'Asociado' | 'Adjunto' | 'Jtp' | 'Adg' | 'Ayudante_estudiantil';
  type Dedicacion = 'Media' | 'Simple' | 'Exclusiva';

  interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
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
    condicion: Condicion;
    cargo: Cargo;
    dedicacion: Dedicacion;
    estado: 0 | 1;
    fecha_de_inicio: string; // Si viene como cadena en formato ISO
    fecha_de_vencimiento: string | null; // Incluye null si la fecha es opcional
}

  const [asignaturaDocentes, setAsignaturaDocentes] = useState<AsignaturaDocente[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCondicion, setFiltroCondicion] = useState<Condicion | ''>('');
  const [filtroCargo, setFiltroCargo] = useState<Cargo | ''>('');
  const [filtroDedicacion, setFiltroDedicacion] = useState<Dedicacion | ''>('');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    if (idAsignatura) {
      fetchData(`${API_BASE_URL}/facet/asignatura-docente/list_detalle/?asignatura=${idAsignatura}`);
    }
  }, [idAsignatura]);


  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
  
      setAsignaturaDocentes(data.results || data); // Usa `results` para DRF paginado
      setPrevUrl(data.previous || null); // Guarda la URL anterior
      setNextUrl(data.next || null); // Guarda la URL siguiente
      setTotalPages(Math.ceil(data.count / 10) || 1); // Calcula páginas (ajusta si el tamaño varía)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (idAsignatura) {
      const initialUrl = `${API_BASE_URL}/facet/asignatura-docente/list_detalle/?asignatura=${idAsignatura}`;
      setCurrentUrl(initialUrl);
    }
  }, [idAsignatura]);
  
  useEffect(() => {
    if (currentUrl) {
      fetchData(currentUrl);
    }
  }, [currentUrl]);  
  

  const filtrarAsignaturaDocentes = () => {
    if (!idAsignatura) return;

    let url = `${API_BASE_URL}/facet/asignatura-docente/list_detalle/?asignatura=${idAsignatura}`;
    const params = new URLSearchParams();
    if (filtroNombre) params.append('docente__persona__nombre__icontains', filtroNombre);
    if (filtroCondicion) params.append('condicion', filtroCondicion);
    if (filtroCargo) params.append('cargo', filtroCargo);
    if (filtroDedicacion) params.append('dedicacion', filtroDedicacion);
    url += `&${params.toString()}`;

    fetchData(url);
  };

  const descargarExcel = async () => {
    try {
      let allAsignaturaDocentes: AsignaturaDocente[] = [];
      let url = `${API_BASE_URL}/facet/asignatura-docente/list_detalle/?asignatura=${idAsignatura}`;
  
      while (url) {
        const response = await axios.get(url);
        const data = response.data;
  
        // Si `results` no está en la respuesta, usar la data directamente
        const results = data.results || data;
        const next = data.next || null;
  
        allAsignaturaDocentes = [...allAsignaturaDocentes, ...results];
        url = next;
      }
  
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(
        allAsignaturaDocentes.map((docente) => ({
          Nombre: `${docente.docente.persona.nombre} ${docente.docente.persona.apellido}`,
          Condicion: docente.condicion,
          Cargo: docente.cargo,
          Dedicacion: docente.dedicacion,
          Estado: docente.estado == 1 ? 'Activo' : 'Inactivo',
          "Fecha de Inicio": dayjs(docente.fecha_de_inicio).format('DD-MM-YYYY'),
          "Fecha de Vencimiento": docente.fecha_de_vencimiento ? dayjs(docente.fecha_de_vencimiento).format('DD-MM-YYYY') : 'N/A',
        }))
      );
  
      XLSX.utils.book_append_sheet(workbook, worksheet, 'AsignaturaDocentes');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
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
            onClick={() => router.push(`/dashboard/asignatura/docenteAsignatura/${idAsignatura}/create`)}
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

          <Grid container spacing={2} marginBottom={2}>
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
                <InputLabel>Condicion</InputLabel>
                <Select
                  value={filtroCondicion}
                  onChange={(e) => setFiltroCondicion(e.target.value as Condicion)}
                >
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Interino">Interino</MenuItem>
                  <MenuItem value="Transitorio">Transitorio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="none">
                <InputLabel>Cargo</InputLabel>
                <Select
                  value={filtroCargo}
                  onChange={(e) => setFiltroCargo(e.target.value as Cargo)}
                >
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  <MenuItem value="Titular">Titular</MenuItem>
                  <MenuItem value="Asociado">Asociado</MenuItem>
                  <MenuItem value="Adjunto">Adjunto</MenuItem>
                  <MenuItem value="Jtp">JTP</MenuItem>
                  <MenuItem value="Adg">ADG</MenuItem>
                  <MenuItem value="Ayudante_estudiantil">Ayudante estudiantil</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="none">
                <InputLabel>Dedicacion</InputLabel>
                <Select
                  value={filtroDedicacion}
                  onChange={(e) => setFiltroDedicacion(e.target.value as Dedicacion)}
                >
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  <MenuItem value="Media">Media</MenuItem>
                  <MenuItem value="Simple">Simple</MenuItem>
                  <MenuItem value="Exclusiva">Exclusiva</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={filtrarAsignaturaDocentes}>
                Filtrar
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="header-row">
                  <TableCell className="header-cell">Nombre</TableCell>
                  <TableCell className="header-cell">Condicion</TableCell>
                  <TableCell className="header-cell">Cargo</TableCell>
                  <TableCell className="header-cell">Dedicacion</TableCell>
                  <TableCell className="header-cell">Fecha de Inicio</TableCell>
                  <TableCell className="header-cell">Fecha de Vencimiento</TableCell>
                  {/* <TableCell className="header-cell">Acciones</TableCell> */}
                  <TableCell className="header-cell"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asignaturaDocentes.map((docente) => (
                  <TableRow key={docente.id}>
                    <TableCell>{docente.docente.persona?.nombre} {docente.docente.persona?.apellido}</TableCell>
                    <TableCell>{docente.condicion}</TableCell>
                    <TableCell>{docente.cargo}</TableCell>
                    <TableCell>{docente.dedicacion}</TableCell>
                    <TableCell>{dayjs(docente.fecha_de_inicio).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>{dayjs(docente.fecha_de_vencimiento).format('DD-MM-YYYY')}</TableCell>
                    {/* <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => router.push(`/dashboard/asignatura/docenteAsignatura/${idAsignatura}/edit/${docente.id}`)}
                      >
                        Editar
                      </Button>
                    </TableCell> */}
                    <TableCell>
                    <Link href={`/dashboard/asignatura/docenteAsignatura/${idAsignatura}/edit/${docente.id}`} passHref>
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
              onClick={() => prevUrl && setCurrentUrl(prevUrl)}
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
              onClick={() => nextUrl && setCurrentUrl(nextUrl)}
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

export default withAuth(ListaDocenteAsignatura);
