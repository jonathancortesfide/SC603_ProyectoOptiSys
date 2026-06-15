import PropTypes from 'prop-types';
import { Autocomplete, TextField, createFilterOptions, Typography, Box } from '@mui/material';

const filterOptions = createFilterOptions({
  stringify: (option) => [option?.nombre, option?.codigo, option?.email].filter(Boolean).join(' '),
});

const VendedorSelector = ({
  value,
  onChange,
  vendedores,
  label = 'Vendedor',
  disabled = false,
}) => {
  return (
    <Autocomplete
      options={vendedores}
      value={value}
      onChange={(_, nuevo) => onChange(nuevo)}
      getOptionLabel={(option) => (option?.nombre ? option.nombre : '')}
      isOptionEqualToValue={(a, b) => a?.id === b?.id}
      filterOptions={filterOptions}
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} label={label} size="small" placeholder="Buscar vendedor…" />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box>
            <Typography variant="body2">{option.nombre}</Typography>
            {(option.codigo || option.email) && (
              <Typography variant="caption" color="textSecondary">
                {[option.codigo, option.email].filter(Boolean).join(' · ')}
              </Typography>
            )}
          </Box>
        </li>
      )}
    />
  );
};

VendedorSelector.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  vendedores: PropTypes.array.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default VendedorSelector;
