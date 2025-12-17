// DetalleDeCosto.jsx
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";

const DetalleDeCosto = ({ examen, setExamen }) => {

  // 🔹 Calcular precio final automáticamente
  useEffect(() => {
    const {
      CostoAro = 0,
      CostoLente = 0,
      CostoMaterial = 0,
      CostoExamen = 0,
      TratamientosCosto = 0,
    } = examen;

    const total =
      Number(CostoAro) +
      Number(CostoLente) +
      Number(CostoMaterial) +
      Number(CostoExamen) +
      Number(TratamientosCosto);

    setExamen(prev => ({ ...prev, PrecioFinal: total }));
  }, [
    examen.CostoAro,
    examen.CostoLente,
    examen.CostoMaterial,
    examen.CostoExamen,
    examen.TratamientosCosto,
  ]);

  return (
    <Box mt={3}>
      <Typography variant="h6" mb={2}>Detalle de Costo</Typography>

      <Grid container spacing={2}>
        
        {/* COSTO ARO */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Costo del Aro"
            value={examen.CostoAro || ""}
            onChange={(e) =>
              setExamen(prev => ({ ...prev, CostoAro: e.target.value }))
            }
          />
        </Grid>

        {/* COSTO LENTE */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Costo de Lente"
            value={examen.CostoLente || ""}
            onChange={(e) =>
              setExamen(prev => ({ ...prev, CostoLente: e.target.value }))
            }
          />
        </Grid>

        {/* COSTO MATERIAL */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Costo del Material"
            value={examen.CostoMaterial || ""}
            onChange={(e) =>
              setExamen(prev => ({ ...prev, CostoMaterial: e.target.value }))
            }
          />
        </Grid>

        {/* COSTO EXAMEN */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Costo del Examen"
            value={examen.CostoExamen || ""}
            onChange={(e) =>
              setExamen(prev => ({ ...prev, CostoExamen: e.target.value }))
            }
          />
        </Grid>

        {/* TRATAMIENTOS */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Costo de Tratamientos"
            value={examen.TratamientosCosto || ""}
            onChange={(e) =>
              setExamen(prev => ({ ...prev, TratamientosCosto: e.target.value }))
            }
          />
        </Grid>

        {/* PRECIO FINAL */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Precio Final"
            value={examen.PrecioFinal || 0}
            InputProps={{ readOnly: true }}
          />
        </Grid>

      </Grid>
    </Box>
  );
};

export default DetalleDeCosto;
