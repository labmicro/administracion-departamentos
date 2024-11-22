import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Button, InputLabel, Select, MenuItem, FormControl, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link'; // Cambiado para usar Link de Next.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DashboardMenu from '../../../../dashboard';
import dayjs from 'dayjs';
import withAuth from "../../../../../components/withAut"; 


const ListaDepartamentosJefe = () => {
  const h1Style = {
    color: 'black',
  };

  interface Departamento {
    id: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1;
  }

  interface Resolucion {
    id: number;
    nexpediente: string;
    nresolucion: string;
    tipo: string;
    fechadecarga: string; // Actualizado de Date a string
    fecha: string; // Actualizado de Date a string
    adjunto: string;
    observaciones: string;
    estado: 0 | 1;
  }

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

  interface DepartamentoJefe {
    id: number;
    jefe: Jefe; // Cambiado de number a Jefe
    departamento: Departamento;
    resolucion: Resolucion;
    fecha_de_inicio: string; // Actualizado de Date a string
    fecha_de_fin: string | null; // Actualizado de Date a string | null
    observaciones: string;
    estado: 0 | 1;
  }

  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [deptoJefes, setDeptoJefes] = useState<DepartamentoJefe[]>([]);
  console.log(deptoJefes)
  const [jefes, setJefes] = useState<Jefe[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroLegajo, setFiltroLegajo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [filtroDepartamento, setFiltroDepartamento] = useState<string | ''>('');
  const [filtroResolucion, setFiltroResolucion] = useState<string | ''>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('http://127.0.0.1:8000/facet/jefe-departamento/list_detalle/');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setDeptoJefes(response.data);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(1);

      const personasResponse = await axios.get('http://127.0.0.1:8000/facet/persona/');
      setPersonas(personasResponse.data.results);
      const departamentosResponse = await axios.get('http://127.0.0.1:8000/facet/departamento/');
      setDepartamentos(departamentosResponse.data.results);
      const resolucionesResponse = await axios.get('http://127.0.0.1:8000/facet/resolucion/');
      setResoluciones(resolucionesResponse.data.results);
      const jefesResponse = await axios.get('http://127.0.0.1:8000/facet/jefe/list_jefes_persona/');
      setJefes(jefesResponse.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarJefesDepartamentos = () => {
    let url = `http://127.0.0.1:8000/facet/jefe-departamento/?`;
    const params = new URLSearchParams();
    if (filtroNombre !== '') {
      params.append('jefe__persona__nombre__icontains', filtroNombre);
    }
    if (filtroDni !== '') {
      params.append('jefe__persona__dni__icontains', filtroDni);
    }
    if (filtroEstado !== '') {
      params.append('jefe__estado', filtroEstado.toString());
    }
    if (filtroApellido !== '') {
      params.append('jefe__persona__apellido__icontains', filtroApellido);
    }
    if (filtroLegajo !== '') {
      params.append('jefe__persona__legajo__icontains', filtroLegajo);
    }
    if (filtroDepartamento !== '') {
      params.append('departamento__nombre__icontains', filtroDepartamento);
    }
    if (filtroResolucion !== '') {
      params.append('resolucion__nresolucion__icontains', filtroResolucion);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  
const descargarExcel = async () => {
  try {
    let allDeptoJefes: DepartamentoJefe[] = [];

    // Usa la URL personalizada para obtener los detalles de jefe con la información completa
    let url = `http://127.0.0.1:8000/facet/jefe-departamento/list_detalle/`;

    while (url) {
      const response = await axios.get(url);
      const data = response.data;  // Asumimos que data es un array directamente
      console.log(data);

      // Mapea los resultados, asegurando que `nombre` y `apellido` estén disponibles
      allDeptoJefes = [
        ...allDeptoJefes,
        ...data.map((item: any) => ({
          ...item,
          jefe: {
            persona: {
              nombre: item.jefe.persona.nombre,
              apellido: item.jefe.persona.apellido,
            },
          },
          fecha_de_inicio: formatFecha(item.fecha_de_inicio),
          fecha_de_fin: item.fecha_de_fin ? formatFecha(item.fecha_de_fin) : 'N/A',
        })),
      ];

      // Aquí, asegúrate de actualizar `url` si la respuesta proporciona una paginación con `next`
      url = response.data.next; // Cambiar esta línea si `next` se encuentra en otro nivel
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      allDeptoJefes.map((item) => ({
        'Nombre': item.jefe.persona.nombre,
        'Apellido': item.jefe.persona.apellido,
        'Departamento': item.departamento.nombre,
        'Resolución': item.resolucion.nresolucion,
        'Fecha de Inicio': item.fecha_de_inicio,
        'Fecha de Fin': item.fecha_de_fin,
        'Estado': item.estado === 1 ? 'Activo' : 'Inactivo',
        'Observaciones': item.observaciones,
      }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Departamento Jefes');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'departamento_jefes.xlsx');
  } catch (error) {
    console.error('Error downloading Excel:', error);
  }
};

  const formatFecha = (fecha: string) => dayjs(fecha).format('DD-MM-YYYY');

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <div>
        <Link href="/dashboard/departments/departamentoJefe/create" passHref>
          <Button variant="contained" endIcon={<AddIcon />}>
            Agregar Jefe
          </Button>
        </Link>
        <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
          Descargar Excel
        </Button>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Jefes Departamentos
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
            <TextField
              label="Departamento"
              value={filtroDepartamento}
              onChange={(e) => setFiltroDepartamento(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <TextField
              label="Resolución"
              value={filtroResolucion}
              onChange={(e) => setFiltroResolucion(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <Button variant="contained" onClick={filtrarJefesDepartamentos}>
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
                  <Typography variant="subtitle1">Departamento</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Resolución</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Fecha de Inicio</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Fecha de Fin</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Estado</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Observaciones</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1"></Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deptoJefes.map((deptoJefe) => (
                <TableRow key={deptoJefe.id}>
                  <TableCell>{deptoJefe.jefe.persona.nombre}</TableCell>
                  <TableCell>{deptoJefe.jefe.persona.apellido}</TableCell>
                  <TableCell>{deptoJefe.departamento.nombre}</TableCell>
                  <TableCell>{deptoJefe.resolucion.nresolucion}</TableCell>
                  <TableCell>{formatFecha(deptoJefe.fecha_de_inicio)}</TableCell>
                  <TableCell>{deptoJefe.fecha_de_fin ? formatFecha(deptoJefe.fecha_de_fin) : '-'}</TableCell>
                  <TableCell>{deptoJefe.estado === 1 ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <Tooltip title={deptoJefe.observaciones}>
                      <VisibilityIcon/>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <Link href={`/dashboard/departments/departamentoJefe/edit/${deptoJefe.id}`} passHref>
                        <EditIcon />
                      </Link>
                    </Tooltip>
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

export default withAuth(ListaDepartamentosJefe);
