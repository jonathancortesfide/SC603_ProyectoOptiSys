// ExamenVista.jsx
import React, { useState } from "react";
import { Box, Button, Stepper, Step, StepLabel, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import Breadcrumb from "../../layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "../../components/shared/ParentCard";
import { Snackbar, Alert } from "@mui/material";


// Subcomponentes
import DatosGenerales from "./DatosGenerales";
import GraduacionRx from "./GraduacionRx";
import DisenoDeLente from "./DisenoDeLente";
import DetalleDeCosto from "./DetalleDeCosto";

const steps = ["Datos Generales", "Graduación RX", "Diseño de Lente", "Detalle de Costo"];


const ExamenVista = () => {
const [openSnackbar, setOpenSnackbar] = useState(false);

  const [examen, setExamen] = useState({
    NoExamen: 23,// default para pruebas
    NoPaciente: 0,
    FechaExamen: new Date(),
    Motivo: "",
    TipoExamen: "",
    DpGeneral: "",
    MedioTransp: "",
    Fo: "",
    Pio: "",
    UltimoExamen: new Date(),
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

  const handleFinish = () => {
  console.log("Examen completado:", examen);
  setOpenSnackbar(true);
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
              <Button variant="contained" color="success" onClick={handleFinish}>
                Finalizar
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
