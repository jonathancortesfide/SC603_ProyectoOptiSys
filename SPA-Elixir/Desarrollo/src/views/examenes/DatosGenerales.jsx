// DatosGenerales.jsx
import { Box, Grid, TextField, Typography } from "@mui/material";
import BusquedaDePaciente from "../../components/forms/formularioPacientes/BusquedaDePaciente.js";
import BusquedaDeDoctor from "../../components/forms/formularioPacientes/BusquedaDeDoctor.js";

const DatosGenerales = ({ examen, setExamen }) => (
  <Box>
    <Typography variant="h6" mb={2}>Información médica</Typography>
    

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField // no editable, se obtiene desde la API
          fullWidth
          label="Número de Examen"
          value={examen.NoExamen}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) => setExamen(prev => ({
            ...prev,
            NoExamen: e.target.value
          }))} 
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Fecha del Examen"
          type="date"
          value={examen.FechaExamen || new Date().toISOString().split('T')[0]}
          onChange={(e) => setExamen(prev => ({
            ...prev,
            FechaExamen: e.target.value
          }))}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12}>
      <Box mb={2}>
      <BusquedaDePaciente
        noPaciente={examen.NoPaciente}
        initialPaciente={examen.Paciente ?? null}
        onPacienteChange={(paciente) => {setExamen(prev => ({
            ...prev,
            NoPaciente: paciente?.noPaciente ?? 0,
            NombrePaciente: paciente?.nombre ?? paciente?.Nombre ?? prev.NombrePaciente ?? "",
            Paciente: paciente ?? null,
          }));
        }}
      />
    </Box>
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
          Información de profesional tratante
        </Typography>
      </Grid>

      <Grid item xs={12} sm={12}>
        <BusquedaDeDoctor
          onDoctorChange={(doctor) => setExamen(prev => ({
            ...prev,
            NombreProfesional: doctor?.nombre || doctor?.Nombre || "",
            CodigoProfesional: doctor?.codigoProfesional || doctor?.CodigoProfesional || "",
            IdProfesional: doctor?.idUsuario ?? doctor?.identificador ?? doctor?.id ?? null
          }))}
        />
      </Grid>

    </Grid>
  </Box>
);

export default DatosGenerales;
