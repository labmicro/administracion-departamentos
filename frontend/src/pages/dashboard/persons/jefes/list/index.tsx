import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router';
import DashboardMenu from '../../../../dashboard';
import withAuth from "../../../../../components/withAut"; 
import { API_BASE_URL } from "../../../../../utils/config";



const ListaJefes = () => {
  const router = useRouter();

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

  interface Jefe {
    id: number;
    persona: Persona;
    observaciones: string;
    estado: 0 | 1;
  }

  const [jefes, setJefes] = useState<Jefe[]>([]);
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroLegajo, setFiltroLegajo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(`${API_BASE_URL}/facet/jefe/list_jefes_persona/`);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setJefes(response.data.results);
      // Actualiza los valores de paginación
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count)
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarJefes = () => {
    let url = `${API_BASE_URL}/facet/jefe/list_jefes_persona/?`;
    const params = new URLSearchParams();
    if (filtroNombre !== '') {
      params.append('persona__nombre__icontains', filtroNombre);
    }
    if (filtroDni !== '') {
      params.append('persona__dni__icontains', filtroDni);
    }
    if (filtroEstado !== '') {
      params.append('estado', filtroEstado.toString());
    }
    if (filtroApellido !== '') {
      params.append('persona__apellido__icontains', filtroApellido);
    }
    if (filtroLegajo !== '') {
      params.append('persona__legajo__icontains', filtroLegajo);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  const exportToExcel = async () => {
    try {
      let allJefes: Jefe[] = [];
      let url = `${API_BASE_URL}/facet/jefe/?`;
      const params = new URLSearchParams();
  
      if (filtroNombre !== '') {
        params.append('persona__nombre__icontains', filtroNombre);
      }
      if (filtroDni !== '') {
        params.append('persona__dni__icontains', filtroDni);
      }
      if (filtroEstado !== '') {
        params.append('estado', filtroEstado.toString());
      }
      if (filtroApellido !== '') {
        params.append('persona__apellido__icontains', filtroApellido);
      }
      if (filtroLegajo !== '') {
        params.append('persona__legajo__icontains', filtroLegajo);
      }
      url += params.toString();
  
      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;
  
        // Obtener los detalles completos de cada persona
        const detailedJefes = await Promise.all(
          results.map(async (jefe: any) => {
            // Solicitar los detalles de la persona si `persona` es solo un ID
            if (typeof jefe.persona === 'number') {
              const personaResponse = await axios.get(`${API_BASE_URL}/facet/persona/${jefe.persona}/`);
              jefe.persona = personaResponse.data; // Asignar detalles completos a `jefe.persona`
            }
            return jefe;
          })
        );
  
        allJefes = [...allJefes, ...detailedJefes];
        url = next;
      }
  
      // Crear el archivo Excel con los datos obtenidos
      const ws = XLSX.utils.json_to_sheet(
        allJefes.map((jefe) => ({
          Nombre: jefe.persona.nombre,
          Apellido: jefe.persona.apellido,
          DNI: jefe.persona.dni,
          Legajo: jefe.persona.legajo,
          Observaciones: jefe.observaciones,
          Estado: jefe.estado === 1 ? 'Activo' : 'Inactivo',
        }))
      );
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Jefes');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'jefes.xlsx');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    }
  };
  


  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <div>
        <Button variant="contained" endIcon={<AddIcon />} onClick={() => router.push('/dashboard/persons/jefes/create')}>
          Agregar Jefe
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          style={{ marginLeft: '16px' }}
        >
          Descargar Excel
        </Button>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Jefes
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
            <Button variant="contained" onClick={filtrarJefes}>
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
              {jefes.map((jefe) => (
                <TableRow key={jefe.id}>
                  <TableCell>{jefe.persona.nombre}</TableCell>
                  <TableCell>{jefe.persona.apellido}</TableCell>
                  <TableCell>{jefe.persona.dni}</TableCell>
                  <TableCell>{jefe.persona.legajo}</TableCell>
                  <TableCell>{jefe.observaciones}</TableCell>
                  <TableCell>{jefe.estado}</TableCell>
                  <TableCell>
                    <Button onClick={() => router.push(`/dashboard/persons/jefes/edit/${jefe.id}`)}>
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

export default withAuth(ListaJefes);
