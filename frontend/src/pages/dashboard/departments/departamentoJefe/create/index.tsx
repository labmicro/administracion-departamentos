import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Button, Dialog, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BasicModal from '@/utils/modal';

const CrearDepartamentoJefe = () => {
  const navigate = useNavigate();

  interface Resolucion {
    id: number;
    nexpediente: string;
    nresolucion: string;
  }

  interface Persona {
    id: number;
    dni: string;
    legajo?: string;
    nombre: string;
    apellido: string;
  }

  interface Departamento {
    id: number;
    nombre: string;
  }

  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [filtroResolucion, setFiltroResolucion] = useState('');
  const [filtroPersonas, setFiltroPersonas] = useState('');
  const [filtroDeptos, setFiltroDeptos] = useState('');
  const [nextUrlResolucion, setNextUrlResolucion] = useState<string | null>(null);
  const [prevUrlResolucion, setPrevUrlResolucion] = useState<string | null>(null);
  const [nextUrlPersona, setNextUrlPersona] = useState<string | null>(null);
  const [prevUrlPersona, setPrevUrlPersona] = useState<string | null>(null);
  const [nextUrlDepto, setNextUrlDepto] = useState<string | null>(null);
  const [prevUrlDepto, setPrevUrlDepto] = useState<string | null>(null);
  const [currentUrlResolucion, setCurrentUrlResolucion] = useState<string>('http://127.0.0.1:8000/facet/resolucion/');
  const [currentUrlPersona, setCurrentUrlPersona] = useState<string>('http://127.0.0.1:8000/facet/persona/');
  const [currentUrlDepto, setCurrentUrlDepto] = useState<string>('http://127.0.0.1:8000/facet/departamento/');
  const [totalItemsResolucion, setTotalItemsResolucion] = useState<number>(0);
  const [totalItemsPersona, setTotalItemsPersona] = useState<number>(0);
  const [totalItemsDepto, setTotalItemsDepto] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPageResolucion, setCurrentPageResolucion] = useState<number>(1);
  const [currentPagePersona, setCurrentPagePersona] = useState<number>(1);
  const [currentPageDepto, setCurrentPageDepto] = useState<number>(1);
  const [resolucion, setResolucion] = useState<Resolucion | undefined>();
  const [persona, setPersona] = useState<Persona | undefined>();
  const [departamento, setDepartamento] = useState<Departamento | undefined>();
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [fn, setFn] = useState(() => () => {});

  // Diálogos
  const [openResolucion, setOpenResolucion] = useState(false);
  const [openPersona, setOpenPersona] = useState(false);
  const [openDeptos, setOpenDeptos] = useState(false);

  useEffect(() => {
    fetchData(currentUrlResolucion, 'resolucion');
    fetchData(currentUrlPersona, 'persona');
    fetchData(currentUrlDepto, 'departamento');
  }, [currentUrlResolucion, currentUrlPersona, currentUrlDepto]);

  const handleFilterAndPaginate = (url: string, type: 'resolucion' | 'persona' | 'departamento', filters: any) => {
    let newUrl = `${url}?`;
    const params = new URLSearchParams();
  
    // Añadir filtros
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key].toString());
    });
  
    // Añadir parámetros de paginación si existen
    if (type === 'resolucion') {
      if (nextUrlResolucion) {
        newUrl = nextUrlResolucion.split('?')[0] + '?' + params.toString();
      } else {
        newUrl = `${url}?${params.toString()}`;
      }
    } else if (type === 'persona') {
      if (nextUrlPersona) {
        newUrl = nextUrlPersona.split('?')[0] + '?' + params.toString();
      } else {
        newUrl = `${url}?${params.toString()}`;
      }
    } else if (type === 'departamento') {
      if (nextUrlDepto) {
        newUrl = nextUrlDepto.split('?')[0] + '?' + params.toString();
      } else {
        newUrl = `${url}?${params.toString()}`;
      }
    }
  
    if (type === 'resolucion') {
      setCurrentUrlResolucion(newUrl);
      setCurrentPageResolucion(1); // Resetear la página actual al aplicar un filtro
    } else if (type === 'persona') {
      setCurrentUrlPersona(newUrl);
      setCurrentPagePersona(1); // Resetear la página actual al aplicar un filtro
    } else if (type === 'departamento') {
      setCurrentUrlDepto(newUrl);
      setCurrentPageDepto(1); // Resetear la página actual al aplicar un filtro
    }
  
    fetchData(newUrl, type);
  };
  
  const fetchData = async (url: string, type: 'resolucion' | 'persona' | 'departamento') => {
    try {
      const response = await axios.get(url);
      if (type === 'resolucion') {
        setResoluciones(response.data.results);
        setNextUrlResolucion(response.data.next);
        setPrevUrlResolucion(response.data.previous);
        setTotalItemsResolucion(response.data.count);
      } else if (type === 'persona') {
        setPersonas(response.data.results);
        setNextUrlPersona(response.data.next);
        setPrevUrlPersona(response.data.previous);
        setTotalItemsPersona(response.data.count);
      } else if (type === 'departamento') {
        setDepartamentos(response.data.results);
        setNextUrlDepto(response.data.next);
        setPrevUrlDepto(response.data.previous);
        setTotalItemsDepto(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number, type: 'resolucion' | 'persona' | 'departamento') => {
    let newUrl = '';
    if (type === 'resolucion') {
      newUrl = value === 1 ? currentUrlResolucion : nextUrlResolucion || '';
      setCurrentPageResolucion(value);
      setCurrentUrlResolucion(newUrl);
    } else if (type === 'persona') {
      newUrl = value === 1 ? currentUrlPersona : nextUrlPersona || '';
      setCurrentPagePersona(value);
      setCurrentUrlPersona(newUrl);
    } else if (type === 'departamento') {
      newUrl = value === 1 ? currentUrlDepto : nextUrlDepto || '';
      setCurrentPageDepto(value);
      setCurrentUrlDepto(newUrl);
    }

    if (newUrl) {
      await fetchData(newUrl, type);
    }
  };

  const crearNuevoJefeDepartamento = async () => {
    const nuevoJefeDepartamento = {
      departamento: departamento?.id,
      persona: persona?.id,
      resolucion: resolucion?.id,
      observaciones,
      estado: parseInt(estado),
    };

    try {
      await axios.post('http://127.0.0.1:8000/facet/jefe-departamento/', nuevoJefeDepartamento, {
        headers: { 'Content-Type': 'application/json' },
      });
      handleOpenModal('Éxito', 'Se creó el jefe de departamento con éxito.', handleConfirmModal);
    } catch (error) {
      console.log(error);
      handleOpenModal('Error', 'No se pudo realizar la acción.', () => {});
    }
  };

  const handleOpenModal = (title: string, message: string, onConfirm: () => void) => {
    setModalTitle(title);
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

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Agregar Jefe de Departamento
        </Typography>

        <Grid container spacing={2}>
          {/* Seleccionar Resolución */}
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => setOpenResolucion(true)}>
              Seleccionar Resolución
            </Button>
            <Dialog open={openResolucion} onClose={() => setOpenResolucion(false)} maxWidth="md" fullWidth>
              <TextField
                label="Buscar por Resolución"
                value={filtroResolucion}
                onChange={(e) => {
                  setFiltroResolucion(e.target.value);
                  handleFilterAndPaginate(currentUrlResolucion, 'resolucion', { 'nresolucion__icontains': e.target.value });
                }}
                fullWidth
              />
              {resoluciones.map((resolucionFiltro) => (
                <Button
                  key={resolucionFiltro.id}
                  onClick={() => { setResolucion(resolucionFiltro); setFiltroResolucion(''); }}
                >
                  {resolucionFiltro.nresolucion} - {resolucionFiltro.nexpediente}
                </Button>
              ))}
              <Pagination
                count={Math.ceil(totalItemsResolucion / pageSize)}
                page={currentPageResolucion}
                onChange={(e, value) => handlePageChange(e, value, 'resolucion')}
                color="primary"
                style={{ marginTop: '20px' }}
              />
              <Button variant="contained" onClick={() => setOpenResolucion(false)}>Confirmar Selección</Button>
            </Dialog>
          </Grid>

          {/* Seleccionar Persona */}
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => setOpenPersona(true)}>
              Seleccionar Persona
            </Button>
            <Dialog open={openPersona} onClose={() => setOpenPersona(false)} maxWidth="md" fullWidth>
              <TextField
                label="Buscar por Persona"
                value={filtroPersonas}
                onChange={(e) => {
                  setFiltroPersonas(e.target.value);
                  handleFilterAndPaginate(currentUrlPersona, 'persona', { 'nombre__icontains': e.target.value });
                }}
                fullWidth
              />
              {personas.map((personaFiltro) => (
                <Button
                  key={personaFiltro.id}
                  onClick={() => { setPersona(personaFiltro); setFiltroPersonas(''); }}
                >
                  {personaFiltro.nombre} {personaFiltro.apellido}
                </Button>
              ))}
              <Pagination
                count={Math.ceil(totalItemsPersona / pageSize)}
                page={currentPagePersona}
                onChange={(e, value) => handlePageChange(e, value, 'persona')}
                color="primary"
                style={{ marginTop: '20px' }}
              />
              <Button variant="contained" onClick={() => setOpenPersona(false)}>Confirmar Selección</Button>
            </Dialog>
          </Grid>

          {/* Seleccionar Departamento */}
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => setOpenDeptos(true)}>
              Seleccionar Departamento
            </Button>
            <Dialog open={openDeptos} onClose={() => setOpenDeptos(false)} maxWidth="md" fullWidth>
              <TextField
                label="Buscar por Departamento"
                value={filtroDeptos}
                onChange={(e) => {
                  setFiltroDeptos(e.target.value);
                  handleFilterAndPaginate(currentUrlDepto, 'departamento', { 'nombre__icontains': e.target.value });
                }}
                fullWidth
              />
              {departamentos.map((departamentoFiltro) => (
                <Button
                  key={departamentoFiltro.id}
                  onClick={() => { setDepartamento(departamentoFiltro); setFiltroDeptos(''); }}
                >
                  {departamentoFiltro.nombre}
                </Button>
              ))}
              <Pagination
                count={Math.ceil(totalItemsDepto / pageSize)}
                page={currentPageDepto}
                onChange={(e, value) => handlePageChange(e, value, 'departamento')}
                color="primary"
                style={{ marginTop: '20px' }}
              />
              <Button variant="contained" onClick={() => setOpenDeptos(false)}>Confirmar Selección</Button>
            </Dialog>
          </Grid>

          {/* Otros campos */}
          <Grid item xs={12}>
            <TextField label="Resolución" value={resolucion?.nresolucion || ''} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Persona" value={persona?.nombre + ' ' + persona?.apellido || ''} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Departamento" value={departamento?.nombre || ''} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="estado-select-label">Estado</InputLabel>
              <Select
                labelId="estado-select-label"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={0}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} marginBottom={2}>
            <Button variant="contained" onClick={crearNuevoJefeDepartamento}>
              Crear
            </Button>
          </Grid>
        </Grid>
        <BasicModal open={modalVisible} onClose={() => handleCloseModal()} title={modalTitle} content={modalMessage} onConfirm={() => fn()} />
      </Paper>
    </Container>
  );
};

export default CrearDepartamentoJefe;
