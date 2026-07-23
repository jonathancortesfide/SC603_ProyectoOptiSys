// ConsultaExamenVista.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";
import Breadcrumb from "../../layouts/full/shared/breadcrumb/Breadcrumb";
import axiosServices from "../../utils/axios";

const apiBase = import.meta.env.VITE_ApiBase;

// -----------------------------------------------------------------------
// Configuración dinámica: cada campo del "datos" que viene del backend
// se agrupa aquí. Si el backend agrega/quita un campo, solo tocas este
// arreglo, no el JSX. "key" debe coincidir con la propiedad del objeto.
// -----------------------------------------------------------------------
const SECCIONES_EXAMEN = [
  {
    titulo: "Datos generales",
    campos: [
      { key: "no_examen", label: "Número de examen" },
      { key: "fecha_examen", label: "Fecha del examen", tipo: "fecha" },
      { key: "estado", label: "Estado" },
      { key: "fecha_creacion", label: "Fecha de creación", tipo: "fecha" },
    ],
  },
  {
    titulo: "Paciente",
    campos: [
      { key: "no_paciente", label: "Número de paciente" },
      { key: "nombre_paciente", label: "Nombre del paciente" },
    ],
  },
  {
    titulo: "Profesional",
    campos: [
      { key: "nombre_profesional", label: "Profesional" },
      { key: "codigo_profesional", label: "Código profesional" },
    ],
  },
  {
    titulo: "Consulta",
    campos: [
      { key: "motivo_consulta", label: "Motivo de consulta", multiline: true },
      {
        key: "observaciones_generales",
        label: "Observaciones generales",
        multiline: true,
      },
    ],
  },
  {
    titulo: "Lente y material",
    campos: [
      { key: "tipo_lente", label: "Tipo de lente" },
      { key: "material", label: "Material" },
      { key: "aro", label: "Aro" },
      { key: "codigo_aro", label: "Código de aro" },
    ],
  },
  {
    titulo: "Laboratorio",
    campos: [
      { key: "laboratorio", label: "Laboratorio" },
      { key: "numero_orden_laboratorio", label: "Número de orden" },
    ],
  },
  {
    titulo: "Notas adicionales",
    campos: [
      { key: "disposicion", label: "Disposición", multiline: true },
      { key: "tratamiento", label: "Tratamiento", multiline: true },
    ],
  },
  {
    titulo: "Costos",
    campos: [
      { key: "costo_examen", label: "Costo del examen", tipo: "moneda" },
      { key: "costo_material", label: "Costo del material", tipo: "moneda" },
      { key: "costo_lente", label: "Costo del lente", tipo: "moneda" },
      { key: "costo_aro", label: "Costo del aro", tipo: "moneda" },
      { key: "precio_final", label: "Precio final", tipo: "moneda" },
    ],
  },
];

// Campos que ya se muestran arriba explícitamente o que son internos
// (ids, xml crudo, etc.) y no queremos repetir en la sección "Otros datos".
const CAMPOS_CONOCIDOS = new Set([
  "id_examen",
  "id_profesional",
  "tipo_lente_id",
  "material_id",
  "xml_graduaciones",
  ...SECCIONES_EXAMEN.flatMap((s) => s.campos.map((c) => c.key)),
]);

const formatearValor = (valor, tipo) => {
  if (valor === null || valor === undefined || valor === "") return "—";

  if (tipo === "moneda") {
    const numero = Number(valor);
    if (Number.isNaN(numero)) return valor;
    return numero.toLocaleString("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    });
  }

  if (tipo === "fecha") {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return valor;
    return fecha.toLocaleString("es-CR");
  }

  return String(valor);
};

// -----------------------------------------------------------------------
// Parseo del XML de graduaciones a un objeto plano:
// { Actual: { OD: {Esfera, Cilindro, ...}, OI: {...} }, Anterior: {...} }
// Es genérico: recorre cualquier estructura <Bloque><OD>...</OD></Bloque>
// sin necesidad de conocer de antemano los nombres de las etiquetas.
// -----------------------------------------------------------------------
const parsearGraduaciones = (xmlString) => {
  if (!xmlString) return null;

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) return null;

    const raiz = xmlDoc.documentElement; // <Graduaciones>
    const resultado = {};

    Array.from(raiz.children).forEach((bloque) => {
      // bloque = <Actual>, <Anterior>, etc.
      const ojos = {};
      Array.from(bloque.children).forEach((ojoNodo) => {
        // ojoNodo = <OD>, <OI>
        const valores = {};
        Array.from(ojoNodo.children).forEach((campoNodo) => {
          valores[campoNodo.tagName] = campoNodo.textContent;
        });
        ojos[ojoNodo.tagName] = valores;
      });
      resultado[bloque.tagName] = ojos;
    });

    return resultado;
  } catch (e) {
    console.error("Error parseando xml_graduaciones:", e);
    return null;
  }
};

