import PropTypes from 'prop-types';
import { Autocomplete, TextField, Typography, Box, createFilterOptions } from '@mui/material';

const filterOptions = createFilterOptions({
  stringify: (option) =>
    [
      option?.nombre,
      option?.documentoIdentidad,
      option?.telefono,
      option?.email,
    ]
      .filter(Boolean)
      .join(' '),
});

const ClienteSelector = ({
  value,
  onChange,
  pacientes,
  label = 'Paciente / cliente',
  disabled = false,
}) => {
  return (
    <Autocomplete
      options={pacientes}
      value={value}
      onChange={(_, nuevo) => onChange(nuevo)}
      getOptionLabel={(option) => (option?.nombre ? option.nombre : '')}
      isOptionEqualToValue={(a, b) => a?.id === b?.id}
      filterOptions={filterOptions}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          placeholder="Buscar por nombre o documento…"
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box>
            <Typography variant="body2">{option.nombre}</Typography>
            <Typography variant="caption" color="textSecondary">
              {[option.documentoIdentidad, option.telefono, option.email].filter(Boolean).join(' · ')}
            </Typography>
          </Box>
        </li>
      )}
    />
  );
};

ClienteSelector.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  pacientes: PropTypes.array.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ClienteSelector;
