import { useCallback, useState, useEffect, useRef } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import BusquedaDePaciente from "../../components/forms/formularioPacientes/BusquedaDePaciente.js";
import BusquedaDeDoctor from "../../components/forms/formularioPacientes/BusquedaDeDoctor.js";

// Campo aislado: mantiene su propio estado local mientras el usuario
// escribe, y solo "empuja" el valor hacia arriba (setExamen del padre)
// con un debounce. Así, escribir NO dispara un re-render del padre
// (ni de todo lo que el padre renderiza) en cada tecla.
const CampoMotivo = ({ value, onCommit }) => {
  const [local, setLocal] = useState(value ?? "");
  const debounceRef = useRef(null);

  // Si el valor externo cambia (ej: se carga un examen distinto),
  // sincronizamos el estado local.
  useEffect(() => {
    setLocal(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    const nuevoValor = e.target.value;
    if (nuevoValor.length > 700) return;

    setLocal(nuevoValor);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onCommit(nuevoValor);
    }, 400); // ajustá el delay a gusto, 300-500ms suele andar bien
  };

  // Aseguramos que el último valor se guarde aunque el usuario
  // deje de escribir justo antes de que dispare el debounce
  // (por ejemplo, si cambia de tab inmediatamente).
  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onCommit(local);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <TextField
      fullWidth
      multiline
      minRows={4}
      maxRows={6}
      label="Motivo de consulta"
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={`${local.length}/700 caracteres`}
      inputProps={{ maxLength: 700 }}
    />
  );
};

const DatosGenerales = ({ examen, setExamen }) => {
  const handlePacienteChange = useCallback((paciente) => {
    setExamen(prev => ({
      ...prev,
      NoPaciente: paciente?.noPaciente ?? 0,
      NombrePaciente: paciente?.nombre ?? paciente?.Nombre ?? prev.NombrePaciente ?? "",
      Paciente: paciente ?? null,
    }));
  }, [setExamen]);

  const handleDoctorChange = useCallback((doctor) => {
    setExamen(prev => ({
      ...prev,
      NombreProfesional: doctor?.nombre || doctor?.Nombre || "",
      CodigoProfesional: doctor?.codigoProfesional || doctor?.CodigoProfesional || "",
      IdProfesional: doctor?.idUsuario ?? doctor?.identificador ?? doctor?.id ?? null
    }));
  }, [setExamen]);

  // Callback estable para "commitear" el Motivo al estado del padre
  const handleMotivoCommit = useCallback((nuevoMotivo) => {
    setExamen(prev => ({ ...prev, Motivo: nuevoMotivo }));
  }, [setExamen]);

  return (
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
              onPacienteChange={handlePacienteChange}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={12}>
          <CampoMotivo
            value={examen.Motivo}
            onCommit={handleMotivoCommit}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" mt={2}>
            Información de profesional tratante
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12}>
          <BusquedaDeDoctor
            onDoctorChange={handleDoctorChange}
          />
        </Grid>

      </Grid>
    </Box>
  );
};

export default DatosGenerales;