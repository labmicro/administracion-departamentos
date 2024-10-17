import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Link from 'next/link';

const ListaDocentes = () => {
  const h1Style = {
    color: 'black',
  };

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
  }

  interface Docente {
    id: number;
    persona: number;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
  }

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroLegajo, setFiltroLegajo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>(''); 
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('http://127.0.0.1:8000/facet/docente/');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setDocentes(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(1);

      const personasResponse = await axios.get('http://127.0.0.1:8000/facet/persona/');
      setPersonas(personasResponse.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarDocentes = () => {
    let url = `http://127.0.0.1:8000/facet/docente/?`;
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(docentes.map((docente) => {
      const persona = personas.find((p) => p.id === docente.persona);
      return {
        Nombre: persona?.nombre || '',
        Apellido: persona?.apellido || '',
        DNI: persona?.dni || '',
        Legajo: persona?.legajo || '',
        Observaciones: docente.observaciones,
        Estado: docente.estado === 1 ? 'Activo' : 'Inactivo',
      };
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Docentes');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'docentes.xlsx');
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Container maxWidth="lg">
      <div>
        <Link href="/dashboard/personas/docentes/crear">
          <Button variant="contained" endIcon={<AddIcon />}>
            Agregar Docente
          </Button>
        </Link>
        <Button
          variant="contained"
          color="secondary"
          onClick={exportToExcel}
          style={{ marginLeft: '16px' }}
        >
          Exportar a Excel
        </Button>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Docentes
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
            <Button variant="contained" onClick={filtrarDocentes}>
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
              {docentes.map((docente) => {
                const persona = personas.find((p) => p.id === docente.persona);

                if (!persona) {
                  return null; // Si la persona no se encuentra, omite este docente
                }

                return (
                  <TableRow key={docente.id}>
                    <TableCell>{persona.nombre}</TableCell>
                    <TableCell>{persona.apellido}</TableCell>
                    <TableCell>{persona.dni}</TableCell>
                    <TableCell>{persona.legajo}</TableCell>
                    <TableCell>{docente.observaciones}</TableCell>
                    <TableCell>{docente.estado === 1 ? 'Activo' : 'Inactivo'}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/personas/docentes/editar/${docente.id}`}>
                        <EditIcon />
                      </Link>
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
  );
};

export default ListaDocentes;
