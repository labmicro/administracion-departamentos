import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Departamento {
  id: number;
  nombre: string;
  telefono: string;
  estado: 0 | 1;
  interno: string;
}

const ListaDepartamentos = () => {
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

      // Usar la URL de filtrado actual si hay un filtro aplicado
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

      // Iterar hasta que no haya más páginas
      while (url) {
        const response = await axios.get(url);
        const { results, next } = response.data;

        allDepartamentos = [...allDepartamentos, ...results];
        url = next; // Actualizar la URL para la siguiente página
      }

      // Crear un libro de Excel
      const workbook = XLSX.utils.book_new();

      // Convertir los datos en una hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(allDepartamentos);

      // Agregar la hoja de cálculo al libro de Excel
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Departamentos');

      // Generar un archivo Excel (blob)
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Guardar el archivo usando file-saver
      saveAs(excelBlob, 'departamentos.xlsx');
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <div>
        <Link to="/dashboard/departamentos/crear">
          <Button variant="contained" endIcon={<AddIcon />}>
            Agregar Departamento
          </Button>
        </Link>

        <Link to="/dashboard/departamentos/jefes">
          <Button variant="contained" color='info' style={{ marginLeft: '10px' }}>
            Jefes
          </Button>
        </Link>

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
              label="Telefono"
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
                  <Typography variant="subtitle1">Telefono</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Estado</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                  <Typography variant="subtitle1">Interno</Typography>
                </TableCell>
                <TableCell className='header-cell'>
                </TableCell>
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
                    <Link to={`/dashboard/departamentos/editar/${departamento.id}`}>
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

export default ListaDepartamentos;
