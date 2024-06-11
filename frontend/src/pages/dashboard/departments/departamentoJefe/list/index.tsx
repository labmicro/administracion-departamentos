import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

const ListaDepartamentosJefe = () => {
  const h1Style = {
    color: 'black',
  };

  interface Departamento {
    iddepartamento: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    interno: string;
    // Otros campos según sea necesario
  }

  interface Resolucion {
    idresolucion: number;
    nexpediente: string;
    nresolucion: string;
    tipo: string;
    fechadecarga: Date;
    fecha: Date; // Aquí indicas que 'fecha' es de tipo Date
    adjunto:string;
    observaciones:string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Persona {
    idpersona: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    email: string;
    interno: string;
    legajo: string;
    // Otros campos según sea necesario
  }

  interface Departamento {
    iddepartamento: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    interno: string;
    // Otros campos según sea necesario
  }

  interface DepartamentoJefe {
    iddepartamento: number;
    idpersona: number;
    idresolucion: number;
    fecha_de_creacion: Date;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamentosFiltro, setDepartamentosFiltro] = useState<Departamento[]>([]);
  const [deptoJefes,setDeptoJefes] = useState<DepartamentoJefe[]>([]);
  const [deptoJefesFiltro,setDeptoJefesFiltro] = useState<DepartamentoJefe[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRes = await axios.get('http://127.0.0.1:8000/facet/api/v1/resoluciones/');
        const responsePers = await axios.get('http://127.0.0.1:8000/facet/api/v1/personas/');
        const responseDeptos = await axios.get('http://127.0.0.1:8000/facet/api/v1/departamentos/');
        const responseDeptoJefes = await axios.get('http://127.0.0.1:8000/facet/api/v1/departamentos-tiene-jefe/');
        setResoluciones(responseRes.data);
        setPersonas(responsePers.data);
        setDepartamentos(responseDeptos.data);
        setDeptoJefes(responseDeptoJefes.data)
        setDeptoJefesFiltro(responseDeptoJefes.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, []);

    const paginationContainerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '16px 0', // Puedes ajustar según sea necesario
    };
    
    const buttonStyle = {
      marginLeft: '8px', // Puedes ajustar según sea necesario
    };

    // --Paginado
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = deptoJefesFiltro.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(deptoJefes.length / itemsPerPage);

    const handleChangePage = (newPage: number) => {
      setCurrentPage(newPage);
    };
    

    const filtrarDepartamentos = () => {

      // Implementa la lógica de filtrado aquí usando los estados de los filtros
      // Puedes utilizar resoluciones.filter(...) para filtrar el array según los valores de los filtros
      // Luego, actualiza el estado de resoluciones con el nuevo array filtrado

      // Aplica la lógica de filtrado aquí utilizando la función filter
      const departamentosJefeFiltrados = deptoJefes.filter((departamentoJefe) => {
        // Aplica condiciones de filtrado según los valores de los filtros

        const departamentoAsociado = departamentos.find((departamento)=> departamento.iddepartamento === departamentoJefe.iddepartamento)
        console.log(departamentoAsociado)
        const cumpleNombre = departamentoAsociado?.nombre.toLowerCase().includes(filtroNombre.toLowerCase());

        // Retorn true si la resolución cumple con todas las condiciones de filtrado
        return cumpleNombre
        // && cumpleNroResolucion && cumpleTipo && cumpleFecha && cumpleEstado;
      });

      // Actualiza el estado de resoluciones con el nuevo array filtrado
      setDeptoJefesFiltro(departamentosJefeFiltrados);
      setCurrentPage(1);
    };

  return (
    <Container maxWidth="lg">
      <div>

      <Link to="/dashboard/departamentos/jefes/crear"> {/* Agrega un enlace a la página deseada */}
      <Button variant="contained" endIcon={<AddIcon />}>
        Agregar Jefe
      </Button>
      </Link>

      </div>

<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
<Typography variant="h4" gutterBottom>
  Jefes de Departamentos
</Typography>

<Grid container spacing={2}marginBottom={2}>
      <Grid item xs={4}>
        <TextField
          label="Nombre Departamento"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarDepartamentos}>
          Filtrar
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>

<TableContainer component={Paper}>
<Table>
  <TableHead>
    <TableRow className='header-row'>
      {/* <TableCell className='header-cell'>
        <Typography variant="subtitle1">Id</Typography>
      </TableCell> */}
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Nombre</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Departamento</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Resolucion</Typography>
      </TableCell>
      <TableCell className='header-cell'>
        <Typography variant="subtitle1">Estado</Typography>
      </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
        <TableCell className='header-cell'>
        </TableCell>
      {/* Agrega otras columnas de encabezado según sea necesario */}
    </TableRow>
  </TableHead>
  <TableBody>
  {currentItems.map((departamentojefe) => {
    // Buscar la persona con el idpersona correspondiente
    const personaAsociada = personas.find((persona) => persona.idpersona === departamentojefe.idpersona);
    const departamentoAsociado = departamentos.find((departamento)=> departamento.iddepartamento === departamentojefe.iddepartamento)
    const resolucionAsociada = resoluciones.find((resolucion)=> resolucion.idresolucion === departamentojefe.idresolucion)

    return (
      <TableRow key={departamentojefe.iddepartamento}>

        <TableCell>
          {/* Mostrar el nombre de la persona si se encuentra */}
          <Typography variant="body1">{personaAsociada ? `${personaAsociada.nombre} ${personaAsociada.apellido}` : 'No disponible'}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{departamentoAsociado?.nombre}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{resolucionAsociada?.nresolucion}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{departamentojefe.estado}</Typography>
        </TableCell>
        <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <Tooltip title={departamentojefe.observaciones}>
              <VisibilityIcon/>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Link to={`/dashboard/departamentos/jefes/editar/${departamentojefe.iddepartamento}`}>
            <EditIcon />
            </Link>
          </TableCell>
      </TableRow>
    );
  })}
</TableBody>
</Table>
</TableContainer>
</Paper>
<div style={paginationContainerStyle}>
        <Typography>Página {currentPage} de {totalPages}</Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            style={buttonStyle}
          >
            Anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={buttonStyle}
          >
            Siguiente
          </Button>
        </div>
      </div>
</Container>
  );
};

export default ListaDepartamentosJefe;