const TablaGraduaciones = ({ graduaciones }) => {
  if (!graduaciones) return null;

  return Object.entries(graduaciones).map(([nombreBloque, ojos]) => {
    const nombresOjos = Object.keys(ojos); // p.ej ["OD", "OI"]
    // Unimos todas las llaves posibles de todos los ojos para las filas
    const todasLasLlaves = Array.from(
      new Set(nombresOjos.flatMap((ojo) => Object.keys(ojos[ojo])))
    );

    if (todasLasLlaves.length === 0) return null;

    return (
      <Box key={nombreBloque} mt={2}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {nombreBloque}
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Parámetro</TableCell>
                {nombresOjos.map((ojo) => (
                  <TableCell key={ojo} align="center">
                    {ojo}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {todasLasLlaves.map((llave) => (
                <TableRow key={llave}>
                  <TableCell>{llave}</TableCell>
                  {nombresOjos.map((ojo) => (
                    <TableCell key={ojo} align="center">
                      {ojos[ojo][llave] ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  });
};

const ConsultaExamenVista = () => {
  const [filtroExamen, setFiltroExamen] = useState("");
  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const buscar = async () => {
    if (!filtroExamen) {
      setError("Ingrese un número de examen.");
      return;
    }

    setLoading(true);
    setError("");
    setExamen(null);

    try {
      const noExamen = parseInt(filtroExamen);

      const response = await axiosServices.get(
        `${apiBase}/ExamenSnapshot/${noExamen}`
      );

      if (response.data.esCorrecto) {
        setExamen(response.data.datos);
      } else {
        setError(response.data.mensaje);
      }
    } catch (err) {
      console.error("Error:", err);

      if (err.response) {
        console.log(err.response.data);
      }

      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const graduaciones = examen
    ? parsearGraduaciones(examen.xml_graduaciones)
    : null;

  // Campos que llegan del backend pero no están mapeados en SECCIONES_EXAMEN,
  // para no perder información nueva que se agregue del lado del backend.
  const otrosDatos = examen
    ? Object.entries(examen).filter(([key]) => !CAMPOS_CONOCIDOS.has(key))
    : [];

  return (
    <PageContainer>
      <Breadcrumb
        title="Consulta de Exámenes"
        description="Buscar examen por número"
      />

      <ParentCard title="Búsqueda">
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Número de Examen"
              value={filtroExamen}
              onChange={(e) => setFiltroExamen(e.target.value)}
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

      {examen && (
        <ParentCard title={`Examen #${examen.no_examen}`}>
          {SECCIONES_EXAMEN.map((seccion) => (
            <Box key={seccion.titulo} mb={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {seccion.titulo}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {seccion.campos.map((campo) => (
                  <Grid
                    item
                    xs={12}
                    md={campo.multiline ? 12 : 6}
                    key={campo.key}
                  >
                    <TextField
                      fullWidth
                      label={campo.label}
                      value={formatearValor(examen[campo.key], campo.tipo)}
                      InputProps={{ readOnly: true }}
                      multiline={campo.multiline}
                      minRows={campo.multiline ? 2 : undefined}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          {graduaciones && (
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Graduaciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TablaGraduaciones graduaciones={graduaciones} />
            </Box>
          )}

          {otrosDatos.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Otros datos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {otrosDatos.map(([key, valor]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <TextField
                      fullWidth
                      label={key}
                      value={
                        valor === null || valor === undefined ? "—" : String(valor)
                      }
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </ParentCard>
      )}

      <ParentCard title="Acciones">
        <Grid container spacing={2}>
          <Grid item xs={12}>
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