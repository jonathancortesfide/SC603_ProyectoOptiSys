import React, { useEffect, useState } from 'react';
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

const BusquedaDeDoctor = ({ identificador: initialIdentificador, onDoctorChange }) => {
  const [doctores, setDoctores] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const identificador = initialIdentificador ?? getSucursalIdentificador();

  const cargarDoctores = async () => {
    setLoading(true);
    try {
      const lista = await BuscarDoctoresPorIdentificador(identificador);
      setDoctores(lista || []);
      return lista || [];
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
    const lista = doctores.length ? doctores : await cargarDoctores();
    const texto = String(inputValue || '').toLowerCase();
    const opciones = (lista || [])
      .filter((doctor) => {
        if (!texto) return true;
        const nombre = String(doctor.nombre || doctor.Nombre || '').toLowerCase();
        const codigo = String(doctor.codigoProfesional || doctor.CodigoProfesional || '').toLowerCase();
        return nombre.includes(texto) || codigo.includes(texto);
      })
      .map(formatDoctorOption);
    return opciones;
  };

  const handleChange = (option) => {
    setSelectedDoctor(option);
    if (onDoctorChange) {
      onDoctorChange(option ? option.data : null);
    }
  };

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
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusquedaDeDoctor;
