import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PageContainer from 'src/components/container/PageContainer';
import { getNombreEmpresaSesion } from '../../utils/empresa';
import { getNombreSucursalSesion } from '../../utils/sucursal';
import { obtenerListaDePacientes } from '../../requests/pacientes/RequestsPacientes';

const DIAS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const formatFechaLarga = (fecha) => {
  const d = fecha ?? new Date();
  return `${DIAS_ES[d.getDay()]}, ${d.getDate()} de ${MESES_ES[d.getMonth()]} de ${d.getFullYear()}`;
};

const Saludo = () => {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const AccesoRapido = ({ icono, color, titulo, descripcion, ruta, navigate }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'transform 0.18s, box-shadow 0.18s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[8] },
      }}
    >
      <CardActionArea sx={{ height: '100%', p: 0 }} onClick={() => navigate(ruta)}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
            <Avatar sx={{ bgcolor: `${color}20`, width: 48, height: 48 }}>
              {React.cloneElement(icono, { sx: { color, fontSize: 26 } })}
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              {titulo}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {descripcion}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const StatCard = ({ icono, color, valor, etiqueta }) => (
  <Card elevation={2} sx={{ borderRadius: 3, borderLeft: `4px solid ${color}` }}>
    <CardContent sx={{ p: '20px !important' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700} color={color}>
            {valor}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {etiqueta}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}18`, width: 52, height: 52 }}>
          {React.cloneElement(icono, { sx: { color, fontSize: 28 } })}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

const SamplePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const today = new Date();

  const nombreEmpresa = getNombreEmpresaSesion() || 'Elixir ERP';
  const nombreSucursal = getNombreSucursalSesion();

  const [totalPacientes, setTotalPacientes] = useState('—');

  useEffect(() => {
    obtenerListaDePacientes()
      .then((data) => {
        if (Array.isArray(data)) {
          const activos = data.filter((p) => p.activo !== false).length;
          setTotalPacientes(activos);
        }
      })
      .catch(() => setTotalPacientes('—'));
  }, []);

  const modulos = [
    {
      icono: <PeopleAltOutlinedIcon />,
      color: theme.palette.primary.main,
      titulo: 'Pacientes',
      descripcion: 'Registro, búsqueda y gestión de pacientes.',
      ruta: '/pacientes',
    },
    {
      icono: <AddCircleOutlineIcon />,
      color: theme.palette.success.main,
      titulo: 'Crear Examen',
      descripcion: 'Registrar un nuevo examen de la vista.',
      ruta: '/crearexamen',
    },
    {
      icono: <SearchOutlinedIcon />,
      color: theme.palette.secondary.dark,
      titulo: 'Consultar Exámenes',
      descripcion: 'Buscar y revisar exámenes existentes.',
      ruta: '/verexamenes',
    },
    {
      icono: <ReceiptOutlinedIcon />,
      color: theme.palette.warning.main,
      titulo: 'Facturación',
      descripcion: 'Emisión y consulta de facturas.',
      ruta: '/facturacion',
    },
    {
      icono: <Inventory2OutlinedIcon />,
      color: theme.palette.error.main,
      titulo: 'Productos',
      descripcion: 'Catálogo y control de inventario.',
      ruta: '/productos',
    },
    {
      icono: <BuildOutlinedIcon />,
      color: '#7C5CBF',
      titulo: 'Mantenimientos',
      descripcion: 'Monedas, marcas, lentes, proveedores y más.',
      ruta: '/mantenimientos/moneda',
    },
    {
      icono: <SecurityOutlinedIcon />,
      color: '#1DB9AA',
      titulo: 'Seguridad',
      descripcion: 'Roles, permisos y usuarios del sistema.',
      ruta: '/seguridad',
    },
  ];

  return (
    <PageContainer title="Inicio" description="Panel principal de Elixir ERP">
      <Box sx={{ px: { xs: 0, sm: 1 }, py: 1 }}>

        {/* ── Banner de bienvenida ── */}
        <Card
          elevation={3}
          sx={{
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 100%)`,
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
                  <StorefrontOutlinedIcon sx={{ fontSize: 28, opacity: 0.85 }} />
                  <Typography variant="h4" fontWeight={700}>
                    {Saludo()}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  {nombreEmpresa}
                  {nombreSucursal ? ` · ${nombreSucursal}` : ''}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                  Bienvenido al sistema de administración de ópticas
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.88 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography variant="body1" fontWeight={500}>
                  {formatFechaLarga(today)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* ── Tarjetas de resumen ── */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icono={<PeopleAltOutlinedIcon />}
              color={theme.palette.primary.main}
              valor={totalPacientes}
              etiqueta="Pacientes activos"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icono={<VisibilityOutlinedIcon />}
              color={theme.palette.success.main}
              valor="—"
              etiqueta="Exámenes del mes"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icono={<ReceiptOutlinedIcon />}
              color={theme.palette.warning.main}
              valor="—"
              etiqueta="Facturas del mes"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icono={<Inventory2OutlinedIcon />}
              color={theme.palette.error.main}
              valor="—"
              etiqueta="Productos en stock"
            />
          </Grid>
        </Grid>

        {/* ── Acceso rápido a módulos ── */}
        <Box mb={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight={700}>
              Módulos del sistema
            </Typography>
            <Chip label="Acceso rápido" size="small" color="primary" variant="outlined" />
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {modulos.map((m) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={m.ruta}>
                <AccesoRapido {...m} navigate={navigate} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Acciones frecuentes ── */}
        <Box mt={5}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Acciones frecuentes
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              startIcon={<PeopleAltOutlinedIcon />}
              onClick={() => navigate('/pacientes')}
              sx={{ borderRadius: 2 }}
            >
              Nuevo paciente
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate('/crearexamen')}
              sx={{ borderRadius: 2 }}
            >
              Nuevo examen
            </Button>
            <Button
              variant="outlined"
              startIcon={<SearchOutlinedIcon />}
              onClick={() => navigate('/verexamenes')}
              sx={{ borderRadius: 2 }}
            >
              Buscar examen
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ReceiptOutlinedIcon />}
              onClick={() => navigate('/facturacion')}
              sx={{ borderRadius: 2 }}
            >
              Nueva factura
            </Button>
          </Stack>
        </Box>

      </Box>
    </PageContainer>
  );
};

export default SamplePage;
