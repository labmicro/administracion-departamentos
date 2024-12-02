import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Button, InputLabel, Select, MenuItem, FormControl, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DashboardMenu from '../../../dashboard';
import withAuth from "../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../utils/config";

type TipoCarrera = 'Pregrado' | 'Grado' | 'Posgrado';

interface Carrera {
  id: number;
  nombre: string;
  tipo: TipoCarrera;
  planestudio: string;
  sitio: string;
  estado: 0 | 1;
}

const ListaCarreras = () => {
  const router = useRouter(); // Usamos useRouter de Next.js
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [filtroPlanEstudio, setFiltroPlanEstudio] = useState('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(`${API_BASE_URL}/facet/carrera/`);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setCarreras(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarCarreras = () => {
    let url = `${API_BASE_URL}/facet/carrera/?`;
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
    if (filtroPlanEstudio !== '') {
      params.append('planestudio__icontains', filtroPlanEstudio);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const descargarExcel = async () => {
    try {
      let allCarreras: Carrera[] = [];

      let url = `${API_BASE_URL}/facet/carrera/?`;
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
      if (filtroPlanEstudio !== '') {
        params.append('planestudio__icontains', filtroPlanEstudio);
      }
      url += params.toString();

      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;

        allCarreras = [...allCarreras, ...results];
        url = next;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allCarreras);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Carreras');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'carreras.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <DashboardMenu>
    <Container maxWidth="md">
      <div>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/careers/create')} // Navegación a la página de creación
        >
          Agregar Carrera
        </Button>
        <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
          Descargar Excel
        </Button>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Carreras
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
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                label="Tipo"
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value="Pregrado">Pregrado</MenuItem>
                <MenuItem value="Grado">Grado</MenuItem>
                <MenuItem value="Posgrado">Posgrado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                label="Estado"
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
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
                <TableCell className='header-cell'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carreras.map(carrera => (
                <TableRow key={carrera.id}>
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
                    <Button onClick={() => router.push(`/dashboard/careers/asignaturaCarrera/${carrera.id}`)}>
                      <NoteAltIcon />
                    </Button>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography variant="body1">{carrera.estado}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => router.push(`/dashboard/careers/edit/${carrera.id}`)}>
                      <EditIcon />
                    </Button>
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

export default withAuth(ListaCarreras);
