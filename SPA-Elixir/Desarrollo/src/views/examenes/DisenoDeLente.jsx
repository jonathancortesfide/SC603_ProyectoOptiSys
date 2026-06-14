import React, { useState, useRef } from "react";
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

const TIPOS_LENTE = [
  "Visión sencilla",
  "Bifocal",
  "Progresivo",
  "Ocupacional",
  "Deportivo",
  "Lente de contacto",
];

const MATERIALES = [
  "CR-39",
  "Policarbonato",
  "Trivex",
  "1.60 Alto índice",
  "1.67 Alto índice",
  "1.74 Alto índice",
  "Vidrio mineral",
  "Photochromic CR-39",
  "Photochromic policarbonato",
];

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

export default function DisenoDeLente() {
  const [tipoLente, setTipoLente] = useState("");
  const [material, setMaterial] = useState(null);
  const [aroPreview, setAroPreview] = useState(null);
  const [aroFileName, setAroFileName] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [numOrden, setNumOrden] = useState("");
  const [numLaboratorio, setNumLaboratorio] = useState("");
  const fileInputRef = useRef();

  const handleAroUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAroFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setAroPreview(ev.target.result);
    reader.readAsDataURL(file);
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
              value={tipoLente}
              onChange={(e) => setTipoLente(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">
                <em>Seleccionar...</em>
              </MenuItem>
              {TIPOS_LENTE.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={MATERIALES}
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
        <Box display="flex" alignItems="center" gap={2}>
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
              <ImageOutlinedIcon sx={{ color: "text.disabled", fontSize: 28 }} />
            )}
          </Box>

          {/* Info + botón */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
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
            <TextField
              label="Buscar laboratorio"
              value={laboratorio}
              onChange={(e) => setLaboratorio(e.target.value)}
              placeholder="Nombre o código..."
              fullWidth
              size="small"
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
    </Box>
  );
}