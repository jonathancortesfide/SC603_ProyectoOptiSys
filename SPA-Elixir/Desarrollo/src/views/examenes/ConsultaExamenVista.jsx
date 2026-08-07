// ConsultaExamenVista.jsx
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import axiosServices from '../../utils/axios';
import { getSucursalIdentificador } from '../../utils/sucursal';

const apiBase = import.meta.env.VITE_ApiBase;

// -----------------------------------------------------------------------
// Configuración dinámica: cada campo del "datos" que viene del backend
// se agrupa aquí. Si el backend agrega/quita un campo, solo tocas este
// arreglo, no el JSX. "key" debe coincidir con la propiedad del objeto.
// -----------------------------------------------------------------------
const SECCIONES_EXAMEN = [
  {
    titulo: 'Datos generales',
    campos: [
      { key: 'no_examen', label: 'Número de examen' },
      { key: 'fecha_examen', label: 'Fecha del examen', tipo: 'fecha' },
      { key: 'estado', label: 'Estado' },
      { key: 'fecha_creacion', label: 'Fecha de creación', tipo: 'fecha' },
    ],
  },
  {
    titulo: 'Paciente',
    campos: [
      { key: 'no_paciente', label: 'Número de paciente' },
      { key: 'nombre_paciente', label: 'Nombre del paciente' },
    ],
  },
  {
    titulo: 'Profesional',
    campos: [
      { key: 'nombre_profesional', label: 'Profesional' },
      { key: 'codigo_profesional', label: 'Código profesional' },
    ],
  },
  {
    titulo: 'Consulta',
    campos: [
      { key: 'motivo_consulta', label: 'Motivo de consulta', multiline: true },
      {
        key: 'observaciones_generales',
        label: 'Observaciones generales',
        multiline: true,
      },
    ],
  },
  {
    titulo: 'Lente y material',
    campos: [
      { key: 'tipo_lente', label: 'Tipo de lente' },
      { key: 'material', label: 'Material' },
      { key: 'aro', label: 'Aro' },
      { key: 'codigo_aro', label: 'Código de aro' },
    ],
  },
  {
    titulo: 'Laboratorio',
    campos: [
      { key: 'laboratorio', label: 'Laboratorio' },
      { key: 'numero_orden_laboratorio', label: 'Número de orden' },
    ],
  },
  {
    titulo: 'Notas adicionales',
    campos: [
      { key: 'disposicion', label: 'Disposición', multiline: true },
      { key: 'tratamiento', label: 'Tratamiento', multiline: true },
    ],
  },
  {
    titulo: 'Costos',
    campos: [
      { key: 'costo_examen', label: 'Costo del examen', tipo: 'moneda' },
      { key: 'costo_material', label: 'Costo del material', tipo: 'moneda' },
      { key: 'costo_lente', label: 'Costo del lente', tipo: 'moneda' },
      { key: 'costo_aro', label: 'Costo del aro', tipo: 'moneda' },
      { key: 'precio_final', label: 'Precio final', tipo: 'moneda', destacado: true },
    ],
  },
];

const CAMPOS_CONOCIDOS = new Set([
  'id_examen',
  'id_profesional',
  'tipo_lente_id',
  'material_id',
  'xml_graduaciones',
  ...SECCIONES_EXAMEN.flatMap((s) => s.campos.map((c) => c.key)),
]);

const formatearValor = (valor, tipo) => {
  if (valor === null || valor === undefined || valor === '') return '—';

  if (tipo === 'moneda') {
    const numero = Number(valor);
    if (Number.isNaN(numero)) return valor;
    return numero.toLocaleString('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0,
    });
  }

  if (tipo === 'fecha') {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return valor;
    return fecha.toLocaleString('es-CR');
  }

  return String(valor);
};

