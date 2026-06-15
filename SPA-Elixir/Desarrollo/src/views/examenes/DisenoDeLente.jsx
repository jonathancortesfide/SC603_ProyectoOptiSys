import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { getNoEmpresa, getSucursalIdentificador } from "../../utils/sucursal";

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
  const apiBase = import.meta.env.VITE_ApiBase;
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

  useEffect(() => {
    if (labSelected) {
      setNumLaboratorio(labSelected.no_proveedor ?? "");
      // Guardar datos relevantes del laboratorio en el examen compartido
      setExamen((prev) => ({
        ...prev,
        laboratorio: labSelected,
        LaboratorioNombre: labSelected.nombre ?? "",
        LaboratorioCodigo: labSelected.no_proveedor ?? "",
        LaboratorioId: labSelected.id ?? labSelected.idProveedor ?? null,
        numLaboratorio: labSelected.no_proveedor ?? prev.numLaboratorio ?? "",
      }));
    }
  }, [labSelected]);

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

  useEffect(() => {
    const fetchTiposLente = async () => {
      try {
        const identificador = getNoEmpresa();
        const url = `https://localhost:44352/api/TipoLente/Obtener?identificador=${encodeURIComponent(
          identificador
        )}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error ${response.status} al cargar tipos de lente`);
        }

        const data = await response.json();
        const lista =
          data.tipoDeLente && Array.isArray(data.tipoDeLente)
            ? data.tipoDeLente.map((item) => ({
                no_tipo: item.no_tipo,
                descripcion: item.descripcion,
              }))
            : [];

        setTiposLente(lista);
      } catch (error) {
        console.error("No se pudo cargar tipos de lente:", error);
      }
    };

    fetchTiposLente();
  }, []);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        if (!tipoLente || !tipoLente.no_tipo) {
          setMateriales([]);
          return;
        }

        const identificador = getNoEmpresa();
        const noTipo = tipoLente.no_tipo;
        const url = `${apiBase}/Productos/ObtenerProductosMT/${encodeURIComponent(
          identificador
        )}/${encodeURIComponent(noTipo)}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error ${response.status} al cargar materiales`);
        }

        const data = await response.json();

        let lista = [];
        const productos =
          Array.isArray(data) && data.length > 0
            ? data
            : Array.isArray(data.laListaDeProductos)
            ? data.laListaDeProductos
            : Array.isArray(data.productos)
            ? data.productos
            : [];

        lista = productos.map((item) => ({
          idProducto: item.idProducto,
          descripcion: item.descripcion || item.Descripcion || String(item),
          ultimo_precio:
            item.ultimo_precio ??
            item.ultimoPrecio ??
            item.ultimoPrecioCosto ??
            item.ultimoCosto ??
            item.costoPromedio ??
            "",
        }));

        setMateriales(lista);
        setMaterial(null);
      } catch (error) {
        console.error("No se pudo cargar materiales:", error);
      }
    };

    fetchMateriales();
  }, [tipoLente]);



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

    try {
      const identificador = getNoEmpresa();
      const url = `${apiBase}/Productos/ObtenerProductosAR/${encodeURIComponent(
        identificador
      )}/${encodeURIComponent(descripcion)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al buscar material de aro`);
      }

      const data = await response.json();
      const productos = Array.isArray(data)
        ? data
        : Array.isArray(data.laListaDeProductos)
        ? data.laListaDeProductos
        : Array.isArray(data.productos)
        ? data.productos
        : [data];

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
    } catch (error) {
      console.error("No se pudo buscar material de aro:", error);
      setAroOptions([]);
      setAroComboOpen(false);
    } finally {
      setAroSearchLoading(false);
    }
  };

  const buscarLaboratorios = async () => {
    setLabSearchLoading(true);
    setLabOptions([]);
    setLabSelected(null);

    try {
      const identificador = getSucursalIdentificador();
      const url = `${apiBase}/Proveedores/ObtenerLaboratorios/${encodeURIComponent(
        identificador
      )}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener laboratorios`);
      }

      const data = await response.json();

      const proveedores = Array.isArray(data)
        ? data
        : Array.isArray(data.laListaDeProveedores)
        ? data.laListaDeProveedores
        : Array.isArray(data.proveedores)
        ? data.proveedores
        : [data];

      const options = proveedores
        .map((item) => ({
          id: item.idProveedor ?? item.id ?? item.Id ?? null,
          nombre:
            item.nombre ?? item.Nombre ?? item.razon_social ?? item.razonSocial ?? String(item),
          no_proveedor:
            item.no_proveedor ?? item.noProveedor ?? item.no_provedor ?? item.numeroProveedor ?? item.idProveedor ?? "",
        }))
        .filter((o) => o.nombre);

      setLabOptions(options);
    } catch (error) {
      console.error("No se pudo cargar laboratorios:", error);
      setLabOptions([]);
    } finally {
      setLabSearchLoading(false);
    }
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
            <Autocomplete
              freeSolo={false}
              options={tiposLente}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.descripcion || ""
              }
              value={tipoLente}
              onChange={(_, newValue) => setTipoLente(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de lente"
                  placeholder="Seleccionar o escribir..."
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={materiales}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.descripcion || ""
              }
              value={material}
              onChange={(_, newValue) => {
                if (!newValue) {
                  setMaterial(null);
                  setExamen((prev) => ({ ...prev, CostoMaterial: "" }));
                  return;
                }

                setMaterial(newValue);
                const precio = getPrecioDeItem(newValue);
                setExamen((prev) => ({
                  ...prev,
                  CostoMaterial: precio !== null ? precio : "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Material"
                  placeholder="Buscar material..."
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

    {/* SECCIÓN 2: Aro */}
<SectionCard title="Aro">
  <Box
    display="flex"
    gap={2}
    alignItems="flex-start"
    flexWrap="wrap"
  >
    {/* Preview */}
    <Box
      sx={{
        width: 90,
        height: 90,
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
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <ImageOutlinedIcon
          sx={{
            color: "text.disabled",
            fontSize: 30,
          }}
        />
      )}
    </Box>

    {/* Contenido */}
    <Box flex={1} minWidth={260}>
      {/* Nombre archivo + botón */}
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

      {/* Buscar aro */}
      <Box display="flex" gap={1}>
        <Autocomplete
          freeSolo
          open={aroComboOpen}
          onClose={() => setAroComboOpen(false)}
          options={aroOptions}
          filterOptions={(options) => options}
          getOptionLabel={(option) =>
            typeof option === "string"
              ? option
              : option.descripcion || ""
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
            if (aroOptions.length > 0) {
              setAroComboOpen(true);
            }
          }}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar aro"
              placeholder="Descripción del artículo"
              size="small"
              onFocus={() => {
                if (aroOptions.length > 0) {
                  setAroComboOpen(true);
                }
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
          sx={{
            whiteSpace: "nowrap",
            textTransform: "none",
            minWidth: 90,
          }}
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
              freeSolo
              options={labOptions}
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : `${option.nombre || ""} - ${option.no_proveedor || ""}`
              }
              value={labSelected}
              inputValue={laboratorio}
              onOpen={() => {
                if (labOptions.length === 0 && !labSearchLoading) buscarLaboratorios();
              }}
              onInputChange={(_, newInput) => {
                setLaboratorio(newInput);
                if (!newInput) {
                  setLabOptions([]);
                  setLabSelected(null);
                }
              }}
              onChange={(_, newValue) => {
                if (!newValue) {
                  setLabSelected(null);
                  setLaboratorio("");
                  setExamen((prev) => ({
                    ...prev,
                    laboratorio: null,
                    LaboratorioNombre: "",
                    LaboratorioCodigo: "",
                    LaboratorioId: null,
                    numLaboratorio: "",
                  }));
                  return;
                }

                if (typeof newValue === "string") {
                  setLaboratorio(newValue);
                  return;
                }

                setLabSelected(newValue);
                setLaboratorio(`${newValue.nombre} - ${newValue.no_proveedor}`);
                // también guardar inmediatamente (useEffect también lo hará),
                // pero esto asegura que el examen tenga el dato antes de que el efecto se dispare.
                setExamen((prev) => ({
                  ...prev,
                  laboratorio: newValue,
                  LaboratorioNombre: newValue.nombre ?? "",
                  LaboratorioCodigo: newValue.no_proveedor ?? "",
                  LaboratorioId: newValue.id ?? newValue.idProveedor ?? null,
                  numLaboratorio: newValue.no_proveedor ?? prev.numLaboratorio ?? "",
                }));
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar laboratorio"
                  placeholder="Nombre o código..."
                  size="small"
                  fullWidth
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
              placeholder="LAB-000"
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