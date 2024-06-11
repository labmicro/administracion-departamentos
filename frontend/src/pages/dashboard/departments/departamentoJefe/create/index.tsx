import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import { Link, useNavigate} from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearDepartamentoJefe = () => {
  const h1Style = {
    color: 'black',
  };

  const navigate = useNavigate();

  
  interface DepartamentoJefe {
    idDepartamento: number;
    idPersona: number;
    idResolucion: number;
    fechadecarga: Date;
    fechaModificacion: Date; // Aquí indicas que 'fecha' es de tipo Date
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
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

  const fechaActual = new Date();
  const [idresolucion, setIdresolucion] = useState<number>(0); 
  const [idPersona, setIdPersona] = useState<number>(0); 
  const [idDepartamento, setIdDepartamento] = useState<number>(0); 
  const [NroResolucion, SetNroResolucion] = useState('');
  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [apellido, SetApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [filtroResolucion, setFiltroResolucion] = useState('');
  const [filtroPersonas, setFiltroPersonas] = useState('');
  const [filtroDeptos, setFiltroDeptos] = useState('');
  const [openResolucion, setOpenResolucion] = useState(false);
  const [openDeptos, setOpenDeptos] = useState(false);
  const [openPersona, setOpenPersona] = useState(false);
  const [nombre, setNombre] = useState('');
  const [nombreDepto, setNombreDepto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  

  const handleOpenModal = (title: string, message: string, onConfirm: () => void) => {
    setModalTitle(title); // Establecer el título del modal
    setModalMessage(message);
    setModalVisible(true);
    setFn(() => onConfirm);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const handleConfirmModal = () => {
    navigate('/dashboard/departamentos/jefes/');
  };

  const handleOpenPersona = () => {
    setOpenPersona(true);
  };

  const handleOpenDepto = () => {
    setOpenDeptos(true);
  };

  const handleOpenResolucion = () => {
    setOpenResolucion(true);
  };

  const handleClose = () => {
    setOpenPersona(false);
    setOpenResolucion(false);
    setOpenDeptos(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRes = await axios.get('http://127.0.0.1:8000/facet/api/v1/resoluciones/');
        const responsePers = await axios.get('http://127.0.0.1:8000/facet/api/v1/personas/');
        const responseDeptos = await axios.get('http://127.0.0.1:8000/facet/api/v1/departamentos/');
        setResoluciones(responseRes.data);
        setPersonas(responsePers.data);
        setDepartamentos(responseDeptos.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, []);

  const handleConfirmSelection = () => {
    // Realiza la lógica necesaria con idResolucionSeleccionada
    console.log('ID de la resolución seleccionada:', idresolucion);
    console.log('ID de la persona seleccionada:', idPersona);
    console.log('ID del depto seleccionada:', idDepartamento);

    // Luego, cierra el modal
    handleClose();
  };

  const handleFilterResoluciones = (filtro: string) => {
    // Lógica para filtrar las resoluciones según el término de búsqueda
    const resolucionesFiltradas = resoluciones.filter((resolucion) =>
      resolucion.nexpediente.includes(filtro)||
      resolucion.nresolucion.includes(filtro)
    );
    return resolucionesFiltradas;
  };

  const handleFilterPersonas = (filtro: string) => {
    // Lógica para filtrar las resoluciones según el término de búsqueda
    const personasFiltro = personas.filter((persona) =>
      persona.dni.includes(filtro)||
      (persona.legajo ?? '').includes(filtro)||
      persona.nombre.toLowerCase().includes(filtro.toLowerCase())||
      persona.apellido.toLowerCase().includes(filtro.toLowerCase())
    );
    return personasFiltro;
  };

  const handleFilterDeptos = (filtro: string) => {
    // Lógica para filtrar las resoluciones según el término de búsqueda
    const departamentosFiltro = departamentos.filter((departamento) =>
      departamento.nombre.toLowerCase().includes(filtro.toLowerCase()));
    return departamentosFiltro;
  };

  const crearNuevoJefeDepartamento= async () => {


    const nuevoJefeDepartamento= {
      iddepartamento: idDepartamento,
      idpersona: idPersona,
      idresolucion: idresolucion,
      fecha_de_creacion: fechaActual,
      observaciones: observaciones,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };


    try {
      // Verificar si ya existe un registro con el mismo iddepartamento
      const existeRegistro = await axios.get(`http://127.0.0.1:8000/facet/api/v1/departamentos-tiene-jefe/${idDepartamento}`);
      console.log(existeRegistro);
      if (existeRegistro.data) {
        // No hay registros existentes, puedes proceder con la creación
        handleOpenModal('Error', 'Ya existe jefe departamento', () => {});
      }
    
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        // Maneja el error 404 sin detener el flujo principal
        const response = await axios.post('http://127.0.0.1:8000/facet/api/v1/departamentos-tiene-jefe/', nuevoJefeDepartamento, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        handleOpenModal('Bien', 'Se creó el jefe de departamento con éxito', handleConfirmModal);
      } else {
        // Maneja otros errores
        console.error(error);
        handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
      }
    }
    
  
    };

  return (
    
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Agregar Jefe Departamento
  </Typography>


  {/* Agrega controles de entrada y botones para los filtros */}
  <Grid container spacing={2}>

      {/* Seleccionar resolucion */}
      <Grid item xs={4}> 
      <Button variant="contained" onClick={handleOpenResolucion}>
        Seleccionar Resolución
      </Button>

      {/* Modal para seleccionar resolución */}
      <Dialog open={openResolucion} onClose={handleClose} maxWidth="md" fullWidth >
        {/* Filtrar resoluciones */}
        <TextField
          label="Buscar Resolución o Expediente"
          value={filtroResolucion}
          onChange={(e) => setFiltroResolucion(e.target.value)}
          fullWidth
        />

        {/* Mostrar lista de resoluciones */}
        {handleFilterResoluciones(filtroResolucion).map((resolucion) => (
          <div key={resolucion.idresolucion}>
            {/* Puedes agregar más detalles o botones según tus necesidades */}
            <Button
              onClick={() => {setIdresolucion(resolucion.idresolucion);SetNroResolucion(resolucion.nresolucion)}}
              style={{ backgroundColor: resolucion.idresolucion === idresolucion ? '#4caf50' : 'inherit', color: resolucion.idresolucion === idresolucion ? 'white' : 'inherit' }}
            >
              N° Resolución {resolucion.nresolucion} - N° Expediente {resolucion.nexpediente}
            </Button>
          </div>
        ))}

        {/* Botón de confirmación para cerrar el modal y realizar la acción */}
        <Button variant="contained" onClick={handleConfirmSelection}>
          Confirmar Selección
        </Button>
      </Dialog>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="N° Resolución"
          value={NroResolucion}
          fullWidth
        />
      </Grid>

      <Grid item xs={4}>
      <Button variant="contained" onClick={handleOpenPersona}>
        Seleccionar Persona
      </Button>

      {/* Modal para seleccionar resolución */}
      <Dialog open={openPersona} onClose={handleClose} maxWidth="md" fullWidth >
        {/* Filtrar resoluciones */}
        <TextField
          label="Buscar por DNI , Apellido o Legajo"
          value={filtroPersonas}
          onChange={(e) => setFiltroPersonas(e.target.value)}
          fullWidth
        />

        {/* Mostrar lista de resoluciones */}
        {handleFilterPersonas(filtroPersonas).map((persona) => (
          <div key={persona.idpersona}>
            {/* Puedes agregar más detalles o botones según tus necesidades */}
            <Button
              onClick={() => {setIdPersona(persona.idpersona);SetApellido(persona.apellido);SetDni(persona.dni),setNombre(persona.nombre)}}
              style={{ backgroundColor: persona.idpersona=== idPersona ? '#4caf50' : 'inherit', color: persona.idpersona === idPersona ? 'white' : 'inherit' }}
            >
              DNI {persona.dni} - {persona.apellido} {persona.nombre} - Legajo {persona.legajo}
            </Button>
          </div>
        ))}

        {/* Botón de confirmación para cerrar el modal y realizar la acción */}
        <Button variant="contained" onClick={handleConfirmSelection}
            style={{
              marginTop: 'auto',
              marginBottom: '10px',
              position: 'sticky',
              bottom: 0,
              // backgroundColor: , // Ajusta el fondo según tus necesidades
            }}>
          Confirmar Selección
        </Button>
      </Dialog>
      </Grid>      
    
      <Grid item xs={12}>
        <TextField
          label="DNI"
          value={dni}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          // label="Apellido y Nombre"
          value={`${apellido} ${nombre}`}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
      <Button variant="contained" onClick={handleOpenDepto}>
        Seleccionar Departamento
      </Button>

      {/* Modal para seleccionar resolución */}
      <Dialog open={openDeptos} onClose={handleClose} maxWidth="md" fullWidth >
        {/* Filtrar resoluciones */}
        <TextField
          label="Buscar por Departamento"
          value={filtroDeptos}
          onChange={(e) => setFiltroDeptos(e.target.value)}
          fullWidth
        />

        {/* Mostrar lista de resoluciones */}
        {handleFilterDeptos(filtroDeptos).map((departamento) => (
          <div key={departamento.iddepartamento}>
            {/* Puedes agregar más detalles o botones según tus necesidades */}
            <Button
              onClick={() => {setIdDepartamento(departamento.iddepartamento);setNombreDepto(departamento.nombre)}}
              style={{ backgroundColor: departamento.iddepartamento=== idDepartamento ? '#4caf50' : 'inherit', color: departamento.iddepartamento === idDepartamento ? 'white' : 'inherit' }}
            >
              {departamento.nombre}
            </Button>
          </div>
        ))}

        {/* Botón de confirmación para cerrar el modal y realizar la acción */}
        <Button variant="contained" onClick={handleConfirmSelection}
            style={{
              marginTop: 'auto',
              marginBottom: '10px',
              position: 'sticky',
              bottom: 0,
              // backgroundColor: , // Ajusta el fondo según tus necesidades
            }}>
          Confirmar Selección
        </Button>
      </Dialog>
      </Grid>     
      <Grid item xs={12}>
        <TextField
          label="Departamento"
          value={nombreDepto}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
      <FormControl fullWidth margin="none">
          <InputLabel id="demo-simple-select-label">Estado </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={estado}
            label="Tipo"
            onChange={(e) => setEstado(e.target.value)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={0}>0</MenuItem>
          </Select>
        </FormControl>
        </Grid>
      <Grid item xs={12} marginBottom={2}>
        <Button variant="contained" onClick={crearNuevoJefeDepartamento}>
          Crear
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>
    <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />

</Paper>
</Container>
  );
};

export default CrearDepartamentoJefe;