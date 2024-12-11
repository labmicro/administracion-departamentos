import { useEffect, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router'; 
import DashboardMenu from '../../../../dashboard';
import withAuth from '../../../../../components/withAut'; 
import { API_BASE_URL } from '../../../../../utils/config';

const ListaNoDocentes = () => {
  const router = useRouter();

  interface NoDocente {
    id: number;
    persona_detalle: {
      id: number;
      nombre: string;
      apellido: string;
      dni: string;
      legajo: string;
    };
    observaciones: string;
    estado: 0 | 1;
  }

  const [NoDocentes, setNoDocentes] = useState<NoDocente[]>([]);
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroLegajo, setFiltroLegajo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(`${API_BASE_URL}/facet/nodocente/`);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setNoDocentes(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(response.data.page || 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarNoDocentes = () => {
    let url = `${API_BASE_URL}/facet/nodocente/?`;
    const params = new URLSearchParams();
    if (filtroNombre) params.append('persona__nombre__icontains', filtroNombre);
    if (filtroApellido) params.append('persona__apellido__icontains', filtroApellido);
    if (filtroDni) params.append('persona__dni__icontains', filtroDni);
    if (filtroLegajo) params.append('persona__legajo__icontains', filtroLegajo);
    if (filtroEstado) params.append('estado', filtroEstado.toString());
    url += params.toString();
    setCurrentUrl(url);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(NoDocentes.map((noDocente) => ({
      Nombre: noDocente.persona_detalle?.nombre || '',
      Apellido: noDocente.persona_detalle?.apellido || '',
      DNI: noDocente.persona_detalle?.dni || '',
      Legajo: noDocente.persona_detalle?.legajo || '',
      Observaciones: noDocente.observaciones,
      Estado: noDocente.estado === 1 ? 'Activo' : 'Inactivo',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NoDocentes');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'nodocentes.xlsx');
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <DashboardMenu>
      <Container maxWidth="lg">
        <Button variant="contained" endIcon={<AddIcon />} onClick={() => router.push('/dashboard/persons/noDocentes/create')}>
          Agregar No Docente
        </Button>
        <Button variant="contained" color="primary" onClick={exportToExcel} style={{ marginLeft: '16px' }}>
          Exportar a Excel
        </Button>

        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            No Docentes
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
              <Button variant="contained" onClick={filtrarNoDocentes}>
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
                    <Typography variant="subtitle1">Apellido</Typography>
                  </TableCell>
                  <TableCell className='header-cell'>
                    <Typography variant="subtitle1">DNI</Typography>
                  </TableCell>
                  <TableCell className='header-cell'>
                    <Typography variant="subtitle1">Legajo</Typography>
                  </TableCell>
                  <TableCell className='header-cell'>
                    <Typography variant="subtitle1">Observaciones</Typography>
                  </TableCell>
                  <TableCell className='header-cell'>
                    <Typography variant="subtitle1">Estado</Typography>
                  </TableCell>
                  <TableCell className='header-cell'>
                    <Typography variant="subtitle1">Acciones</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {NoDocentes.map((NoDocente) => (
                  <TableRow key={NoDocente.id}>
                    <TableCell>{NoDocente.persona_detalle?.nombre}</TableCell>
                    <TableCell>{NoDocente.persona_detalle?.apellido}</TableCell>
                    <TableCell>{NoDocente.persona_detalle?.dni}</TableCell>
                    <TableCell>{NoDocente.persona_detalle?.legajo}</TableCell>
                    <TableCell>{NoDocente.observaciones}</TableCell>
                    <TableCell>{NoDocente.estado === 1 ? 'Activo' : 'Inactivo'}</TableCell>
                    <TableCell>
                      <Button onClick={() => router.push(`/dashboard/persons/noDocentes/edit/${NoDocente.id}`)}>
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

export default withAuth(ListaNoDocentes);
