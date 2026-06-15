import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ExamenContext = createContext(null);
const STORAGE_KEY = "examenDraft";

const initialExamenState = {
  
  laboratorio: null,
  numLaboratorio: "",
  observaciones: "",
  disposicion: "",
  tratamiento: "",
  costos: {
    costoAro: 0,
    costoLente: 0,
    costoMaterial: 0,
    costoExamen: 0,
  },
  presupuesto: {
    subtotal: 0,
    impuesto: 0,
    total: 0,
  },
  PrecioFinal: 0,
  noExamen: "",
  fecha: new Date().toISOString().split("T")[0],
  motivo: "",
  NoPaciente: 0,
  NombreProfesional: "",
  CodigoProfesional: "",
  IdProfesional: null,
};

const loadDraft = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialExamenState;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : initialExamenState;
  } catch (error) {
    console.warn("No se pudo cargar el examen guardado en sesión:", error);
    return initialExamenState;
  }
};

export const ExamenProvider = ({ children }) => {
  const [examen, setExamen] = useState(() => loadDraft());

  const updateExamen = useCallback((updater) => {
    setExamen((prev) =>
      typeof updater === "function" ? updater(prev) : { ...prev, ...updater }
    );
  }, []);

  const clearExamen = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setExamen(initialExamenState);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(examen));
    } catch (error) {
      console.warn("No se pudo guardar el examen en sesión:", error);
    }
  }, [examen]);

  useEffect(() => {
    const subtotal =
      Number(examen.costos?.costoAro ?? 0) +
      Number(examen.costos?.costoLente ?? 0) +
      Number(examen.costos?.costoMaterial ?? 0) +
      Number(examen.costos?.costoExamen ?? 0);
    const impuesto = Number((subtotal * 0.13).toFixed(2));
    const total = Number((subtotal + impuesto).toFixed(2));

    setExamen((prev) => {
      if (
        prev.presupuesto?.subtotal === subtotal &&
        prev.presupuesto?.impuesto === impuesto &&
        prev.presupuesto?.total === total &&
        prev.PrecioFinal === total
      ) {
        return prev;
      }
      return {
        ...prev,
        presupuesto: { subtotal, impuesto, total },
        PrecioFinal: total,
      };
    });
  }, [examen.costos]);

  const value = useMemo(
    () => ({ examen, setExamen, updateExamen, clearExamen }),
    [examen, updateExamen, clearExamen]
  );

  return <ExamenContext.Provider value={value}>{children}</ExamenContext.Provider>;
};

export const useExamen = () => {
  const context = useContext(ExamenContext);
  if (!context) {
    throw new Error("useExamen must be used within ExamenProvider");
  }
  return context;
};
