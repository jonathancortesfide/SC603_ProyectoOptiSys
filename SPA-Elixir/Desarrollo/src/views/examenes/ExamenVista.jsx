// ExamenVista.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Stepper, Step, StepButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import Breadcrumb from "../../layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "../../components/shared/ParentCard";
import { Snackbar, Alert } from "@mui/material";
import axiosServices from "../../utils/axios";
import { getSucursalIdentificador } from "../../utils/sucursal";
import { AgregarExamen } from "../../requests/examenes/RequestsExamenes";


// Subcomponentes
import DatosGenerales from "./DatosGenerales";
import GraduacionRx from "./GraduacionRx";
import DisenoDeLente from "./DisenoDeLente";
import DetalleDeCosto from "./DetalleDeCosto";

const steps = ["Datos Generales", "Graduación RX", "Diseño de Lente", "Detalle de Costo"];

const apiBase = import.meta.env.VITE_ApiBase;
const EXAMEN_STORAGE_KEY = "examenDraft";

const initialExamenState = {
  NoExamen: 0, // se obtiene desde la API en el useEffect
  NoPaciente: 0,
  FechaExamen: new Date().toISOString().split("T")[0],
  Motivo: "",
};

const loadDraft = () => {
  try {
    const raw = sessionStorage.getItem(EXAMEN_STORAGE_KEY);
    if (!raw) return initialExamenState;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : initialExamenState;
  } catch (error) {
    console.warn("No se pudo cargar el examen guardado en sesión:", error);
    return initialExamenState;
  }
};

