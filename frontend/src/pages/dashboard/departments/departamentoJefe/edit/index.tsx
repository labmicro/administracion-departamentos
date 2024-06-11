import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import dayjs from 'dayjs';  // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import Dialog from '@mui/material/Dialog';
import ModalConfirmacion from '@/utils/modalConfirmacion';
import { Link, useParams ,useNavigate } from 'react-router-dom';

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const EditarDepartamentoJefe : React.FC = () => {

  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState(''); // Nuevo estado para el título del modal
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [fn, setFn] = useState(() => () => {});

  
  const handleOpenModal = (title: string, message: string) => {
    setModalTitle(title); // Establecer el título del modal
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
    navigate('/dashboard/departamentos/jefes/');
  };

  const { idDepartamento } = useParams();

  console.log(idDepartamento)

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  interface Departamento {
    idDepartamento: number;
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


    interface DepartamentoJefe {
    iddepartamento: number;
    idpersona: number;
    idresolucion: number;
    fecha_de_creacion: Date;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  const [idresolucion, setIdresolucion] = useState<number>(0); 
  const [idPersona, setIdPersona] = useState<number>(0); 
  const [departamento, setDepartamento] = useState<Departamento>();
  const [departamentoJefe, setDepartamentoJefe] = useState<DepartamentoJefe>();
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
  const [fechaCreacion, setFechaCreacion] = useState<dayjs.Dayjs | null>(null);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/facet/api/v1/departamentos-tiene-jefe/${idDepartamento}`);
        const responseDepto = await axios.get(`http://127.0.0.1:8000/facet/api/v1/departamentos/${idDepartamento}`);
        const responseRes = await axios.get('http://127.0.0.1:8000/facet/api/v1/resoluciones/');
        const responsePers = await axios.get('http://127.0.0.1:8000/facet/api/v1/personas/');
        const data = response.data;
        setResoluciones(responseRes.data);
        setPersonas(responsePers.data);
        setDepartamentoJefe(data);
        setDepartamento(responseDepto.data)
        setNombreDepto(responseDepto.data.nombre)
        // console.log(departamentoJefe)


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [idDepartamento]);
  
  // Manejar la actualización del estado fuera del efecto
  useEffect(() => {
    if (departamentoJefe) {
      setIdresolucion(departamentoJefe.idresolucion)
      setIdPersona(departamentoJefe.idpersona)
      setEstado(String(departamentoJefe.estado))
      setObservaciones(departamentoJefe.observaciones)
      const fechaCargaDayjs = dayjs(departamentoJefe.fecha_de_creacion).utc();
      setFechaCreacion(fechaCargaDayjs)
    

      const fetchData = async () => {
        try {
          const responseRes = await axios.get(`http://127.0.0.1:8000/facet/api/v1/resoluciones/${departamentoJefe.idresolucion}`);
          const responsePers = await axios.get(`http://127.0.0.1:8000/facet/api/v1/personas/${departamentoJefe.idpersona}`);
          SetNroResolucion(responseRes.data.nresolucion);
          setNombre(responsePers.data.nombre);
          SetApellido(responsePers.data.apellido);
          SetDni(responsePers.data.dni)          
          // console.log(departamentoJefe)
  
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
  }}, [departamentoJefe]);

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
  

  const edicionDepartamentoJefe = async () => {

    const jefeDepartamentoEditado= {
      iddepartamento: idDepartamento,
      idpersona: idPersona,
      idresolucion: idresolucion,
      fecha_de_creacion: fechaCreacion,
      observaciones: observaciones,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };


    try {
      const response = await axios.put(`http://127.0.0.1:8000/facet/api/v1/departamentos-tiene-jefe/${idDepartamento}/`, jefeDepartamentoEditado, {
        headers: {
          'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
        },
      });
      handleOpenModal('Éxito', 'La acción se realizó con éxito.');
    } catch (error) {
      // console.error('Error al hacer la solicitud PUT:', error);
      handleOpenModal('Error','NO  se pudo realizar la acción.');

    }

  }

  const eliminarJefeDepartamento = async () => {


try {
  const response = await axios.delete(`http://127.0.0.1:8000/facet/api/v1/departamentos-tiene-jefe/${idDepartamento}/`,{
    headers: {
      'Content-Type': 'application/json', // Ajusta el tipo de contenido según sea necesario
    },
  });
  handleOpenModal('Deparamento Jefe Eliminado', 'La acción se realizó con éxito.');
} catch (error) {
  // console.error('Error al hacer la solicitud PUT:', error);
  handleOpenModal('Error','NO  se pudo realizar la acción.');

}

}

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
        Modificar Resolución
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
        Modificar Persona
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
      {/* <Button variant="contained" onClick={handleOpenDepto}>
        Seleccionar Departamento
      </Button> */}

      {/* Modal para seleccionar resolución */}
      <Dialog open={openDeptos} onClose={handleClose} maxWidth="md" fullWidth >
        {/* Filtrar resoluciones */}
        <TextField
          label="Buscar por Departamento"
          value={filtroDeptos}
          onChange={(e) => setFiltroDeptos(e.target.value)}
          fullWidth
        />

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
        <Button variant="contained" onClick={edicionDepartamentoJefe}>
          Editar
        </Button>
        <Button onClick={() => setConfirmarEliminacion(true)} variant="contained" style={{ marginLeft: '8px' }} color='error'>
          Eliminar
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>
    <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />
    <ModalConfirmacion
        open={confirmarEliminacion}
        onClose={() => setConfirmarEliminacion(false)}
        onConfirm={() => {
          setConfirmarEliminacion(false);
          eliminarJefeDepartamento();
        }}
      />


</Paper>
</Container>
  );
};

export default EditarDepartamentoJefe;