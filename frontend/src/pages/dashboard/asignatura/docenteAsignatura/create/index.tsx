import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Container, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Typography, Paper,TextField,Button,InputLabel,Select ,MenuItem,FormControl,Grid, Modal, Box} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DashboardMenu from '../../../../dashboard';



// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearDocenteAsignatura = () => {
  const h1Style = {
    color: 'black',
  };

  // const navigate = useNavigate();

  
  interface AsignaturaDocente {
    asignatura: number;
    docente: number;
    resolucion: number;
    cargo: string;
    condicion: string;
    dedicacion: string;
    fechadecarga: Date;
    fechaModificacion: Date; // Aquí indicas que 'fecha' es de tipo Date
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Resolucion {
    id:number;
    resolucion: number;
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
    id:number;
    persona: number;
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

  type TipoAsignatura = 'Electiva' | 'Obligatoria';

  interface Asignatura {
    id: number;
    area: number;
    asignatura: number;
    codigo: string;
    nombre: string;
    modulo: string;
    programa: string;
    tipo:TipoAsignatura;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Docente {
    id: number;
    persona: Persona;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
  }

  const fechaActual = new Date();
  const [fechaInicio, setFechaInicio] = useState<dayjs.Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<dayjs.Dayjs | null>(null);
  const [resolucion, setResolucion] = useState<Resolucion>(); 
  const [persona, setPersona] = useState<Docente>(); 
  const [asignatura, setAsignatura] = useState<Asignatura>(); 
  const [NroResolucion, SetNroResolucion] = useState('');
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [apellido, SetApellido] = useState('');
  const [dni, SetDni] = useState('');
  const [filtroDeptos, setFiltroDeptos] = useState('');
  const [openResolucion, setOpenResolucion] = useState(false);
  const [openDeptos, setOpenDeptos] = useState(false);
  const [openPersona, setOpenPersona] = useState(false);
  const [nombre, setNombre] = useState('');
  const [nombreDepto, setNombreDepto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('');


  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | number>('');
  const [filtroTelefono, setFiltroTelefono] = useState('');
  const [nextUrlDepto, setNextUrlDepto] = useState<string | null>(null);
  const [prevUrlDepto, setPrevUrlDepto] = useState<string | null>(null);
  const [currentUrlDepto, setCurrentUrlDepto] = useState<string>('http://127.0.0.1:8000/facet/asignatura/');
  const [totalItemsDepto, setTotalItemsDepto] = useState<number>(0);
  const [pageSizeDepto, setPageSizeDepto] = useState<number>(10);
  const [currentPageDepto, setCurrentPageDepto] = useState<number>(1);

const [personas, setPersonas] = useState<Docente[]>([]);
const [filtroPersonas, setFiltroPersonas] = useState('');
const [nextUrlPersona, setNextUrlPersona] = useState<string | null>(null);
const [prevUrlPersona, setPrevUrlPersona] = useState<string | null>(null);
const [currentUrlPersona, setCurrentUrlPersona] = useState<string>('http://127.0.0.1:8000/facet/docente/');
const [currentPagePersona, setCurrentPagePersona] = useState<number>(1);
const [totalPagesPersona, setTotalPagesPersona] = useState<number>(1);
const [totalItemsPersona, setTotalItemsPersona] = useState<number>(0);
const [filtroDni, setFiltroDni] = useState('');
const [filtroNombreJefe, setFiltroNombreJefe] = useState('');
const [filtroApellidoJefe, setFiltroApellidoJefe] = useState('');
const [filtroLegajoJefe, setFiltroLegajoJefe] = useState('');
const [filtroEstadoJefe, setFiltroEstadoJefe] = useState<string | number>('');

const [filtroNroExpediente, setFiltroNroExpediente] = useState('');
const [filtroNroResolucion, setFiltroNroResolucion] = useState('');
const [filtroTipo, setFiltroTipo] = useState('');
const [filtroFecha, setFiltroFecha] = useState<dayjs.Dayjs | null>(null);
const [filtroEstadoRes, setFiltroEstadoRes] =  useState<string | number>('');
const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
const [filtroResolucion, setFiltroResolucion] = useState('');
const [nextUrlResolucion, setNextUrlResolucion] = useState<string | null>(null);
const [prevUrlResolucion, setPrevUrlResolucion] = useState<string | null>(null);
const [currentUrlResolucion, setCurrentUrlResolucion] = useState<string>('http://127.0.0.1:8000/facet/resolucion/');
const [currentPageResolucion, setCurrentPageResolucion] = useState<number>(1);
const [totalPagesResolucion, setTotalPagesResolucion] = useState<number>(1);
const [totalItemsResoluciones, setTotalItemsResolucion] = useState<number>(0);

const [condicion, setCondicion] = useState('');
const [cargo, setCargo] = useState('');
const [dedicacion, setDedicacion] = useState('');


useEffect(() => {
  fetchData(currentUrlDepto);
}, [currentUrlDepto]);

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    setAsignaturas(response.data.results);
    setNextUrlDepto(response.data.next);
    setPrevUrlDepto(response.data.previous);
    setTotalItemsDepto(response.data.count);
    setCurrentPageDepto(1);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

useEffect(() => {
  fetchDataPersonas(currentUrlPersona);
}, [currentUrlPersona]);

const fetchDataPersonas = async (url: string) => {
  try {
    const response = await axios.get(url);
    setPersonas(response.data.results);
    setNextUrlPersona(response.data.next);
    setPrevUrlPersona(response.data.previous);
    setTotalItemsPersona(response.data.count);
    setCurrentPagePersona(1);
  } catch (error) {
    console.error('Error fetching data for personas:', error);
  }
};

useEffect(() => {
  fetchDataResoluciones(currentUrlResolucion);
}, [currentUrlResolucion]);

const fetchDataResoluciones = async (url: string) => {
  try {
    const response = await axios.get(url);
    setResoluciones(response.data.results);
    setNextUrlResolucion(response.data.next);
    setPrevUrlResolucion(response.data.previous);
    setTotalItemsResolucion(response.data.count);
    setCurrentPageResolucion(1);
  } catch (error) {
    console.error('Error fetching data for resoluciones:', error);
  }
};
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
    window.location.href = '/dashboard/asignaturas/docentes/'; // Cambia a la nueva URL
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



  const handleConfirmSelection = () => {
    // Realiza la lógica necesaria con idResolucionSeleccionada
    console.log('ID de la resolución seleccionada:', resolucion);
    console.log('ID de la persona seleccionada:', persona);
    console.log('ID del depto seleccionada:', asignatura);

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
    console.log(personas)
    const personasFiltro = personas.filter((docente) =>
      docente.persona.dni.includes(filtro)||
      (docente.persona.legajo ?? '').includes(filtro)||
      docente.persona.nombre.toLowerCase().includes(filtro.toLowerCase())||
      docente.persona.apellido.toLowerCase().includes(filtro.toLowerCase())
    );
    return personasFiltro;
  };

  const filtrarDepartamentos = () => {
    let url = `http://127.0.0.1:8000/facet/asignatura/?`;
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
    setCurrentUrlDepto(url);
  };

  const filtrarResoluciones = () => {
    let url = `http://127.0.0.1:8000/facet/resolucion/?`;
    const params = new URLSearchParams();
    
    if (filtroNroExpediente !== '') {
      params.append('nexpediente__icontains', filtroNroExpediente);
    }
    if (filtroEstadoRes !== '') {
      params.append('estado', filtroEstado.toString());
    }
    if (filtroTipo !== '') {
      params.append('tipo', filtroTipo);
    }
    if (filtroNroResolucion !== '') {
      params.append('nresolucion__icontains', filtroNroResolucion);
    }
    if (filtroFecha) {
      const fechaStr = filtroFecha.format('YYYY-MM-DD');
      if (fechaStr !== 'Invalid Date') {
        params.append('fecha__date', fechaStr);
      }
    }
  
    url += params.toString();
    setCurrentUrlResolucion(url);
  };
  
  const filtrarJefes = () => {
    let url = `http://127.0.0.1:8000/facet/docente/?`;
    const params = new URLSearchParams();
    if (filtroNombreJefe !== '') {
      params.append('persona__nombre__icontains', filtroNombre);
    }
    if (filtroDni !== '') {
      params.append('persona__dni__icontains', filtroDni);
    }
    if (filtroEstadoJefe !== '') {
      params.append('estado', filtroEstadoJefe.toString());
    }
    if (filtroApellidoJefe !== '') {
      params.append('persona__apellido__icontains', filtroApellidoJefe);
    }
    if (filtroLegajoJefe !== '') {
      params.append('persona__legajo__icontains', filtroLegajoJefe);
    }
    url += params.toString();
    setCurrentUrlPersona(url);
  };

  const totalPages = Math.ceil(totalItemsDepto / pageSizeDepto);

  const crearNuevoJefeDepartamento= async () => {
    const formatFecha = (date: dayjs.Dayjs | Date | null | undefined) => {
      if (date) {
        const dayjsDate = dayjs(date);
        return dayjsDate.isValid() ? dayjsDate.toISOString() : null;  // Devuelve la fecha en formato ISO
      }
      return null;
    };

    const nuevoDocenteAsignatura= {
      asignatura: asignatura?.id,  // Asegúrate de que solo se pase el ID
      docente: persona?.id,  // Asegúrate de que solo se pase el ID
      resolucion: resolucion?.id, 
      fecha_de_inicio: fechaInicio,
      fecha_de_fin: fechaFin,
      cargo:cargo,
      dedicacion:dedicacion,
      condicion:condicion,
      // fecha_de_fin: fechaActual,
      observaciones: observaciones,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };


        try {
        const response = await axios.post('http://127.0.0.1:8000/facet/asignatura-docente/', nuevoDocenteAsignatura, {
          headers: {
            'Content-Type': 'application/json', // Cambia esto a 'application/json'
          },
        });
        handleOpenModal('Bien', 'Se creó el docente en asignatura con éxito', handleConfirmModal);
      } catch (error: unknown){
        // Maneja otros errores
        console.error(error);
        handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
      // }
    }
    
  
    };

  return (
<DashboardMenu>
<Container maxWidth="lg">
<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Typography variant="h4" gutterBottom>
    Agregar Docente en Asignatura
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
        <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          label="Nro Expediente"
          value={filtroNroExpediente}
          onChange={(e) => setFiltroNroExpediente(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Nro Resolución"
          value={filtroNroResolucion}
          onChange={(e) => setFiltroNroResolucion(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth margin="none">
          <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filtroTipo}
            label="Tipo"
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <MenuItem value={""}>Todos</MenuItem>
            <MenuItem value={"Rector"}>Rector</MenuItem>
            <MenuItem value={"Decano"}>Decano</MenuItem>
            <MenuItem value={"Consejo_Superior"}>Consejo Superior</MenuItem>
            <MenuItem value={"Consejo_Directivo"}>Consejo Directivo</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} marginBottom={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Fecha"
        value={filtroFecha}
        onChange={(date) => {
          if (date) {
            const fechaSeleccionada = dayjs(date).utc();  // Usa .utc() para evitar problemas de zona horaria
            setFiltroFecha(fechaSeleccionada);
            // console.log(fechaSeleccionada); // Imprime la fecha en la consola
          }
        }}
      />
      </LocalizationProvider>
      </Grid>
      <Grid item xs={4} marginBottom={2}>
        <Button variant="contained" onClick={filtrarResoluciones}>
          Filtrar
        </Button>
      </Grid>
      {/* <TextField label="Fecha" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />       */}
    </Grid>

        {/* Mostrar lista de resoluciones */}
        {handleFilterResoluciones(filtroResolucion).map((resolucionFiltrada) => (
          <div key={resolucionFiltrada.id}>
            {/* Puedes agregar más detalles o botones según tus necesidades */}
            <Button
              onClick={() => {setResolucion(resolucionFiltrada);SetNroResolucion(resolucionFiltrada.nresolucion)}}
              style={{ backgroundColor: resolucionFiltrada.id === resolucion?.id ? '#4caf50' : 'inherit', color: resolucionFiltrada.id === resolucion?.id ? 'white' : 'inherit' }}
            >
              N° Resolución {resolucionFiltrada.nresolucion} - N° Expediente {resolucionFiltrada.nexpediente}
            </Button>
          </div>
        ))}

        {/* Botón de confirmación para cerrar el modal y realizar la acción */}
        <Button variant="contained" onClick={handleConfirmSelection}>
          Confirmar Selección
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              prevUrlResolucion && setCurrentUrlDepto(prevUrlResolucion);
              setCurrentPageResolucion(currentPageResolucion - 1);
            }}
            disabled={!prevUrlResolucion}
          >
            Anterior
          </Button>
          <Typography variant="body1">
            Página {currentPageResolucion} de {totalPagesResolucion}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              nextUrlResolucion && setCurrentUrlResolucion(nextUrlResolucion);
              setCurrentPageResolucion(currentPageResolucion + 1);
            }}
            disabled={!nextUrlResolucion}
          >
            Siguiente
          </Button>
        </div>
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
        Seleccionar Docente
      </Button>

      {/* Modal para seleccionar resolución */}
      <Dialog open={openPersona} onClose={handleClose} maxWidth="md" fullWidth >
        {/* Filtrar resoluciones */}
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
              value={filtroNombreJefe}
              onChange={(e) => setFiltroNombreJefe(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Apellido"
              value={filtroApellidoJefe}
              onChange={(e) => setFiltroApellidoJefe(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <TextField
              label="Legajo"
              value={filtroLegajoJefe}
              onChange={(e) => setFiltroLegajoJefe(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} marginBottom={2}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstadoJefe}
                onChange={(e) => setFiltroEstadoJefe(e.target.value)}
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
        {/* Mostrar lista de resoluciones */}
        {handleFilterPersonas(filtroPersonas).map((personFiltrada) => (
          <div key={personFiltrada.id}>
            {/* Puedes agregar más detalles o botones según tus necesidades */}
            <Button
              onClick={() => {setPersona(personFiltrada);SetApellido(personFiltrada.persona.apellido);SetDni(personFiltrada.persona.dni),setNombre(personFiltrada.persona.nombre)}}
              style={{ backgroundColor: personFiltrada.id=== persona?.id ? '#4caf50' : 'inherit', color: personFiltrada.id === persona?.id ? 'white' : 'inherit' }}
            >
              DNI {personFiltrada.persona.dni} - {personFiltrada.persona.apellido} {personFiltrada.persona.nombre} - Legajo {personFiltrada.persona.legajo}
            </Button>
          </div>
        ))
        
        }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              prevUrlPersona && setCurrentUrlPersona(prevUrlPersona);
              setCurrentPagePersona(currentPagePersona - 1);
            }}
            disabled={!prevUrlPersona}
          >
            Anterior
          </Button>
          <Typography variant="body1">
            Página {currentPagePersona} de {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              nextUrlPersona && setCurrentUrlPersona(nextUrlPersona);
              setCurrentPagePersona(currentPagePersona + 1);
            }}
            disabled={!nextUrlPersona}
          >
            Siguiente
          </Button>
        </div>
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

      <Dialog open={openDeptos} onClose={handleClose} maxWidth="md" fullWidth>
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
      <Button variant="contained" onClick={filtrarDepartamentos}>
        Filtrar
      </Button>
    </Grid>
  </Grid>

  <List>
    {asignaturas.map((asignaturaFiltrado) => (
      <ListItem
        key={asignaturaFiltrado.id}
        button
        onClick={() => { setAsignatura(asignaturaFiltrado); setNombreDepto(asignaturaFiltrado.nombre); }}
        style={{
          backgroundColor: asignaturaFiltrado.id === asignatura?.id ? '#4caf50' : 'inherit',
          color: asignaturaFiltrado.id === asignatura?.id ? 'white' : 'inherit'
        }}
      >
        {asignaturaFiltrado.nombre}
      </ListItem>
    ))}
  </List>

  <Button
    variant="contained"
    onClick={handleConfirmSelection}
    style={{
      marginTop: 'auto',
      marginBottom: '10px',
      position: 'sticky',
      bottom: 0,
    }}
  >
    Confirmar Selección
  </Button>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              prevUrlDepto && setCurrentUrlDepto(prevUrlDepto);
              setCurrentPageDepto(currentPageDepto - 1);
            }}
            disabled={!prevUrlDepto}
          >
            Anterior
          </Button>
          <Typography variant="body1">
            Página {currentPageDepto} de {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              nextUrlDepto && setCurrentUrlDepto(nextUrlDepto);
              setCurrentPageDepto(currentPageDepto + 1);
            }}
            disabled={!nextUrlDepto}
          >
            Siguiente
          </Button>
        </div>

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
        <TextField
          label="Dedicacion"
          value={dedicacion}
          onChange={(e) => setDedicacion(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Condicion"
          value={condicion}
          onChange={(e) => setCondicion(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
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
       <Grid container item xs={12} spacing={2} marginBottom={2}>
    <Grid item xs={6}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Fecha Inicio"
          value={fechaInicio}
          onChange={(date) => {
            if (date) {
              const fechaSeleccionada = dayjs(date).utc(); // Usa .utc() para evitar problemas de zona horaria
              setFechaInicio(fechaSeleccionada);
            }
          }}
          // renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>
    </Grid>

    <Grid item xs={6}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Fecha Fin"
          value={fechaFin}
          onChange={(date) => {
            if (date) {
              const fechaSeleccionada = dayjs(date).utc(); // Usa .utc() para evitar problemas de zona horaria
              setFechaFin(fechaSeleccionada);
            }
          }}
          // renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>
    </Grid>
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
</DashboardMenu>
  );
};

export default CrearDocenteAsignatura;