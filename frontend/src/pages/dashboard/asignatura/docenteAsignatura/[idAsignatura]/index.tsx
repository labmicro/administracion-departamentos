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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router';
import DashboardMenu from '../../../../dashboard';

interface ListaDocenteAsignaturaProps {
  idAsignatura: string;
}

const ListaDocenteAsignatura: React.FC<ListaDocenteAsignaturaProps> = ({ idAsignatura }) => {
  const router = useRouter();

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
  }

  const [asignaturaDocentes, setAsignaturaDocentes] = useState<AsignaturaDocente[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCondicion, setFiltroCondicion] = useState<Condicion | ''>('');
  const [filtroCargo, setFiltroCargo] = useState<Cargo | ''>('');
  const [filtroDedicacion, setFiltroDedicacion] = useState<Dedicacion | ''>('');
  const [currentUrl, setCurrentUrl] = useState<string>(`http://127.0.0.1:8000/facet/asignatura-docente/?asignatura=${idAsignatura}`);

  useEffect(() => {
    if (idAsignatura) {
      setCurrentUrl(`http://127.0.0.1:8000/facet/asignatura-docente/?asignatura=${idAsignatura}`);
    }
  }, [idAsignatura]);

  useEffect(() => {
    if (currentUrl) {
      fetchData(currentUrl);
    }
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setAsignaturaDocentes(response.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarAsignaturaDocentes = () => {
    if (!idAsignatura) return;

    let url = `http://127.0.0.1:8000/facet/asignatura-docente/?asignatura=${idAsignatura}`;
    const params = new URLSearchParams();
    if (filtroNombre) params.append('nombre__icontains', filtroNombre);
    if (filtroCondicion) params.append('condicion', filtroCondicion);
    if (filtroCargo) params.append('cargo', filtroCargo);
    if (filtroDedicacion) params.append('dedicacion', filtroDedicacion);
    url += `&${params.toString()}`;

    setCurrentUrl(url);
  };

  const descargarExcel = async () => {
    try {
      let allAsignaturaDocentes: AsignaturaDocente[] = [];
      let url = currentUrl;

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
            onClick={() => router.push(`/dashboard/asignaturas/docentes/${idAsignatura}/crear`)}
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
                  <TableCell className="header-cell">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asignaturaDocentes.map((docente) => (
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
                        onClick={() => router.push(`/dashboard/asignaturas/docentes/${idAsignatura}/editar/${docente.id}`)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </DashboardMenu>
  );
};

export default ListaDocenteAsignatura;
