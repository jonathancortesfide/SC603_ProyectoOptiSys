import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from '@mui/material';
import {
  IconChevronDown,
  IconSearch,
  IconTrash,
  IconAlertCircle,
  IconCheck,
  IconX,
} from '@tabler/icons';
import ParentCard from '../../components/shared/ParentCard';
import useProductos from '../../hooks/useProductos';
import { getCurrentUsername } from '../../utils/session';
import {
  validarProducto,
  tieneErrores,
  formatearErrores,
  normalizarProducto,
  obtenerPrimerError,
} from '../../validators/ProductoValidator';
import { obtenerTipoLente } from '../../requests/mantenimientos/TipoLente/RequestsTipoLente';

const TIPOS_ARTICULO = ['Material', 'Servicio', 'Servicio-Externo'];
const TIPOS_IMPUESTO = ['Exento', 'IVA', 'Otro'];

/**
 * Formulario para crear y editar productos
 * Incluye validaciones completas según el manual
 */
const FormularioProducto = ({ producto, modoEdicion, onGuardar, onCancel }) => {
  const { crearProducto, actualizarProducto, loading, error, successMessage, cargarProductoPorId, productoActual } = useProductos();
  const usuarioActual = getCurrentUsername();

  // Estado del formulario
  const [form, setForm] = useState({
    idProducto: 0,
    noEmpresa: 1,
    codigo: '',
    nombre: '',
    descripcion: '',
    codigoBarras: '',
    codigoAuxiliar: '',
    codigoCabys: '',
    codigoProveedor: '',
    tipoArticulo: 'Material',
    noGrupo: '',
    noMarca: '',
    tipoImpuesto: 'IVA',
    porcentajeImpuesto: 13,
    unidadMedida: '',
    existencia: 0,
    minimo: 0,
    esPerecedero: false,
    esActivo: true,
    costoPromedio: 0,
    ultimoCosto: 0,
    ultimoPrecioCosto: 0,
    tipoProducto: 'AR',
    noTipo: 1,
    usuario: usuarioActual || 'sistema',
    identificador: 1,
    tipoLente: '',
    caracteristicas: '',
    foto: '',
  });

  const [errores, setErrores] = useState({});
  const [tiposLente, setTiposLente] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [guardoExitoso, setGuardoExitoso] = useState(false);

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    cargarTiposLente();
  }, []);

  // Verificar si la creación/actualización fue exitosa
  useEffect(() => {
    if (guardoExitoso && !loading && !error) {
      console.log('✅ Producto guardado exitosamente en Redux');
      setEnviando(false);
      onGuardar && onGuardar();
    }
  }, [guardoExitoso, loading, error, onGuardar]);

  // Mostrar error si ocurrió
  useEffect(() => {
    if (error && !guardoExitoso) {
      console.error('❌ Error en Redux:', error);
      setErrores({ general: error });
      setEnviando(false);
    }
  }, [error]);

  // Cargar datos iniciales cuando se abre el formulario
  useEffect(() => {
    if (modoEdicion && producto) {
      // Primero, llenar con los datos del producto de la lista (al menos tiene el ID)
      const idProducto = producto.idProducto || producto.id;
      
      setForm((prev) => ({
        ...prev,
        ...producto,
        idProducto: idProducto, // Asegurar que se preserva el ID
        nombre: producto.nombre || producto.descripcion,
        usuario: usuarioActual || 'sistema',
      }));
      
      console.log('📝 Modo edición, cargando producto con ID:', idProducto);
      
      // Luego, si tiene ID, cargar los datos completos del backend
      if (idProducto) {
        cargarProductoPorId(idProducto);
      }
    } else if (!modoEdicion) {
      // Modo crear: resetear con valores por defecto
      setForm((prev) => ({
        ...prev,
        idProducto: 0,
        usuario: usuarioActual || 'sistema',
      }));
      console.log('📝 Modo creación, idProducto = 0');
    }
    setErrores({});
  }, [modoEdicion, producto, usuarioActual, cargarProductoPorId]);

  // Cuando lleguen los datos completos del backend, actualizar el formulario
  useEffect(() => {
    if (productoActual && modoEdicion) {
      // Datos completos del backend - actualizamos, pero preservamos el idProducto
      const idProducto = productoActual.idProducto || form.idProducto;
      
      setForm((prev) => ({
        ...prev,
        ...productoActual,
        idProducto: idProducto, // Asegurar que se preserva el ID
        nombre: productoActual.nombre || productoActual.descripcion,
        usuario: usuarioActual || 'sistema',
      }));
      
      console.log('✅ Datos del backend recibidos, ID:', idProducto);
    }
  }, [productoActual, modoEdicion, usuarioActual, form.idProducto]);

  // ============================================
  // CARGA DE DATOS
  // ============================================

  const cargarTiposLente = async () => {
    try {
      const data = await obtenerTipoLente();
      if (data && Array.isArray(data) && data.length > 0) {
        setTiposLente(
          data
            .filter((t) => t.activo)
            .map((t) => ({ value: t.no_tipo, label: t.descripcion }))
        );
      } else {
        setTiposLente([
          { value: 'Monofocal', label: 'Monofocal' },
          { value: 'Bifocal', label: 'Bifocal' },
          { value: 'Progresivo', label: 'Progresivo' },
          { value: 'Otro', label: 'Otro' },
        ]);
      }
    } catch (err) {
      console.error('Error cargando tipos de lente:', err);
    }
  };

  // ============================================
  // MANEJADORES DE CAMBIOS
  // ============================================

  const handleChange = useCallback(
    (campo) => (e) => {
      const valor =
        e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [campo]: valor }));
      // Limpiar error del campo
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    },
    []
  );

  const handleFotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, foto: reader.result }));
      setErrores((prev) => ({ ...prev, foto: undefined }));
    };
    reader.readAsDataURL(file);
  }, []);

  // ============================================
  // ENVÍO DE FORMULARIO
  // ============================================

  const handleSubmit = async () => {
    // Validar
    const erroresValidacion = validarProducto(form);

    if (tieneErrores(erroresValidacion)) {
      setErrores(erroresValidacion);
      return;
    }

    setEnviando(true);
    setGuardoExitoso(false);
    
    // Limpiar errores previos
    setErrores({});

    try {
      // Normalizar datos
      const productoNormalizado = normalizarProducto(form);

      console.log('📝 FormularioProducto - Enviando:', productoNormalizado);
      console.log('👤 Usuario actual:', productoNormalizado.Usuario);
      console.log('👥 Grupo (NoGrupo):', productoNormalizado.NoGrupo);

      // Enviar (el resultado se verifica en el useEffect)
      if (modoEdicion) {
        await actualizarProducto(productoNormalizado);
      } else {
        await crearProducto(productoNormalizado);
      }

      // Marcar como que se envió, el useEffect verificará el resultado
      setGuardoExitoso(true);
    } catch (err) {
      console.error('❌ Error al guardar producto:', err);
      setErrores({
        general: err.message || 'Error al guardar el producto',
      });
      setEnviando(false);
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  const mensajesError = formatearErrores(errores).slice(0, 3);
  const primerError = obtenerPrimerError(errores);

  return (
    <ParentCard
      title={
        modoEdicion
          ? `Editar Producto - ${form.codigo}`
          : 'Crear Nuevo Producto'
      }
    >
      <Box sx={{ p: 2 }}>
        {/* Errores generales */}
        {(error || errores.general) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Error:</strong> {error || errores.general}
          </Alert>
        )}

        {/* Errores de validación */}
        {mensajesError.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Validación requerida:</strong>
            <ul style={{ margin: '8px 0 0 0' }}>
              {mensajesError.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Formulario */}
        <Grid container spacing={2}>
          {/* INFORMACIÓN BÁSICA */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<IconChevronDown />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  📋 Información Básica
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tipo de artículo *"
                      select
                      fullWidth
                      size="small"
                      value={form.tipoArticulo}
                      onChange={handleChange('tipoArticulo')}
                      error={Boolean(errores.tipoArticulo)}
                      helperText={errores.tipoArticulo}
                    >
                      {TIPOS_ARTICULO.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Código interno *"
                      fullWidth
                      size="small"
                      value={form.codigo}
                      onChange={handleChange('codigo')}
                      error={Boolean(errores.codigo)}
                      helperText={errores.codigo}
                      placeholder="Ej: PROD-001"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Nombre del producto *"
                      fullWidth
                      size="small"
                      value={form.nombre}
                      onChange={handleChange('nombre')}
                      error={Boolean(errores.nombre)}
                      helperText={errores.nombre}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Descripción *"
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      value={form.descripcion}
                      onChange={handleChange('descripcion')}
                      error={Boolean(errores.descripcion)}
                      helperText={errores.descripcion}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Código de barras"
                      fullWidth
                      size="small"
                      value={form.codigoBarras}
                      onChange={handleChange('codigoBarras')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Código auxiliar"
                      fullWidth
                      size="small"
                      value={form.codigoAuxiliar}
                      onChange={handleChange('codigoAuxiliar')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Código CABYS"
                      fullWidth
                      size="small"
                      value={form.codigoCabys}
                      onChange={handleChange('codigoCabys')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Unidad de medida"
                      fullWidth
                      size="small"
                      value={form.unidadMedida}
                      onChange={handleChange('unidadMedida')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Código proveedor"
                      fullWidth
                      size="small"
                      value={form.codigoProveedor || ''}
                      onChange={handleChange('codigoProveedor')}
                      error={Boolean(errores.codigoProveedor)}
                      helperText={errores.codigoProveedor}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* CLASIFICACIÓN */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<IconChevronDown />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  🏷️ Clasificación
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tipo de producto"
                      select
                      fullWidth
                      size="small"
                      value={form.tipoProducto || 'AR'}
                      onChange={handleChange('tipoProducto')}
                      error={Boolean(errores.tipoProducto)}
                      helperText={errores.tipoProducto}
                    >
                      <MenuItem value="AR">Aro (AR)</MenuItem>
                      <MenuItem value="MT">Material (MT)</MenuItem>
                      <MenuItem value="SV">Servicio (SV)</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Número de tipo"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.noTipo || 1}
                      onChange={handleChange('noTipo')}
                      error={Boolean(errores.noTipo)}
                      helperText={errores.noTipo}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Grupo"
                      select
                      fullWidth
                      size="small"
                      value={form.noGrupo || ''}
                      onChange={(e) => {
                        const valor = e.target.value;
                        handleChange('noGrupo')(e);
                        console.log('🏷️ Grupo seleccionado:', valor, 'tipo:', typeof valor);
                      }}
                      error={Boolean(errores.noGrupo)}
                      helperText={errores.noGrupo || 'Opcional - se asignará automáticamente'}
                    >
                      <MenuItem value="">Seleccionar grupo</MenuItem>
                      <MenuItem value="1">Lentes</MenuItem>
                      <MenuItem value="2">Accesorios</MenuItem>
                      <MenuItem value="3">Armazones</MenuItem>
                      <MenuItem value="4">Otros</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Marca"
                      select
                      fullWidth
                      size="small"
                      value={form.noMarca || ''}
                      onChange={handleChange('noMarca')}
                    >
                      <MenuItem value="">Sin marca</MenuItem>
                      <MenuItem value={1}>Marca A</MenuItem>
                      <MenuItem value={2}>Marca B</MenuItem>
                      <MenuItem value={3}>Marca C</MenuItem>
                    </TextField>
                  </Grid>

                  {form.tipoArticulo === 'Material' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Tipo de lente"
                        select
                        fullWidth
                        size="small"
                        value={form.tipoLente}
                        onChange={handleChange('tipoLente')}
                      >
                        <MenuItem value="">Seleccionar</MenuItem>
                        {tiposLente.map((t) => (
                          <MenuItem key={t.value} value={t.value}>
                            {t.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Características"
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      value={form.caracteristicas}
                      onChange={handleChange('caracteristicas')}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* IMPUESTOS Y PRECIOS */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<IconChevronDown />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  💰 Impuestos y Precios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tipo de impuesto"
                      select
                      fullWidth
                      size="small"
                      value={form.tipoImpuesto}
                      onChange={handleChange('tipoImpuesto')}
                    >
                      {TIPOS_IMPUESTO.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Porcentaje de impuesto"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.porcentajeImpuesto}
                      onChange={handleChange('porcentajeImpuesto')}
                      error={Boolean(errores.porcentajeImpuesto)}
                      helperText={errores.porcentajeImpuesto}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Costo promedio"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.costoPromedio}
                      onChange={handleChange('costoPromedio')}
                      error={Boolean(errores.costoPromedio)}
                      helperText={errores.costoPromedio}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₡</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Último costo"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.ultimoCosto}
                      onChange={handleChange('ultimoCosto')}
                      error={Boolean(errores.ultimoCosto)}
                      helperText={errores.ultimoCosto}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₡</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Último precio costo"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.ultimoPrecioCosto}
                      onChange={handleChange('ultimoPrecioCosto')}
                      error={Boolean(errores.ultimoPrecioCosto)}
                      helperText={errores.ultimoPrecioCosto}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₡</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* INVENTARIO */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<IconChevronDown />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  📦 Inventario
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Existencia actual"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.existencia}
                      onChange={handleChange('existencia')}
                      error={Boolean(errores.existencia)}
                      helperText={errores.existencia}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Stock mínimo"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.minimo}
                      onChange={handleChange('minimo')}
                      error={Boolean(errores.minimo)}
                      helperText={errores.minimo}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.esPerecedero}
                          onChange={handleChange('esPerecedero')}
                        />
                      }
                      label="¿Es perecedero?"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* ESTADO */}
          <Grid item xs={12}>
            <Divider />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.esActivo}
                  onChange={handleChange('esActivo')}
                />
              }
              label="Producto Activo"
              sx={{ mt: 2 }}
            />
          </Grid>

          {/* BOTONES */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onCancel}>
                <IconX size={18} style={{ marginRight: 4 }} />
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={enviando || loading}
              >
                {enviando || loading ? (
                  <>
                    <CircularProgress size={18} sx={{ mr: 1 }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <IconCheck size={18} style={{ marginRight: 4 }} />
                    {modoEdicion ? 'Actualizar' : 'Crear'} Producto
                  </>
                )}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ParentCard>
  );
};

export default FormularioProducto;
