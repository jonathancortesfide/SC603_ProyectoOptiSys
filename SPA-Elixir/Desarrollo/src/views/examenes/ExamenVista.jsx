// ExamenVista.jsx
import React, { useState } from "react";
import { Box, Button, Stepper, Step, StepLabel, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import Breadcrumb from "../../layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "../../components/shared/ParentCard";
import { Snackbar, Alert } from "@mui/material";
import { AgregarExamen } from "../../requests/examenes/RequestsExamenes";


// Subcomponentes
import DatosGenerales from "./DatosGenerales";
import GraduacionRx from "./GraduacionRx";
import DisenoDeLente from "./DisenoDeLente";
import DetalleDeCosto from "./DetalleDeCosto";

const steps = ["Datos Generales", "Graduación RX", "Diseño de Lente", "Detalle de Costo"];

const formatDateForInput = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};


const ExamenVista = () => {
const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
const [guardando, setGuardando] = useState(false);

  const [examen, setExamen] = useState({
    NoExamen: 23,// default para pruebas
    NoPaciente: 0,
    FechaExamen: formatDateForInput(new Date()),
    Motivo: "",
    TipoExamen: "",
    DpGeneral: "",
    MedioTransp: "",
    Fo: "",
    Pio: "",
    UltimoExamen: formatDateForInput(new Date()),
    TratamientoAnterior: "",
    TipoPatologias: "",
    XmlGraduaciones: "",
    XmlDisenos: "",
    CodigoAro: "",
    CodigoExamen: "",
  });

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinish = async () => {
    if (!examen.NoPaciente) {
      setSnackbar({ open: true, severity: "error", message: "Seleccione un paciente antes de guardar" });
      return;
    }

    setGuardando(true);
    try {
      const respuesta = await AgregarExamen(examen);
      if (respuesta?.EsCorrecto) {
        const nuevoNumero = respuesta?.Data?.NoExamen || examen.NoExamen;
        setExamen((prev) => ({ ...prev, NoExamen: nuevoNumero }));
        setSnackbar({ open: true, severity: "success", message: `Examen número ${nuevoNumero} guardado correctamente` });
      } else {
        setSnackbar({ open: true, severity: "error", message: respuesta?.Mensaje || "No se pudo guardar el examen" });
      }
    } catch (error) {
      setSnackbar({ open: true, severity: "error", message: "Ocurrió un error al guardar el examen" });
    } finally {
      setGuardando(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <DatosGenerales examen={examen} setExamen={setExamen} />;
      case 1:
        return <GraduacionRx examen={examen} setExamen={setExamen} />;
      case 2:
        return <DisenoDeLente examen={examen} setExamen={setExamen} />;
      case 3:
        return <DetalleDeCosto examen={examen} setExamen={setExamen} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Breadcrumb title="Examen" description="Registrar nuevo examen" />

      <ParentCard title="Crear nuevo examen">
        <Box width="100%">
          {/* STEP INDICATOR */}
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* CONTENIDO */}
          {renderStep()}

          {/* BOTONES */}
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button disabled={activeStep === 0} variant="outlined" onClick={handleBack}>
              Atrás
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button variant="contained" color="success" onClick={handleFinish} disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar examen"}
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </ParentCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ExamenVista;
