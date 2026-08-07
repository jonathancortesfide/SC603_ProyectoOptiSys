// ExamenVista.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
    Box,
    Button,
    Stepper,
    Step,
    StepButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Snackbar,
    Alert,
} from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";
import axiosServices from "../../utils/axios";
import { getSucursalIdentificador } from "../../utils/sucursal";
import { AgregarExamen } from "../../requests/examenes/RequestsExamenes";

// Subcomponentes
import DatosGenerales from './DatosGenerales';
import DetalleDeCosto from './DetalleDeCosto';
import DisenoDeLente from './DisenoDeLente';
import GraduacionRx from './GraduacionRx';

const steps = ['Datos Generales', 'Graduación RX', 'Diseño de Lente', 'Detalle de Costo'];

const apiBase = import.meta.env.VITE_ApiBase;
const EXAMEN_STORAGE_KEY = 'examenDraft';

const createInitialExamenState = () => ({
  NoExamen: 0,
  NoPaciente: 0,
  FechaExamen: '',
  Motivo: '',
  NombrePaciente: '',
  Paciente: null,
  NombreProfesional: '',
  CodigoProfesional: '',
  IdProfesional: null,

  observacionesGenerales: '',
  TipoLente: '',
  TipoLenteId: null,
  Material: '',
  Aro: '',
  CodigoAro: '',
  Laboratorio: '',
  NumeroOrdenLaboratorio: '',
  NumeroPedidoLaboratorio: '',
  Disposicion: '',
  Tratamiento: '',
  CostoAro: '',
  CostoLente: '',
  CostoMaterial: '',
  CostoExamen: '',
  PrecioFinal: 0,
});

const esFechaExamenValida = (valor) => {
  const fecha = String(valor ?? '').trim();
  if (!fecha) return false;
  const parsed = new Date(fecha);
  return !Number.isNaN(parsed.getTime());
};

const esFechaExamenFutura = (valor) => {
  if (!esFechaExamenValida(valor)) return false;
  return new Date(valor).getTime() > Date.now();
};

