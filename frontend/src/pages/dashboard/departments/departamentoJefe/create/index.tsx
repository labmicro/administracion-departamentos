import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Dialog,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Asegúrate de tener instalada esta dependencia
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BasicModal from '@/utils/modal';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router'; // Importa useRouter de Next.js

// Habilita los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CrearDepartamentoJefe = () => {
  const router = useRouter(); // Usamos useRouter para manejar la navegación

  interface DepartamentoJefe {
    departamento: number;
    persona: number;
    resolucion: number;
    fechadecarga: Date;
    fechaModificacion: Date; // Aquí indicas que 'fecha' es de tipo Date
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Resolucion {
    id: number;
    resolucion: number;
    nexpediente: string;
    nresolucion: string;
    tipo: string;
    fechadecarga: Date;
    fecha: Date; // Aquí indicas que 'fecha' es de tipo Date
    adjunto: string;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    // Otros campos según sea necesario
  }

  interface Persona {
    id: number;
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

  interface Departamento {
    id: number;
    departamento: number;
    nombre: string;
    telefono: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    interno: string;
    // Otros campos según sea necesario
  }

  interface Jefe {
    id: number;
    persona: Persona;
    observaciones: string;
    estado: 0 | 1; // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
  }

  const [fechaInicio, setFechaInicio] = useState<dayjs.Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<dayjs.Dayjs | null>(null);
  const [resolucion, setResolucion] = useState<Resolucion>();
  const [persona, setPersona] = useState<Jefe>();
  const [departamento, setDepartamento] = useState<Departamento>();
  const [NroResolucion, SetNroResolucion] = useState('');
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
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
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

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
    router.push('/dashboard/departamentos/jefes/'); // Navegar a la lista de jefes de departamentos
  };

  const crearNuevoJefeDepartamento = async () => {
    const nuevoJefeDepartamento = {
      departamento: departamento?.id, // Asegúrate de que solo se pase el ID
      jefe: persona?.id, // Asegúrate de que solo se pase el ID
      resolucion: resolucion?.id,
      fecha_de_inicio: fechaInicio,
      fecha_de_fin: fechaFin,
      observaciones: observaciones,
      estado: 0 | 1, // Aquí indicas que 'estado' es un enum que puede ser 0 o 1
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/facet/jefe-departamento/', nuevoJefeDepartamento, {
        headers: {
          'Content-Type': 'application/json', // Cambia esto a 'application/json'
        },
      });
      handleOpenModal('Bien', 'Se creó el jefe de departamento con éxito', handleConfirmModal);
    } catch (error: unknown) {
      console.error(error);
      handleOpenModal('Error', 'NO se pudo realizar la acción.', () => {});
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Agregar Jefe Departamento
        </Typography>

        <Grid container spacing={2}>
          {/* Seleccionar resolucion */}
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => setOpenResolucion(true)}>
              Seleccionar Resolución
            </Button>
            <Dialog open={openResolucion} onClose={() => setOpenResolucion(false)} maxWidth="md" fullWidth>
              {/* Aquí puedes agregar el contenido del modal para seleccionar la resolución */}
            </Dialog>
          </Grid>

          {/* Otros controles... */}

          <Grid item xs={12}>
            <TextField label="DNI" value={dni} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Departamento" value={nombreDepto} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="none">
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={estado}
                label="Estado"
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Inicio"
                value={fechaInicio}
                onChange={(date) => setFechaInicio(date)}
              />
              <DatePicker
                label="Fecha de Fin"
                value={fechaFin}
                onChange={(date) => setFechaFin(date)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={crearNuevoJefeDepartamento}>
              Crear
            </Button>
          </Grid>
        </Grid>
        <BasicModal open={modalVisible} onClose={handleCloseModal} title={modalTitle} content={modalMessage} onConfirm={fn} />
      </Paper>
    </Container>
  );
};

export default CrearDepartamentoJefe;
