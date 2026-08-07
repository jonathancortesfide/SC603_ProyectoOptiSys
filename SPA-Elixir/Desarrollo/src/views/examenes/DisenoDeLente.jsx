import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  obtenerLaboratorios,
  obtenerMaterialesPorTipo,
  obtenerProductosAro,
  obtenerTiposLente,
} from '../../requests/examenes/RequestsDisenoLente';

const SectionCard = ({ title, children }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      borderRadius: 2,
      borderColor: 'divider',
      mb: 2,
    }}
  >
    <Typography
      variant="overline"
      sx={{
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: 'text.secondary',
        display: 'block',
        mb: 1.5,
      }}
    >
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

export default function DisenoDeLente({ examen, setExamen }) {
  const [tipoLente, setTipoLente] = useState(null);
  const [material, setMaterial] = useState(null);
  const [aroMaterial, setAroMaterial] = useState('');

  const [aroSelected, setAroSelected] = useState(null);
  const [aroOptions, setAroOptions] = useState([]);
  const [aroProductoId, setAroProductoId] = useState(null);
  const [aroSearchLoading, setAroSearchLoading] = useState(false);
  const [aroComboOpen, setAroComboOpen] = useState(false);

  const [laboratorio, setLaboratorio] = useState('');
  const [numOrden, setNumOrden] = useState('');
  const [numLaboratorio, setNumLaboratorio] = useState('');
  const [noProveedorLaboratorio, setNoProveedorLaboratorio] = useState('');

  const [disposicion, setDisposicion] = useState('');
  const [tratamiento, setTratamiento] = useState('');

  const [tiposLente, setTiposLente] = useState([]);
  const [materiales, setMateriales] = useState([]);

  const [labOptions, setLabOptions] = useState([]);
  const [labSearchLoading, setLabSearchLoading] = useState(false);
  const [labSelected, setLabSelected] = useState(null);

  // ── Cargar tipos de lente al montar ────────────────────────────────────────
  useEffect(() => {
    const cargarTiposLente = async () => {
      const data = await obtenerTiposLente();

      const lista = data.map((item) => ({
        no_tipo: item.no_tipo,
        descripcion: item.descripcion,
        price: item.price ?? item.Price ?? null,
      }));

      setTiposLente(lista);
    };

    cargarTiposLente();
  }, []);

  useEffect(() => {
    const cargarMateriales = async () => {
      if (!tipoLente?.no_tipo) {
        setMateriales([]);
        return;
      }
      const productos = await obtenerMaterialesPorTipo(tipoLente.no_tipo, null);
      console.log('Materiales obtenidos para tipo', tipoLente.no_tipo, ':', productos);
      const lista = productos.map((item) => ({
        idProducto: item.idProducto,
        descripcion: item.descripcion || '',
        ultimo_precio: item.ultimo_precio ?? item.ultimoPrecio ?? item.ultimoCosto ?? '',
      }));

      setMateriales(lista);
      setMaterial(null);
    };

    cargarMateriales();
  }, [tipoLente]);

  // ── Cargar laboratorios al montar ──────────────────────────────────────────
  useEffect(() => {
    const cargarLaboratorios = async () => {
      setLabSearchLoading(true);

      const data = await obtenerLaboratorios();
      console.log('Laboratorios obtenidos:', data);
      const options = data
        .map((item) => ({
          id: item.idProveedor ?? item.id ?? item.Id ?? null,
          nombre:
            item.nombre ?? item.Nombre ?? item.razon_social ?? item.razonSocial ?? String(item),
          no_proveedor:
            item.no_proveedor ??
            item.noProveedor ??
            item.no_provedor ??
            item.numeroProveedor ??
            item.idProveedor ??
            '',
        }))
        .filter((o) => o.nombre);

      setLabOptions(options);
      setLabSearchLoading(false);
    };

    cargarLaboratorios();
  }, []);

  const getPrecioDeItem = (item) => {
    if (!item) return '';

    return (
      item.ultimo_precio ??
      item.ultimoPrecio ??
      item.ultimoPrecioCosto ??
      item.ultimoCosto ??
      item.costoPromedio ??
      ''
    );
  };

  const buscarAroMaterial = async () => {
    const descripcion = aroMaterial?.trim();
    if (!descripcion) return;

    setAroSearchLoading(true);
    setAroOptions([]);
    setAroSelected(null);
    setAroProductoId(null);
    setAroComboOpen(false);

    const productos = await obtenerProductosAro(descripcion);

    const options = productos
      .map((item) => ({
        idProducto: item.idProducto,
        descripcion: item.descripcion || item.Descripcion || '',
        ultimo_precio:
          item.ultimo_precio ??
          item.ultimoPrecio ??
          item.ultimoPrecioCosto ??
          item.ultimoCosto ??
          item.costoPromedio ??
          '',
      }))
      .filter((item) => item.descripcion);

    setAroOptions(options);
    setAroComboOpen(options.length > 0);
    setAroSearchLoading(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
        Diseño de lente
      </Typography>

      {/* SECCIÓN 1: Lente */}
      <SectionCard title="Lente">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Tipo de lente"
              value={tipoLente?.no_tipo || ''}
              onChange={(e) => {
                const seleccionado = tiposLente.find((t) => t.no_tipo === e.target.value);
                setTipoLente(seleccionado || null);
                setExamen((prev) => ({
                  ...prev,
                  TipoLente: seleccionado?.descripcion || '',
                  TipoLenteId: seleccionado?.no_tipo ?? null,
                  CostoLente: seleccionado?.price != null ? seleccionado.price : prev.CostoLente,
                }));
              }}
              fullWidth
              size="small"
              required
            >
              <MenuItem value="">
                <em>Seleccionar...</em>
              </MenuItem>
              {tiposLente.map((tipo) => (
                <MenuItem key={tipo.no_tipo} value={tipo.no_tipo}>
                  {tipo.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={materiales}
              getOptionLabel={(option) => option.descripcion || ''}
              isOptionEqualToValue={(option, value) => option.idProducto === value.idProducto}
              value={material}
              onChange={(_, newValue) => {
                setMaterial(newValue);
                const precio = getPrecioDeItem(newValue);
                setExamen((prev) => ({
                  ...prev,
                  Material: newValue?.descripcion || '',
                  MaterialId: newValue?.idProducto ?? null,
                  CostoMaterial: precio !== null ? precio : '',
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Material"
                  placeholder="Buscar material..."
                  size="small"
                  required
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* SECCIÓN 2: Aro */}
      <SectionCard title="Aro">
        <Box display="flex" gap={1}>
          <Autocomplete
            freeSolo
            open={aroComboOpen}
            onClose={() => setAroComboOpen(false)}
            options={aroOptions}
            filterOptions={(options) => options}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.descripcion || ''
            }
            value={aroSelected}
            inputValue={aroMaterial}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === 'reset') return;

              setAroMaterial(newInputValue);
              setAroSelected(null);
              setAroProductoId(null);
              setExamen((prev) => ({ ...prev, Aro: newInputValue }));

              if (!newInputValue) {
                setAroOptions([]);
                setAroComboOpen(false);
              }
            }}
            onChange={(_, newValue) => {
              if (!newValue) {
                setAroSelected(null);
                setAroProductoId(null);
                setExamen((prev) => ({ ...prev, Aro: '', CodigoAro: '', CostoAro: '' }));
                return;
              }

              if (typeof newValue === 'string') {
                setAroMaterial(newValue);
                return;
              }

              setAroSelected(newValue);
              setAroMaterial(newValue.descripcion);
              setAroProductoId(newValue.idProducto);
              setAroComboOpen(false);

              const precio = getPrecioDeItem(newValue);
              setExamen((prev) => ({
                ...prev,
                Aro: newValue.descripcion || '',
                CodigoAro: newValue.idProducto ?? '',
                CostoAro: precio !== null ? precio : '',
              }));
            }}
            onOpen={() => {
              if (aroOptions.length > 0) setAroComboOpen(true);
            }}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar aro"
                placeholder="Descripción del artículo"
                size="small"
                required
                onFocus={() => {
                  if (aroOptions.length > 0) setAroComboOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    buscarAroMaterial();
                  }
                }}
              />
            )}
          />

          <Button
            variant="contained"
            size="small"
            onClick={buscarAroMaterial}
            disabled={aroSearchLoading}
            sx={{ whiteSpace: 'nowrap', textTransform: 'none', minWidth: 90 }}
          >
            Buscar
          </Button>
        </Box>
      </SectionCard>

      {/* SECCIÓN 3: Laboratorio */}
      <SectionCard title="Laboratorio">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={labOptions}
              getOptionLabel={(option) => option.nombre || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={labSelected}
              loading={labSearchLoading}
              onChange={(_, newValue) => {
                const noProveedor = newValue?.no_proveedor ?? '';
                setLabSelected(newValue);
                setLaboratorio(newValue?.nombre || '');
                setNoProveedorLaboratorio(noProveedor);
                setExamen((prev) => ({
                  ...prev,
                  Laboratorio: newValue?.nombre || '',
                  NoProveedor: noProveedor,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Laboratorio"
                  placeholder="Seleccionar laboratorio..."
                  size="small"
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="N° de orden"
              value={numOrden}
              onChange={(e) => {
                setNumOrden(e.target.value);
                setExamen((prev) => ({ ...prev, NumeroOrdenLaboratorio: e.target.value }));
              }}
              placeholder="000-0000"
              fullWidth
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="N° de laboratorio"
              value={noProveedorLaboratorio}
              onChange={(e) => {
                setNumLaboratorio(e.target.value);
                setExamen((prev) => ({ ...prev, NumeroPedidoLaboratorio: e.target.value }));
              }}
              placeholder="Sin selección"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* SECCIÓN 4: Notas adicionales */}
      <SectionCard title="Notas adicionales">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Disposición"
              value={disposicion}
              onChange={(e) => {
                setDisposicion(e.target.value);
                setExamen((prev) => ({ ...prev, Disposicion: e.target.value }));
              }}
              placeholder="Agregar disposición..."
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tratamiento"
              value={tratamiento}
              onChange={(e) => {
                setTratamiento(e.target.value);
                setExamen((prev) => ({ ...prev, Tratamiento: e.target.value }));
              }}
              placeholder="Agregar tratamiento..."
              fullWidth
              size="small"
              required
            />
          </Grid>
        </Grid>
      </SectionCard>
    </Box>
  );
}