const ExamenVista = () => {
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [examen, setExamen] = useState(createInitialExamenState);
  const [activeStep, setActiveStep] = useState(0);
  const [numeroExamenGuardado, setNumeroExamenGuardado] = useState('');

  useEffect(() => {
    setExamen(createInitialExamenState());
    setActiveStep(0);
    setValidationError('');
    setOpenConfirmDialog(false);
    setOpenSuccessDialog(false);
    setNumeroExamenGuardado('');
    sessionStorage.removeItem(EXAMEN_STORAGE_KEY);
  }, [location.key]);

  useEffect(() => {
    const pacienteDesdeRuta = location.state?.paciente;
    if (!pacienteDesdeRuta) return;

    const noPaciente =
      pacienteDesdeRuta?.noPaciente ?? pacienteDesdeRuta?.numeroDePaciente ?? pacienteDesdeRuta?.NoPaciente ?? 0;
    const nombrePaciente =
      pacienteDesdeRuta?.nombre ?? pacienteDesdeRuta?.Nombre ?? pacienteDesdeRuta?.nombrePaciente ?? "";

    setExamen((prev) => ({
      ...prev,
      NoPaciente: noPaciente || 0,
      NombrePaciente: nombrePaciente,
      Paciente: pacienteDesdeRuta,
    }));
  }, [location.state]);

  const examenResumen = useMemo(() => {
    // Mostrar todos los campos de `examen` de forma legible y no editable.
    try {
      const keys = Object.keys(examen || {}).sort();
      const items = keys.map((k) => {
        let raw = examen[k];
        let value;
        if (raw === undefined || raw === null || raw === '') {
          value = '-';
        } else if (typeof raw === 'object') {
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
          NoExamen: 'Número de examen',
          NoPaciente: 'Paciente',
          FechaExamen: 'Fecha de examen',
          Motivo: 'Motivo',
          observacionesGenerales: 'Observaciones',
        };

        return { label: labelMap[k] ?? k, key: k, value };
      });
      return items;
    } catch (err) {
      return [{ label: 'Resumen', value: 'No se pudo generar el resumen del examen.' }];
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
      const response = await AgregarExamen(examen);
      console.log('Respuesta del servidor:', response);

      if (response && response.esCorrecto) {
        setOpenConfirmDialog(false);
        setOpenSnackbar(true);
        setNumeroExamenGuardado(response?.data?.NoExamen ?? examen?.NoExamen ?? '');
        setOpenSuccessDialog(true);
        // Limpiar el draft después de guardar exitosamente
        sessionStorage.removeItem(EXAMEN_STORAGE_KEY);
        setExamen(createInitialExamenState());
        setActiveStep(0);
        setValidationError('');
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

        if (!identificadorSucursal) {
          console.warn('No se encontró identificador de sucursal en sesión');
          return;
        }

        console.log('Llamando a API para obtener próximo número de examen...');
        const response = await axiosServices.get(
          `${apiBase}/Examenes/ObtenerProximoNumeroExamen/${identificadorSucursal}`,
        );

        console.log('Respuesta de API:', response.data);

        if (response.data && typeof response.data === 'number') {
          console.log('Actualizando NoExamen a:', response.data);
          setExamen((prev) => ({
            ...prev,
            NoExamen: response.data,
          }));
        }
      } catch (error) {
        console.error('Error al obtener próximo número de examen:', error);
      }
    };

    obtenerProximoNumeroExamen();
  }, []);

  const isStep0Valid = () => {
    const fechaExamenTexto = String(examen?.FechaExamen ?? '').trim();
    if (!fechaExamenTexto) {
      return { valid: false, message: 'Debe seleccionar una fecha de examen.' };
    }
    if (!esFechaExamenFutura(fechaExamenTexto)) {
      return {
        valid: false,
        message: 'La fecha y hora del examen debe ser posterior a la hora actual.',
      };
    }
    if (!examen.NoPaciente) {
      return { valid: false, message: 'Debe seleccionar un paciente antes de continuar.' };
    }
    if (!examen.Motivo || examen.Motivo.trim() === '') {
      return { valid: false, message: 'Debe ingresar el motivo de la consulta.' };
    }
    if (!examen.IdProfesional) {
      return { valid: false, message: 'Debe seleccionar un profesional tratante.' };
    }
    return { valid: true };
  };

  const isStep2Valid = () => {
    if (!examen?.TipoLenteId && !examen?.TipoLente) {
      return { valid: false, message: 'Debe seleccionar el tipo de lente.' };
    }
    if (!examen?.MaterialId && !examen?.Material) {
      return { valid: false, message: 'Debe seleccionar el material.' };
    }
    if (!examen?.Aro && !examen?.CodigoAro) {
      return { valid: false, message: 'Debe seleccionar o buscar un aro.' };
    }
    if (!examen?.Laboratorio) {
      return { valid: false, message: 'Debe seleccionar un laboratorio.' };
    }
    if (!String(examen?.NumeroOrdenLaboratorio ?? '').trim()) {
      return { valid: false, message: 'Debe ingresar el número de orden del laboratorio.' };
    }
    if (!String(examen?.Disposicion ?? '').trim()) {
      return { valid: false, message: 'Debe ingresar la disposición.' };
    }
    if (!String(examen?.Tratamiento ?? '').trim()) {
      return { valid: false, message: 'Debe ingresar el tratamiento.' };
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

    if (activeStep === 2) {
      const validation = isStep2Valid();
      if (!validation.valid) {
        setValidationError(validation.message);
        return;
      }
    }

    setValidationError('');
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleBack = () => {
    setValidationError('');
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleIrAPaso = (index) => {
    if (index === 0) {
      setActiveStep(index);
      setValidationError('');
      return;
    }

    if (activeStep === 0) {
      const validation = isStep0Valid();
      if (!validation.valid) {
        setValidationError(validation.message);
        return;
      }
    }

    if (activeStep === 2 && index > activeStep) {
      const validation = isStep2Valid();
      if (!validation.valid) {
        setValidationError(validation.message);
        return;
      }
    }

    if (index >= 0 && index < steps.length) {
      setActiveStep(index);
      setValidationError('');
    }
  };

  const handleFinish = () => {
    try {
      const payload = { ...examen };
      if (payload.FechaExamen instanceof Date)
        payload.FechaExamen = payload.FechaExamen.toISOString();
      if (payload.UltimoExamen instanceof Date)
        payload.UltimoExamen = payload.UltimoExamen.toISOString();

      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error al preparar payload del examen:', err);
    }
  };

  const stepsContent = [

    <Box key="datos-generales" sx={{ display: activeStep === 0 ? "block" : "none" }}>
      <DatosGenerales examen={examen} setExamen={setExamen} initialPaciente={examen.Paciente} />
    </Box>,
    <Box key="graduacion-rx" sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
      <GraduacionRx examen={examen} setExamen={setExamen} />
    </Box>,
    <Box key="diseno-de-lente" sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
      <DisenoDeLente examen={examen} setExamen={setExamen} />
    </Box>,
    <Box key="detalle-de-costo" sx={{ display: activeStep === 3 ? 'block' : 'none' }}>
      <DetalleDeCosto examen={examen} setExamen={setExamen} />
    </Box>,
  ];

  return (
    <PageContainer>
      <ParentCard title="Crear nuevo examen">
        <Box width="100%">
          {/* STEP INDICATOR */}
          <Stepper activeStep={activeStep} nonLinear sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepButton
                  color="inherit"
                  onClick={() => handleIrAPaso(index)}
                  sx={{ flexDirection: 'column', py: 1, minWidth: 0 }}
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
            <Button
              type="button"
              disabled={activeStep === 0}
              variant="outlined"
              onClick={handleBack}
            >
              Atrás
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                type="button"
                variant="contained"
                color="success"
                onClick={handleOpenConfirmDialog}
              >
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
          <Paper
            variant="outlined"
            sx={{ p: 2, bgcolor: 'background.paper', overflow: 'auto', maxHeight: 360 }}
          >
            <Box display="grid" gridTemplateColumns="max-content 1fr" gap={1}>
              {examenResumen.map((item) => (
                <React.Fragment key={item.label}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
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

      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Examen guardado</DialogTitle>
        <DialogContent>
          <Typography>
            {numeroExamenGuardado
              ? `El examen N° ${numeroExamenGuardado} se registró correctamente.`
              : 'El examen se registró correctamente.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenSuccessDialog(false)}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setOpenSnackbar(false)}>
          Examen número guardado correctamente
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ExamenVista;
