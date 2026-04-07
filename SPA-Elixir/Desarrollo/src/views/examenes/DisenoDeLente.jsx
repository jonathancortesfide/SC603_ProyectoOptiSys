import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Autocomplete,
  Button,
  IconButton,
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// --- COMPONENTE PRINCIPAL ---
export default function DisenoDeLente() {
  // UI render
  return (
    <Box>
      <Typography variant="h6" mb={2}>Diseño de Lente</Typography>

      <Grid container spacing={2}>

        {/* Aro seleccionado show */}
        <Grid item xs={12} md={6}>
          <Typography variant="caption">No hay aro seleccionado</Typography>
        </Grid>
        {/* Preview / photo upload for aro */}
        <Grid item xs={12} md={6}>
          <Box display="flex" gap={1} alignItems="center">
            <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
              Subir foto aro
              <input hidden accept="image/*" type="file" />
            </Button>
          </Box>
        </Grid>


        {/* Tipo de lente */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Tipo de Lente"
            fullWidth
            size="small"
          >
            <MenuItem value=""><em>Seleccionar</em></MenuItem>
          </TextField>
        </Grid>

        {/* Material */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            freeSolo
            options={[]}
            renderInput={(params) => (
              <TextField {...params} label="Material (buscar)" size="small" />
            )}
          />
        </Grid>
        

        {/* Laboratorio search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Buscar laboratorio"
            size="small"
          />
        </Grid>

        

      

      

      </Grid>
    </Box>
  );
}