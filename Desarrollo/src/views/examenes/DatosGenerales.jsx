// DatosGenerales.jsx
import { Box, Grid, TextField, Typography } from "@mui/material";
import BusquedaDePaciente from "../../components/forms/formularioPacientes/BusquedaDePaciente";

const DatosGenerales = ({ examen, setExamen }) => (
  <Box>
    <Typography variant="h6" mb={2}>Datos Generales</Typography>
    <Box mb={2}>
      <BusquedaDePaciente />
    </Box>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Número de Examen"
          value={examen.NoExamen}
          onChange={(e) => setExamen(prev => ({
            ...prev,
            NoExamen: e.target.value
          }))} 
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          type="date"
          fullWidth
          label="Fecha del Examen"
          InputLabelProps={{ shrink: true }}
          value={examen.FechaExamen}
          onChange={(e) => setExamen(prev => ({
            ...prev,
            FechaExamen: e.target.value
          }))}
        />
      </Grid>

      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={6}
          label="Motivo de consulta"
          value={examen.Motivo}
          onChange={(e) => {
            if (e.target.value.length <= 700) {
              setExamen(prev => ({ ...prev, Motivo: e.target.value }));
            }
          }}
          helperText={`${examen.Motivo.length}/700 caracteres`}
          inputProps={{ maxLength: 700 }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" mt={2}>
          Asignación de Enfermedades (pendiente de implementar)
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Código Profesional"
          value={examen.CodigoProfesional || ""}
          onChange={(e) => setExamen(prev => ({
            ...prev,
            CodigoProfesional: e.target.value
          }))}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombre del Profesional"
          value={examen.NombreProfesional || ""}
          onChange={(e) => setExamen(prev => ({
            ...prev,
            NombreProfesional: e.target.value
          }))}
        />
      </Grid>

    </Grid>
  </Box>
);

export default DatosGenerales;