const obtenerEtiquetaPaciente = (paciente) => {
  if (!paciente) return '';

  const nombre =
    paciente?.nombre ||
    paciente?.Nombre ||
    paciente?.nombrePaciente ||
    paciente?.NombrePaciente ||
    '';
  const cedula =
    paciente?.cedula ||
    paciente?.Cedula ||
    paciente?.identificacion ||
    paciente?.Identificacion ||
    '';
  const noPaciente =
    paciente?.noPaciente ??
    paciente?.NoPaciente ??
    paciente?.no_paciente ??
    paciente?.No_Paciente ??
    null;

  const partes = [nombre, cedula, noPaciente != null ? `#${noPaciente}` : null].filter(Boolean);
  return partes.join(' • ') || 'Paciente';
};

const obtenerNoPaciente = (paciente) => {
  if (!paciente) return null;

  const noPaciente =
    paciente?.noPaciente ??
    paciente?.NoPaciente ??
    paciente?.no_paciente ??
    paciente?.No_Paciente ??
    paciente?.id ??
    paciente?.identificador ??
    null;

  return noPaciente != null ? Number(noPaciente) : null;
};

const parsearGraduaciones = (xmlString) => {
  if (!xmlString) return null;

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) return null;

    const raiz = xmlDoc.documentElement;
    const resultado = {};

    Array.from(raiz.children).forEach((bloque) => {
      const ojos = {};
      Array.from(bloque.children).forEach((ojoNodo) => {
        const valores = {};
        Array.from(ojoNodo.children).forEach((campoNodo) => {
          valores[campoNodo.tagName] = campoNodo.textContent;
        });
        ojos[ojoNodo.tagName] = valores;
      });
      resultado[bloque.tagName] = ojos;
    });

    return resultado;
  } catch (e) {
    console.error('Error parseando xml_graduaciones:', e);
    return null;
  }
};

