// ConsultaExamenVista.jsx
import React, { useState } from "react";
import {
  Box, Grid, TextField, Button, List, ListItem, ListItemText, Divider, Alert, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";
import Breadcrumb from "../../layouts/full/shared/breadcrumb/Breadcrumb";
import { obtenerExamenes } from "../../requests/examenes/RequestsExamenes";

import DatosGenerales from "./DatosGenerales";
import GraduacionRx from "./GraduacionRx";
import DisenoDeLente from "./DisenoDeLente";
import DetalleDeCosto from "./DetalleDeCosto";

const ConsultaExamenVista = () => {
  const [filtroExamen, setFiltroExamen] = useState("");
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [resultados, setResultados] = useState([]);
  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const buscar = async () => {
  setLoading(true);
  setError("");
  let data = await obtenerExamenes(filtroPaciente || '');

  if (!Array.isArray(data)) {
    data = [];
  }

  if (filtroExamen) {
    data = data.filter(e =>
      e.NoExamen.toString().includes(filtroExamen)
    );
  }

  if (filtroPaciente) {
    data = data.filter(e =>
      e.NoPaciente?.toString().includes(filtroPaciente)
    );
  }

  setResultados(data);
  setExamen(null);
  if (!data.length) {
    setError('No se encontraron exámenes con los filtros indicados');
  }
  setLoading(false);
};

  const cargarExamen = (item) => {
  setExamen({ ...item }); 
};
  return (
    <PageContainer>
      <Breadcrumb title="Consulta de Exámenes" description="Buscar exámenes anteriores" />

      <ParentCard title="Búsqueda">
        {error && <Alert severity="info" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Número de Examen"
              fullWidth
              value={filtroExamen}
              onChange={(e) => setFiltroExamen(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Número de Paciente"
              fullWidth
              value={filtroPaciente}
              onChange={(e) => setFiltroPaciente(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={buscar}
              disabled={loading}
              sx={{ height: "100%" }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Buscar'}
            </Button>
          </Grid>
          
        </Grid>
      </ParentCard>

      {resultados.length > 0 && (
        <ParentCard title="Resultados">
          <List>
            {resultados.map((r, i) => (
              <React.Fragment key={i}>
                <ListItem button onClick={() => cargarExamen(r)}>
                  <ListItemText
                    primary={`Examen #${r.NoExamen}`}
                    secondary={`Fecha: ${r.FechaExamen}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </ParentCard>
      )}

      {examen && (
        <ParentCard title={`Examen #${examen.NoExamen}`}>
          <DatosGenerales examen={examen} setExamen={setExamen} />
          <GraduacionRx examen={examen} setExamen={setExamen} />
          <DisenoDeLente examen={examen} setExamen={setExamen} />
          <DetalleDeCosto examen={examen} setExamen={setExamen} />
        </ParentCard>
      )}

      <Grid item xs={12} md={12}>
        <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/crearexamen")}
            sx={{ height: "100%" }}
        >
            Crear nuevo examen
        </Button>
    </Grid>

    </PageContainer>
  );
};

export default ConsultaExamenVista;
