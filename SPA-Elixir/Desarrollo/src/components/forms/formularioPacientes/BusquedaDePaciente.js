import React, { useEffect } from 'react';
import { CardContent, Typography, Grid, Button, Box, AvatarGroup, Avatar, Stack } from '@mui/material';
import BlankCard from '../../shared/BlankCard';
import AsyncSelect from 'react-select/async';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import { obtenerListaDePacientes } from '../../../requests/pacientes/RequestsPacientes';

import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import img4 from 'src/assets/images/profile/user-4.jpg';


const followerCard = [
  {
    title: 'Andrew Grant',
    location: 'El Salvador',
    avatar: img1,
  },
  {
    title: 'Leo Pratt',
    location: 'Bulgaria',
    avatar: img2,
  },
  {
    title: 'Charles Nunez',
    location: 'Nepal',
    avatar: img3,
  },
  {
    title: 'Lora Powers',
    location: 'Nepal',
    avatar: img4,
  },
];


const esPacienteActivo = (paciente) => {
  const activo = paciente?.activo ?? paciente?.Activo ?? paciente?.esActivo ?? paciente?.EsActivo ?? paciente?.estado ?? paciente?.Estado;

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

const BusquedaDePaciente = ({ noPaciente: initialNoPaciente = 0, initialPaciente = null, onPacienteChange }) => {
  const [options, setOptions] = React.useState([]);
  const [pacientes, setPacientes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedPaciente, setSelectedPaciente] = React.useState(null);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [noPaciente, setNoPaciente] = React.useState(initialNoPaciente);
  const [isVisible, setIsVisible] = React.useState(false);

  // Pre-seleccionar paciente si viene desde fuera (ej: desde /pacientes)
  useEffect(() => {
    if (initialPaciente) {
      const nro = initialPaciente.noPaciente || initialPaciente.numeroDePaciente;
      const opcion = {
        label: `${initialPaciente.cedula}-${initialPaciente.nombre}`,
        value: nro,
      };
      setSelectedPaciente(initialPaciente);
      setSelectedOption(opcion);
      setNoPaciente(nro);
      setIsVisible(true);
    }
  }, []);
  // Cargar opciones por defecto
  const loadDefaultData = async (inputValue, callback) => {
    if(inputValue.length === 0) {
      setLoading(true);
      try {
        const response = await obtenerListaDePacientes('');
        const pacientesActivos = (response || []).filter(esPacienteActivo);
        if (pacientesActivos.length) {
          const formattedData = pacientesActivos.map(item => ({
            label: `${item.cedula}-${item.nombre}`,
            value: item.noPaciente || item.numeroDePaciente
          }));
          setOptions(formattedData);
            setPacientes(pacientesActivos);
          return formattedData; 
        } else {
          setOptions([]);
          return [];
        }
      } catch (error) {
        console.error("Error al cargar datos por defecto:", error);
      } finally {
        setLoading(false);
      }
    } else if (inputValue.length > 0 && inputValue.length < 4) {
      return options.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      ); 
    }  
  };

  const loadOptions = async (inputValue, callback) => {
    let valoresPredefinidos = await loadDefaultData(inputValue,callback); // Cargar datos por defecto
    if(inputValue.length > 3) {
      setLoading(true);
      try {
        const response = await obtenerListaDePacientes(inputValue);
        const pacientesActivos = (response || []).filter(esPacienteActivo);
        if (pacientesActivos.length) {
          const formattedData = pacientesActivos.map(item => ({
            label: `${item.cedula}-${item.nombre}`,
            value: item.noPaciente || item.numeroDePaciente
          }));
          setOptions(formattedData);
          setPacientes(pacientesActivos);
          return formattedData;
        } else {
          setOptions([]); // Si no hay datos, vaciar las opciones
          callback(options);
          return [];
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    } else {
      callback(valoresPredefinidos);
      return valoresPredefinidos;
    }
  };

  const seleccionarPaciente = async (numeroDePaciente) => { 
    if (numeroDePaciente) {
      const paciente = pacientes.find(p => (p.noPaciente || p.numeroDePaciente) === numeroDePaciente.value);
      setSelectedPaciente(paciente);
      setSelectedOption(numeroDePaciente);
      setNoPaciente(numeroDePaciente.value);
      if (onPacienteChange) {
        onPacienteChange(paciente || { noPaciente: numeroDePaciente.value });
      }
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setSelectedPaciente(null);
      setSelectedOption(null);
      setNoPaciente(null);
      if (onPacienteChange) {
        onPacienteChange(null);
      }
    }
  };
  return (
    <div>
      
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} display="flex" alignItems="center" justify-Content="flex-start">
          <CustomFormLabel 
          fullWidth 
          htmlFor="fs-pwd" 
          sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            Paciente
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions} // Usamos `promiseOptions` para cargar datos asíncronos
          value={selectedOption}
          placeholder="Ingrese la identificación o nombre del paciente"
          noOptionsMessage={() => "No se encontraron resultados"} // Mensaje cuando no hay resultados
          menuPortalTarget={document.body} // Esto mueve el dropdown fuera del contenedor
          onChange={seleccionarPaciente} // Función que se ejecuta cuando se selecciona un valor
          styles={selectStyles}
      />
        </Grid>
        <br></br>
        <br></br>
        <Grid container spacing={3} justifyContent="center" alignItems="center"> 
  <Grid item xs={12} sm={6} lg={12} marginLeft={2} marginTop={2}>
    <BlankCard>
    {isVisible && (
      <CardContent>
      <Stack direction="row" spacing={2} mt={3}>
        <Box>
        <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={img1} sx={{ height: 80, width: 80 }}></Avatar>
          <Typography variant="h6" mb={1}>
            Nombre: {selectedPaciente?.nombre}
          </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" marginTop={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Identificación: {selectedPaciente?.cedula}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Correo: {selectedPaciente?.email}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Stack spacing={2} mt={3} direction="row" justifyContent="center" alignItems="center">
        <Button size="large" variant="text" color="primary">
          Editar paciente
        </Button>
      </Stack>
    </CardContent>
      )}

    </BlankCard>
  </Grid>
</Grid>

      </Grid>
    </div>
  );
};

// React.memo: evita re-renderizar este componente si sus props
// (noPaciente, initialPaciente, onPacienteChange) no cambiaron entre
// renders del padre. Depende de que onPacienteChange venga envuelto
// en useCallback en el padre.
export default React.memo(BusquedaDePaciente);