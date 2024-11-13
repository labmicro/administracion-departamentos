import React, { useState, useEffect } from 'react';
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
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js
import DashboardMenu from '../..';

interface Departamento {
  id: number;
  nombre: string;
  telefono: string;
  estado: 0 | 1;
  interno: string;
}

const ListaDepartamentos = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [filtroTelefono, setFiltroTelefono] = useState('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('http://127.0.0.1:8000/facet/departamento/');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setDepartamentos(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalItems(response.data.count);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filtrarDepartamentos = () => {
    let url = `http://127.0.0.1:8000/facet/departamento/?`;
    const params = new URLSearchParams();
    if (filtroNombre !== '') {
      params.append('nombre__icontains', filtroNombre);
    }
    if (filtroEstado !== '') {
      params.append('estado', filtroEstado.toString());
    }
    if (filtroTelefono !== '') {
      params.append('telefono__icontains', filtroTelefono);
    }
    url += params.toString();
    setCurrentUrl(url);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const descargarExcel = async () => {
    try {
      let allDepartamentos: Departamento[] = [];
  
      let url = `http://127.0.0.1:8000/facet/departamento/?`;
      const params = new URLSearchParams();
      if (filtroNombre !== '') {
        params.append('nombre__icontains', filtroNombre);
      }
      if (filtroEstado !== '') {
        params.append('estado', filtroEstado.toString());
      }
      if (filtroTelefono !== '') {
        params.append('telefono__icontains', filtroTelefono);
      }
      url += params.toString();
  
      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;
  
        allDepartamentos = [
          ...allDepartamentos,
          ...results.map((departamento: any) => ({
            nombre: departamento.nombre,
            telefono: departamento.telefono,
            estado: departamento.estado,
            interno: departamento.interno,
          })),
        ];
        url = next;
      }
  
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allDepartamentos);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Departamentos');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'departamentos.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };
  

  return (
    <DashboardMenu>
    <Container maxWidth="lg">
      <div>
        <Button variant="contained" endIcon={<AddIcon />} onClick={() => router.push('/dashboard/departments/create')}>
          Agregar Departamento
        </Button>
        <Button variant="contained" color="info" style={{ marginLeft: '10px' }} onClick={() => router.push('/dashboard/departments/departamentoJefe')}>
          Jefes
        </Button>
        <Button variant="contained" color="primary" onClick={descargarExcel} style={{ marginLeft: '10px' }}>
          Descargar Excel
        </Button>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Departamentos
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
              label="Teléfono"
              value={filtroTelefono}
              onChange={(e) => setFiltroTelefono(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <Button variant="contained" onClick={filtrarDepartamentos}>
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
                  <Typography variant="subtitle1">Teléfono</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Estado</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Interno</Typography>
                </TableCell>
                <TableCell className='header-cell'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departamentos.map(departamento => (
                <TableRow key={departamento.id}>
                  <TableCell>
                    <Typography variant="body1">{departamento.nombre}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{departamento.telefono}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{departamento.estado}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{departamento.interno}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => router.push(`/dashboard/departments/edit/${departamento.id}`)}>
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

export default ListaDepartamentos;
