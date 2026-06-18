import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Autocomplete,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {
  obtenerTiposLente,
  obtenerMaterialesPorTipo,
  obtenerProductosAro,
  obtenerLaboratorios,
} from "../../requests/examenes/RequestsDisenoLente";

const SectionCard = ({ title, children }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      borderRadius: 2,
      borderColor: "divider",
      mb: 2,
    }}
  >
    <Typography
      variant="overline"
      sx={{
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: "text.secondary",
        display: "block",
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
  const [aroMaterial, setAroMaterial] = useState("");

  const [aroSelected, setAroSelected] = useState(null);
  const [aroOptions, setAroOptions] = useState([]);
  const [aroProductoId, setAroProductoId] = useState(null);
  const [aroSearchLoading, setAroSearchLoading] = useState(false);
  const [aroComboOpen, setAroComboOpen] = useState(false);

  const [aroPreview, setAroPreview] = useState(null);
  const [aroFileName, setAroFileName] = useState("");

  const [laboratorio, setLaboratorio] = useState("");
  const [numOrden, setNumOrden] = useState("");
  const [numLaboratorio, setNumLaboratorio] = useState("");

  const [disposicion, setDisposicion] = useState("");
  const [tratamiento, setTratamiento] = useState("");

  const [tiposLente, setTiposLente] = useState([]);
  const [materiales, setMateriales] = useState([]);

  const [labOptions, setLabOptions] = useState([]);
  const [labSearchLoading, setLabSearchLoading] = useState(false);
  const [labSelected, setLabSelected] = useState(null);

  const fileInputRef = useRef();

  // ── Cargar tipos de lente al montar ────────────────────────────────────────
  useEffect(() => {
    const cargarTiposLente = async () => {
      const data = await obtenerTiposLente();

      const lista = data.map((item) => ({
        no_tipo: item.no_tipo,
        descripcion: item.descripcion,
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
        descripcion: item.descripcion || "",
        ultimo_precio:
          item.ultimo_precio ??
          item.ultimoPrecio ??
          item.ultimoCosto ??
          "",
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

      const options = data
        .map((item) => ({
          id: item.idProveedor ?? item.id ?? item.Id ?? null,
          nombre:
            item.nombre ??
            item.Nombre ??
            item.razon_social ??
            item.razonSocial ??
            String(item),
          no_proveedor:
            item.no_proveedor ??
            item.noProveedor ??
            item.no_provedor ??
            item.numeroProveedor ??
            item.idProveedor ??
            "",
        }))
        .filter((o) => o.nombre);

      setLabOptions(options);
      setLabSearchLoading(false);
    };

    cargarLaboratorios();
  }, []);

  const getPrecioDeItem = (item) => {
    if (!item) return "";

    return (
      item.ultimo_precio ??
      item.ultimoPrecio ??
      item.ultimoPrecioCosto ??
      item.ultimoCosto ??
      item.costoPromedio ??
      ""
    );
  };

  const handleAroUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAroFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setAroPreview(ev.target.result);
    reader.readAsDataURL(file);
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
        descripcion: item.descripcion || item.Descripcion || "",
        ultimo_precio:
          item.ultimo_precio ??
          item.ultimoPrecio ??
          item.ultimoPrecioCosto ??
          item.ultimoCosto ??
          item.costoPromedio ??
          "",
      }))
      .filter((item) => item.descripcion);

    setAroOptions(options);
    setAroComboOpen(options.length > 0);
    setAroSearchLoading(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
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
              value={tipoLente?.no_tipo || ""}
              onChange={(e) => {
                const seleccionado = tiposLente.find(
                  (t) => t.no_tipo === e.target.value
                );
                setTipoLente(seleccionado || null);
              }}
              fullWidth
              size="small"
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
              getOptionLabel={(option) => option.descripcion || ""}
              isOptionEqualToValue={(option, value) =>
                option.idProducto === value.idProducto
              }
              value={material}
              onChange={(_, newValue) => setMaterial(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Material"
                  placeholder="Buscar material..."
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* SECCIÓN 2: Aro */}
      <SectionCard title="Aro">
        <Box display="flex" gap={2} alignItems="flex-start" flexWrap="wrap">
          {/* Preview */}
          <Box
            sx={{
              width: 72,
              height: 72,
              flexShrink: 0,
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {aroPreview ? (
              <Box
                component="img"
                src={aroPreview}
                alt="Aro"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <ImageOutlinedIcon sx={{ color: "text.disabled", fontSize: 30 }} />
            )}
          </Box>

          {/* Info + botón */}
          <Box flex={1} minWidth={260}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mb={1}
              flexWrap="wrap"
            >
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ maxWidth: "70%" }}
              >
                {aroFileName || "Sin foto del aro"}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                startIcon={<PhotoCamera />}
                onClick={() => fileInputRef.current.click()}
                sx={{ textTransform: "none" }}
              >
                Subir foto
              </Button>
            </Box>

            <Box display="flex" gap={1}>
              <Autocomplete
                freeSolo
                open={aroComboOpen}
                onClose={() => setAroComboOpen(false)}
                options={aroOptions}
                filterOptions={(options) => options}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.descripcion || ""
                }
                value={aroSelected}
                inputValue={aroMaterial}
                onInputChange={(_, newInputValue, reason) => {
                  if (reason === "reset") return;

                  setAroMaterial(newInputValue);
                  setAroSelected(null);
                  setAroProductoId(null);

                  if (!newInputValue) {
                    setAroOptions([]);
                    setAroComboOpen(false);
                  }
                }}
                onChange={(_, newValue) => {
                  if (!newValue) {
                    setAroSelected(null);
                    setAroProductoId(null);
                    setExamen((prev) => ({ ...prev, CostoAro: "" }));
                    return;
                  }

                  if (typeof newValue === "string") {
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
                    CostoAro: precio !== null ? precio : "",
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
                    onFocus={() => {
                      if (aroOptions.length > 0) setAroComboOpen(true);
                    }} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
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
                sx={{ whiteSpace: "nowrap", textTransform: "none", minWidth: 90 }}
              >
                Buscar
              </Button>
            </Box>

            <input
              ref={fileInputRef}
              hidden
              accept="image/*"
              type="file"
              onChange={handleAroUpload}
            />
          </Box>
        </Box>
      </SectionCard>

      {/* SECCIÓN 3: Laboratorio */}
      <SectionCard title="Laboratorio">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={labOptions}
              getOptionLabel={(option) => option.nombre || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={labSelected}
              loading={labSearchLoading}
              onChange={(_, newValue) => {
                setLabSelected(newValue);
                setLaboratorio(newValue?.nombre || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Laboratorio"
                  placeholder="Seleccionar laboratorio..."
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="N° de orden"
              value={numOrden}
              onChange={(e) => setNumOrden(e.target.value)}
              placeholder="000-0000"
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="N° de laboratorio"
              value={numLaboratorio}
              onChange={(e) => setNumLaboratorio(e.target.value)}
              placeholder="LAB-000"
              fullWidth
              size="small"
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
              onChange={(e) => setDisposicion(e.target.value)}
              placeholder="Agregar disposición..."
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tratamiento"
              value={tratamiento}
              onChange={(e) => setTratamiento(e.target.value)}
              placeholder="Agregar tratamiento..."
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </SectionCard>
    </Box>
  );
}