const SectionCard = ({ title, children, action }) => (
  <Paper
    variant="outlined"
    sx={{
      p: { xs: 2, md: 2.5 },
      borderRadius: 2,
      borderColor: 'divider',
      mb: 2.5,
      bgcolor: 'background.paper',
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={1.5}>
      <Typography
        variant="overline"
        sx={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
      {action}
    </Box>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

const CampoSoloLectura = ({ label, value, multiline, destacado }) => {
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      InputProps={{ readOnly: true }}
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      size="small"
      sx={{
        '& .MuiInputBase-root': {
          bgcolor: destacado
            ? alpha(theme.palette.primary.main, 0.06)
            : alpha(theme.palette.grey[500], 0.04),
        },
        '& .MuiInputBase-input': {
          fontWeight: destacado ? 700 : 400,
          color: destacado ? 'primary.main' : 'text.primary',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: destacado ? alpha(theme.palette.primary.main, 0.35) : 'divider',
        },
      }}
    />
  );
};

const TablaGraduaciones = ({ graduaciones }) => {
  const theme = useTheme();

  if (!graduaciones) return null;

  return Object.entries(graduaciones).map(([nombreBloque, ojos]) => {
    const nombresOjos = Object.keys(ojos);
    const todasLasLlaves = Array.from(
      new Set(nombresOjos.flatMap((ojo) => Object.keys(ojos[ojo]))),
    );

    if (todasLasLlaves.length === 0) return null;

    return (
      <Box key={nombreBloque} mb={2.5}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>
          {nombreBloque}
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 2, overflow: 'hidden' }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>Parámetro</TableCell>
                {nombresOjos.map((ojo) => (
                  <TableCell key={ojo} align="center" sx={{ fontWeight: 700 }}>
                    {ojo}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {todasLasLlaves.map((llave, idx) => (
                <TableRow
                  key={llave}
                  sx={{
                    bgcolor: idx % 2 === 0 ? 'transparent' : alpha(theme.palette.grey[500], 0.03),
                  }}
                >
                  <TableCell sx={{ color: 'text.secondary' }}>{llave}</TableCell>
                  {nombresOjos.map((ojo) => (
                    <TableCell key={ojo} align="center" sx={{ fontWeight: 500 }}>
                      {ojos[ojo][llave] ?? '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  });
};

const EstadoVacio = () => (
  <Box
    sx={{
      py: { xs: 5, md: 7 },
      px: 2,
      textAlign: 'center',
      borderRadius: 2,
      border: '1px dashed',
      borderColor: 'divider',
      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.03),
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        color: 'primary.main',
      }}
    >
      <AssignmentOutlinedIcon sx={{ fontSize: 30 }} />
    </Box>
    <Typography variant="h6" fontWeight={600} gutterBottom>
      Consulta de examen
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
      Ingresá el número de examen y buscá para ver el snapshot guardado: paciente, graduaciones,
      lente y costos.
    </Typography>
  </Box>
);

const ResumenExamen = ({ examen }) => {
  const theme = useTheme();
  const estado = examen.estado || '—';
  const activo = String(estado).toLowerCase() === 'activo';

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
        mb: 2.5,
        borderRadius: 2,
        borderColor: alpha(theme.palette.primary.main, 0.2),
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(
          theme.palette.primary.main,
          0.02,
        )} 100%)`,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
            <Typography variant="h5" fontWeight={700}>
              Examen #{examen.no_examen}
            </Typography>
            <Chip
              size="small"
              label={estado}
              color={activo ? 'success' : 'default'}
              variant={activo ? 'filled' : 'outlined'}
            />
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 0.5, sm: 2 }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {examen.nombre_paciente || 'Paciente sin nombre'}
                {examen.no_paciente ? ` · #${examen.no_paciente}` : ''}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {formatearValor(examen.fecha_examen, 'fecha')}
            </Typography>
          </Stack>
        </Box>

        <Box textAlign={{ xs: 'left', sm: 'right' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            Precio final
          </Typography>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {formatearValor(examen.precio_final, 'moneda')}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const ConsultaExamenVista = () => {
  const [filtroExamen, setFiltroExamen] = useState('');
  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteTexto, setPacienteTexto] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [pacienteLoading, setPacienteLoading] = useState(false);
  const [examenesPaciente, setExamenesPaciente] = useState([]);
  const [examenesPacienteLoading, setExamenesPacienteLoading] = useState(false);
  const [examenesPacienteError, setExamenesPacienteError] = useState('');

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const cargarPacientes = async () => {
        setPacienteLoading(true);

        try {
          const response = await axiosServices.post(`${apiBase}/Paciente/ObtenerPaciente`, {
            identificador: getSucursalIdentificador(),
            textoBusqueda: pacienteTexto || '',
          });

          if (response?.data?.esCorrecto) {
            const pacientesActivos = (response.data.laListaDePacientes || []).filter((paciente) => {
              const activo =
                paciente?.activo ??
                paciente?.Activo ??
                paciente?.esActivo ??
                paciente?.esactivo ??
                true;

              return (
                activo === true ||
                activo === 1 ||
                activo === '1' ||
                activo === 'true' ||
                activo === 'True'
              );
            });

            setPacientes(pacientesActivos);
          } else {
            setPacientes([]);
          }
        } catch (err) {
          console.error('Error cargando pacientes:', err);
          setPacientes([]);
        } finally {
          setPacienteLoading(false);
        }
      };

      cargarPacientes();
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [pacienteTexto]);

  const buscar = async (numeroExamen = null) => {
    const valorBusqueda =
      numeroExamen != null && typeof numeroExamen !== 'object'
        ? String(numeroExamen)
        : filtroExamen;

    if (!valorBusqueda) {
      setError('Ingrese un número de examen.');
      return;
    }

    setFiltroExamen(valorBusqueda);
    setLoading(true);
    setError('');
    setExamen(null);
    setBuscado(true);

    try {
      const noExamen = parseInt(valorBusqueda, 10);

      const response = await axiosServices.get(`${apiBase}/ExamenSnapshot/${noExamen}`);

      if (response.data.esCorrecto) {
        setExamen(response.data.datos);
      } else {
        setError(response.data.mensaje);
      }
    } catch (err) {
      console.error('Error:', err);

      if (err.response) {
        console.log(err.response.data);
      }

      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscar();
    }
  };

  const cargarExamenesPorPaciente = async (paciente) => {
    const noPaciente = obtenerNoPaciente(paciente);

    if (!noPaciente) {
      setExamenesPaciente([]);
      setExamenesPacienteError('');
      return;
    }

    setExamenesPacienteLoading(true);
    setExamenesPacienteError('');
    setExamenesPaciente([]);

    try {
      const response = await axiosServices.get(`${apiBase}/ExamenSnapshot/paciente/${noPaciente}`);
      const payload = response?.data;

      let lista = [];
      if (Array.isArray(payload)) {
        lista = payload;
      } else if (Array.isArray(payload?.datos)) {
        lista = payload.datos;
      } else if (payload?.datos && typeof payload.datos === 'object') {
        lista = [payload.datos];
      } else if (payload?.esCorrecto === false) {
        setExamenesPacienteError(
          payload?.mensaje || 'No se pudieron cargar los exámenes del paciente.',
        );
      }

      setExamenesPaciente(lista);
    } catch (err) {
      console.error('Error cargando exámenes del paciente:', err);
      setExamenesPaciente([]);
      setExamenesPacienteError('No se pudieron cargar los exámenes del paciente.');
    } finally {
      setExamenesPacienteLoading(false);
    }
  };

  const graduaciones = examen ? parsearGraduaciones(examen.xml_graduaciones) : null;

  const otrosDatos = examen
    ? Object.entries(examen).filter(([key]) => !CAMPOS_CONOCIDOS.has(key))
    : [];

  return (
    <PageContainer>
      <Breadcrumb title="Consulta de Exámenes" description="Buscar examen por número" />

      <ParentCard title="Búsqueda">
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <TextField
                fullWidth
                label="Número de examen"
                placeholder="Ej. 1024"
                value={filtroExamen}
                onChange={(e) => setFiltroExamen(e.target.value)}
                onKeyDown={handleKeyDown}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="Presioná Enter o usá el botón Buscar"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack
              direction={{ xs: 'column', sm: 'row', md: 'column' }}
              spacing={1}
              sx={{ height: '100%', justifyContent: 'center' }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => buscar()}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={18} color="inherit" /> : <SearchOutlinedIcon />
                }
                sx={{
                  minHeight: 56,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1.5,
                }}
              >
                {loading ? 'Buscando...' : 'Buscar examen'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddOutlinedIcon />}
                onClick={() => navigate('/crearexamen')}
                sx={{
                  minHeight: 44,
                  textTransform: 'none',
                  borderRadius: 1.5,
                }}
              >
                Crear nuevo
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              disablePortal
              loading={pacienteLoading}
              options={pacientes}
              value={pacienteSeleccionado}
              inputValue={pacienteTexto}
              onInputChange={(_, value, reason) => {
                if (reason === 'clear') {
                  setPacienteTexto('');
                  setPacienteSeleccionado(null);
                  return;
                }
                setPacienteTexto(value);
              }}
              onChange={async (_, newValue) => {
                setPacienteSeleccionado(newValue);
                setPacienteTexto(obtenerEtiquetaPaciente(newValue));

                if (!newValue) {
                  setExamenesPaciente([]);
                  setExamenesPacienteError('');
                  return;
                }

                await cargarExamenesPorPaciente(newValue);
              }}
              getOptionLabel={(paciente) => obtenerEtiquetaPaciente(paciente)}
              isOptionEqualToValue={(a, b) => {
                const idA =
                  a?.noPaciente ?? a?.NoPaciente ?? a?.no_paciente ?? a?.id ?? a?.identificador;
                const idB =
                  b?.noPaciente ?? b?.NoPaciente ?? b?.no_paciente ?? b?.id ?? b?.identificador;
                return idA != null && idB != null && idA === idB;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar paciente"
                  placeholder="Escribí nombre, cédula o número"
                  helperText="Se cargan los pacientes y se van restringiendo al escribir"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  key={
                    option?.noPaciente ??
                    option?.id ??
                    option?.identificador ??
                    `${option?.nombre}-${option?.cedula}`
                  }
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {obtenerEtiquetaPaciente(option)}
                    </Typography>
                    {(option?.cedula || option?.Cedula || option?.identificacion) && (
                      <Typography variant="caption" color="text.secondary">
                        {`Cédula: ${option.cedula || option.Cedula || option.identificacion}`}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            />

            {pacienteSeleccionado && (
              <Box mt={1.5}>
                <Box mt={1.5}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Exámenes del paciente
                  </Typography>

                  {examenesPacienteLoading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={18} />
                      <Typography variant="body2" color="text.secondary">
                        Cargando exámenes...
                      </Typography>
                    </Box>
                  ) : examenesPacienteError ? (
                    <Alert severity="info">{examenesPacienteError}</Alert>
                  ) : examenesPaciente.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                            <TableCell sx={{ fontWeight: 700 }}>N° examen</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {examenesPaciente.map((item, index) => {
                            const noExamen =
                              item?.no_examen ??
                              item?.NoExamen ??
                              item?.noExamen ??
                              item?.id_examen ??
                              item?.IdExamen ??
                              null;
                            const fechaExamen =
                              item?.fecha_examen ??
                              item?.FechaExamen ??
                              item?.fechaExamen ??
                              item?.fecha ??
                              null;
                            const fechaTexto = fechaExamen
                              ? formatearValor(fechaExamen, 'fecha')
                              : '—';

                            return (
                              <TableRow key={noExamen ?? `examen-${index}`}>
                                <TableCell>
                                  <Box
                                    component="button"
                                    onClick={() => buscar(noExamen)}
                                    sx={{
                                      border: 0,
                                      background: 'none',
                                      p: 0,
                                      color: 'primary.main',
                                      font: 'inherit',
                                      cursor: noExamen != null ? 'pointer' : 'default',
                                      textDecoration: 'underline',
                                    }}
                                  >
                                    {noExamen ?? '—'}
                                  </Box>
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{fechaTexto}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No hay exámenes registrados para este paciente.</Alert>
                  )}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        {error && (
          <Box mt={2}>
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </Box>
        )}
      </ParentCard>

      {!examen && !loading && !error && (
        <ParentCard title="Resultado">
          {buscado ? (
            <Alert severity="info">No se encontró un snapshot para el examen indicado.</Alert>
          ) : (
            <EstadoVacio />
          )}
        </ParentCard>
      )}

      {examen && (
        <ParentCard title="Detalle del snapshot">
          <ResumenExamen examen={examen} />

          {SECCIONES_EXAMEN.map((seccion) => (
            <SectionCard key={seccion.titulo} title={seccion.titulo}>
              <Grid container spacing={2}>
                {seccion.campos.map((campo) => (
                  <Grid
                    item
                    xs={12}
                    md={campo.multiline || campo.destacado ? 12 : 6}
                    key={campo.key}
                  >
                    <CampoSoloLectura
                      label={campo.label}
                      value={formatearValor(examen[campo.key], campo.tipo)}
                      multiline={campo.multiline}
                      destacado={campo.destacado}
                    />
                  </Grid>
                ))}
              </Grid>
            </SectionCard>
          ))}

          {graduaciones && (
            <SectionCard title="Graduaciones">
              <TablaGraduaciones graduaciones={graduaciones} />
            </SectionCard>
          )}

          {otrosDatos.length > 0 && (
            <SectionCard title="Otros datos">
              <Grid container spacing={2}>
                {otrosDatos.map(([key, valor]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <CampoSoloLectura
                      label={key}
                      value={valor === null || valor === undefined ? '—' : String(valor)}
                    />
                  </Grid>
                ))}
              </Grid>
            </SectionCard>
          )}

          <Box
            mt={1}
            p={2}
            borderRadius={2}
            sx={{
              bgcolor: alpha(theme.palette.grey[500], 0.04),
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Vista de solo lectura del snapshot almacenado. Para registrar un examen nuevo usá{' '}
              <Box
                component="button"
                onClick={() => navigate('/crearexamen')}
                sx={{
                  border: 0,
                  background: 'none',
                  p: 0,
                  m: 0,
                  color: 'primary.main',
                  font: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Crear nuevo examen
              </Box>
              .
            </Typography>
          </Box>
        </ParentCard>
      )}
    </PageContainer>
  );
};

export default ConsultaExamenVista;
