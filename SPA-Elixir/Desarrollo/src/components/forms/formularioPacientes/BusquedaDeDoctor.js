import React, { useEffect, useState, useRef, useMemo } from 'react';
import AsyncSelect from 'react-select/async';
import { Grid, Box } from '@mui/material';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import { BuscarDoctoresPorIdentificador } from '../../../requests/usuarios/RequestsDoctores';
import { getSucursalIdentificador } from '../../../utils/sucursal';

const formatDoctorOption = (doctor) => ({
  label: `${doctor.nombre || doctor.Nombre || ''}${(doctor.codigoProfesional || doctor.CodigoProfesional) ? ` - ${doctor.codigoProfesional || doctor.CodigoProfesional}` : ''}`,
  value: doctor.idUsuario ?? doctor.identificador ?? doctor.id ?? null,
  data: doctor
});

const esDoctorActivo = (doctor) => {
  const activo = doctor?.activo ?? doctor?.Activo ?? doctor?.esActivo ?? doctor?.EsActivo ?? doctor?.estado ?? doctor?.Estado;

  if (activo === 1 || activo === '1') return true;
  if (activo === 0 || activo === '0') return false;
  if (typeof activo === 'string') {
    return ['true', 'si', 's', 'activo', 'active'].includes(activo.trim().toLowerCase());
  }

  return !!activo;
};

// Objeto estático: se crea UNA sola vez, no en cada render.
// Esto evita romper la memoización interna de react-select.
const selectStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const BusquedaDeDoctor = ({ identificador: initialIdentificador, onDoctorChange }) => {
  const [doctores, setDoctores] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  // Memoizado: solo se recalcula si initialIdentificador cambia,
  // en vez de ejecutarse en cada render (incluyendo los que dispara
  // escribir en otros campos del formulario padre).
  const identificador = useMemo(
    () => initialIdentificador ?? getSucursalIdentificador(),
    [initialIdentificador]
  );

  const cargarDoctores = async () => {
    setLoading(true);
    try {
      const lista = await BuscarDoctoresPorIdentificador(identificador);
      const doctoresActivos = (lista || []).filter(esDoctorActivo);
      setDoctores(doctoresActivos);
      return doctoresActivos;
    } catch (error) {
      console.error('Error cargando doctores:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDoctores();
  }, [identificador]);

  const loadOptions = async (inputValue) => {
    return new Promise((resolve) => {
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new debounce timer with 300ms delay
      debounceTimerRef.current = setTimeout(async () => {
        const lista = doctores.length ? doctores : await cargarDoctores();
        const texto = String(inputValue || '').toLowerCase();
        const opciones = (lista || [])
          .filter(esDoctorActivo)
          .filter((doctor) => {
            if (!texto) return true;
            const nombre = String(doctor.nombre || doctor.Nombre || '').toLowerCase();
            const codigo = String(doctor.codigoProfesional || doctor.CodigoProfesional || '').toLowerCase();
            return nombre.includes(texto) || codigo.includes(texto);
          })
          .map(formatDoctorOption);
        resolve(opciones);
      }, 300);
    });
  };

  const handleChange = (option) => {
    setSelectedDoctor(option);
    if (onDoctorChange) {
      onDoctorChange(option ? option.data : null);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} display="flex" alignItems="center" justifyContent="flex-start">
          <CustomFormLabel htmlFor="doctor-search" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            Profesional tratante
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <AsyncSelect
            cacheOptions
            defaultOptions={doctores.length ? doctores.map(formatDoctorOption) : true}
            loadOptions={loadOptions}
            isLoading={loading}
            openMenuOnFocus
            openMenuOnClick
            value={selectedDoctor}
            onChange={handleChange}
            placeholder="Ingrese nombre o código del profesional"
            noOptionsMessage={() => loading ? 'Cargando doctores...' : 'No se encontraron doctores'}
            menuPortalTarget={document.body}
            styles={selectStyles}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// React.memo: evita re-renderizar este componente si sus props
// (identificador, onDoctorChange) no cambiaron entre renders del padre.
// Depende de que onDoctorChange venga envuelto en useCallback en el padre.
export default React.memo(BusquedaDeDoctor);