const ExamenVista = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [examen, setExamen] = useState(loadDraft);
  const [activeStep, setActiveStep] = useState(0);

  const examenResumen = useMemo(() => {
    // Mostrar todos los campos de `examen` de forma legible y no editable.
    try {
      const keys = Object.keys(examen || {}).sort();
      const items = keys.map((k) => {
        let raw = examen[k];
        let value;
        if (raw === undefined || raw === null || raw === "") {
          value = "-";
        } else if (typeof raw === "object") {
          try {
            value = JSON.stringify(raw, null, 0);
          } catch (e) {
            value = String(raw);
          }
        } else {
          value = String(raw);
        }

        // Truncar para mantener el diálogo legible
        const maxLen = 400;
        if (value.length > maxLen) value = `${value.slice(0, maxLen)}...`;

        // Etiqueta más amigable para algunos campos conocidos
        const labelMap = {
          NoExamen: "Número de examen",
          NoPaciente: "Paciente",
          FechaExamen: "Fecha de examen",
          Motivo: "Motivo",
          observacionesGenerales: "Observaciones",
        };

        return { label: labelMap[k] ?? k, key: k, value };
      });
      return items;
    } catch (err) {
      return [{ label: "Resumen", value: "No se pudo generar el resumen del examen." }];
    }
  }, [examen]);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleSendExam = async () => {
    try {
      console.log("Enviando examen:", examen);
      const response = await AgregarExamen(examen);
      console.log("Respuesta del servidor:", response);

      if (response && response.esCorrecto) {
        setOpenConfirmDialog(false);
        setOpenSnackbar(true);
        // Limpiar el draft después de guardar exitosamente
        sessionStorage.removeItem(EXAMEN_STORAGE_KEY);
        setExamen(initialExamenState);
      } else {
        console.error('Error al guardar examen:', response?.mensaje);
        setValidationError(response?.mensaje || 'Error al guardar el examen');
      }
    } catch (err) {
      console.error('Error al enviar examen:', err);
      setValidationError('Error de conexión al guardar el examen');
    }
  };

  // Obtener número de examen desde la API al cargar el componente
  useEffect(() => {
    const obtenerProximoNumeroExamen = async () => {
      try {
        const identificadorSucursal = getSucursalIdentificador();
        console.log("Identificador de sucursal:", identificadorSucursal);
        
        if (!identificadorSucursal) {
          console.warn("No se encontró identificador de sucursal en sesión");
          return;
        }

        console.log("Llamando a API para obtener próximo número de examen...");
        const response = await axiosServices.get(
          `${apiBase}/Examenes/ObtenerProximoNumeroExamen/${identificadorSucursal}`
        );

        console.log("Respuesta de API:", response.data);
        
        if (response.data && typeof response.data === 'number') {
          console.log("Actualizando NoExamen a:", response.data);
          setExamen((prev) => ({
            ...prev,
            NoExamen: response.data,
          }));
        }
      } catch (error) {
        console.error("Error al obtener próximo número de examen:", error);
      }
    };

    obtenerProximoNumeroExamen();
  }, []);

  const isStep0Valid = () => {
    if (!examen.FechaExamen) {
      return { valid: false, message: "Debe seleccionar una fecha de examen." };
    }
    if (!examen.NoPaciente) {
      return { valid: false, message: "Debe seleccionar un paciente antes de continuar." };
    }
    if (!examen.Motivo || examen.Motivo.trim() === "") {
      return { valid: false, message: "Debe ingresar el motivo de la consulta." };
    }
    if (!examen.IdProfesional) {
      return { valid: false, message: "Debe seleccionar un profesional tratante." };
    }
    return { valid: true };
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const validation = isStep0Valid();
      if (!validation.valid) {
        setValidationError(validation.message);
        return;
      }
    }
    setValidationError("");
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleBack = () => {
    setValidationError("");
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleIrAPaso = (index) => {
    if (index === 0) {
      setActiveStep(index);
      setValidationError("");
      return;
    }

    if (activeStep === 0) {
      const validation = isStep0Valid();
      if (!validation.valid) {
        setValidationError(validation.message);
        return;
      }
    }

    if (index >= 0 && index < steps.length) {
      setActiveStep(index);
      setValidationError("");
    }
  };

  const handleFinish = () => {
    // Preparar payload para enviar al backend. Por ahora lo mostramos en consola
    // para validar la forma y contenidos antes de implementar el POST.
    try {
      const payload = { ...examen };
      // Normalizar fechas como strings ISO si vienen como Date
      if (payload.FechaExamen instanceof Date) payload.FechaExamen = payload.FechaExamen.toISOString();
      if (payload.UltimoExamen instanceof Date) payload.UltimoExamen = payload.UltimoExamen.toISOString();

      console.log("Examen completado (obj):", examen);
      console.log("Examen payload (JSON):", JSON.stringify(payload, null, 2));

      // Ejemplo de envío (descomentar y ajustar URL/método cuando esté listo)
      // await fetch('/api/examenes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error al preparar payload del examen:', err);
    }
  };

  React.useEffect(() => {
    try {
      sessionStorage.setItem(EXAMEN_STORAGE_KEY, JSON.stringify(examen));
    } catch (error) {
      console.warn("No se pudo guardar el examen en sesión:", error);
    }
  }, [examen]);

  const stepsContent = [
    <Box key="datos-generales" sx={{ display: activeStep === 0 ? "block" : "none" }}>
      <DatosGenerales examen={examen} setExamen={setExamen} />
    </Box>,
    <Box key="graduacion-rx" sx={{ display: activeStep === 1 ? "block" : "none" }}>
      <GraduacionRx examen={examen} setExamen={setExamen} />
    </Box>,
    <Box key="diseno-de-lente" sx={{ display: activeStep === 2 ? "block" : "none" }}>
      <DisenoDeLente examen={examen} setExamen={setExamen} />
    </Box>,
    <Box key="detalle-de-costo" sx={{ display: activeStep === 3 ? "block" : "none" }}>
      <DetalleDeCosto examen={examen} setExamen={setExamen} />
    </Box>,
  ];

  return (
    <PageContainer>
      <Breadcrumb title="Examen" description="Registrar nuevo examen" />

      <ParentCard title="Crear nuevo examen">
        <Box width="100%">
          {/* STEP INDICATOR */}
          <Stepper activeStep={activeStep} nonLinear sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepButton
                  color="inherit"
                  onClick={() => handleIrAPaso(index)}
                  sx={{ flexDirection: "column", py: 1, minWidth: 0 }}
                >
                  <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
                    {index + 1}
                  </Typography>
                  <Typography variant="body2" textAlign="center" lineHeight={1.2}>
                    {label}
                  </Typography>
                </StepButton>
              </Step>
            ))}
          </Stepper>

          {/* CONTENIDO */}
          {stepsContent}

          {/* BOTONES */}
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button type="button" disabled={activeStep === 0} variant="outlined" onClick={handleBack}>
              Atrás
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button type="button" variant="contained" color="success" onClick={handleOpenConfirmDialog}>
                Guardar examen
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={activeStep === 0 && !isStep0Valid().valid}
              >
                Siguiente
              </Button>
            )}
          </Box>
          {validationError && (
            <Box mt={2}>
              <Alert severity="error">{validationError}</Alert>
            </Box>
          )}
        </Box>
      </ParentCard>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} fullWidth maxWidth="md">
        <DialogTitle>Confirmar envío de examen</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Revisa la información del examen antes de enviarlo.
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.paper", overflow: "auto", maxHeight: 360 }}>
            <Box display="grid" gridTemplateColumns="max-content 1fr" gap={1}>
              {examenResumen.map((item) => (
                <React.Fragment key={item.label}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {item.value}
                  </Typography>
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Regresar</Button>
          <Button variant="contained" color="primary" onClick={handleSendExam}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
        >
          Examen número {examen.NoExamen} guardado correctamente
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ExamenVista;
