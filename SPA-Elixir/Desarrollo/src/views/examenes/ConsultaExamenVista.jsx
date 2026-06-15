// ConsultaExamenVista.jsx
import React, { useState } from "react";
import {
  Box, Grid, TextField, Button, List, ListItem, ListItemText, Divider, CircularProgress, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";
import Breadcrumb from "../../layouts/full/shared/breadcrumb/Breadcrumb";
import axiosServices from "../../utils/axios";
const apiBase = import.meta.env.VITE_ApiBase;

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
    if (!filtroExamen && !filtroPaciente) {
      setError("Ingrese un número de examen o de paciente para buscar");
      return;
    }

    setLoading(true);
    setError("");
    try {
      let data = [];
      let endpoint = "";
      let params = {};

      // Determine which endpoint to use
      if (filtroExamen && filtroPaciente) {
        // Both provided - use combined search
        endpoint = `${apiBase}/ExamenCompleto/ObtenerPorCriterios`;
        params = {
          noExamen: parseInt(filtroExamen),
          noPaciente: parseInt(filtroPaciente)
        };
      } else if (filtroExamen) {
        // Only exam number provided
        endpoint = `${apiBase}/ExamenCompleto/ObtenerPorNumeroExamen`;
        params = {
          noExamen: parseInt(filtroExamen)
        };
      } else {
        // Only patient number provided
        endpoint = `${apiBase}/ExamenCompleto/ObtenerPorNoPaciente`;
        params = {
          noPaciente: parseInt(filtroPaciente)
        };
      }

      // Build query string
      const queryString = new URLSearchParams(params).toString();
      const response = await axiosServices.post(`${endpoint}?${queryString}`);
      
      if (response.data && response.data.esCorrecto) {
        data = response.data.datos || [];
      } else {
        setError(response.data?.mensaje || "No se encontraron exámenes");
      }

      setResultados(data);
    } catch (err) {
      console.error("Error al buscar exámenes:", err);
      setError("Error al conectar con el servidor");
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarExamen = (item) => {
    console.log("Item received from API:", item);
    // API returns: id_graduacion, abreviatura (no_examen), resultado_valor (no_paciente), posicion (date), posicion_nombre (motivo)
    const examenMapeado = {
      id_examen: item.id_graduacion,
      no_examen: parseInt(item.abreviatura) || 0,
      no_paciente: parseInt(item.resultado_valor) || 0,
      fecha_examen: item.posicion || '',
      motivo: item.posicion_nombre || '',
      // PascalCase versions for component compatibility
      NoExamen: parseInt(item.abreviatura) || 0,
      NoPaciente: parseInt(item.resultado_valor) || 0,
      FechaExamen: item.posicion || '',
      Motivo: item.posicion_nombre || ''
    };
    console.log("Mapped exam object:", examenMapeado);
    setExamen(examenMapeado);
  };
  return (
    <PageContainer>
      <Breadcrumb title="Consulta de Exámenes" description="Buscar exámenes anteriores" />

      <ParentCard title="Búsqueda">
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
              {loading ? <CircularProgress size={24} /> : "Buscar"}
            </Button>
          </Grid>
          
        </Grid>
        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </ParentCard>

      {resultados && resultados.length > 0 && (
        <ParentCard title={`Resultados (${resultados.length} exámenes encontrados)`}>
          <List>
            {resultados.map((r, i) => (
              <React.Fragment key={i}>
                <ListItem button onClick={() => cargarExamen(r)}>
                  <ListItemText
                    primary={`Examen #${r.abreviatura || 'N/A'}`}
                    secondary={`Paciente: ${r.nombrePaciente || 'N/A'} | Fecha: ${r.posicion || 'N/A'} | ${r.posicion_nombre || ''}`}
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

      <ParentCard title="Acciones">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/crearexamen")}
            >
                Crear nuevo examen
            </Button>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ConsultaExamenVista;
