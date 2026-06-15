import { Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import StorefrontIcon from '@mui/icons-material/Storefront';

import { getNombreEmpresaSesion } from 'src/utils/empresa';
import { getNombreSucursalSesion } from 'src/utils/sucursal';

/**
 * Muestra en la barra el nombre de empresa y sucursal guardados al iniciar sesión operativa.
 */
const SesionEmpresaSucursalBarra = () => {
  const empresa = getNombreEmpresaSesion();
  const sucursal = getNombreSucursalSesion();

  if (!empresa && !sucursal) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        ml: { xs: 0.5, sm: 2 },
        mr: 1,
        minWidth: 0,
        maxWidth: { xs: '46vw', sm: 380, md: 520 },
      }}
      aria-live="polite"
    >
      {empresa ? (
        <Box display="flex" alignItems="center" gap={0.5} minWidth={0} sx={{ flex: '1 1 auto' }}>
          <BusinessIcon sx={{ fontSize: 18, opacity: 0.75, flexShrink: 0 }} color="action" />
          <Typography
            variant="subtitle2"
            component="span"
            fontWeight={600}
            color="text.primary"
            noWrap
            title={empresa}
          >
            {empresa}
          </Typography>
        </Box>
      ) : null}
      {empresa && sucursal ? (
        <Typography variant="subtitle2" color="text.disabled" sx={{ flexShrink: 0 }}>
          ·
        </Typography>
      ) : null}
      {sucursal ? (
        <Box display="flex" alignItems="center" gap={0.5} minWidth={0} sx={{ flex: '1 1 auto' }}>
          <StorefrontIcon sx={{ fontSize: 18, opacity: 0.75, flexShrink: 0 }} color="action" />
          <Typography
            variant="subtitle2"
            component="span"
            fontWeight={500}
            color="text.secondary"
            noWrap
            title={sucursal}
          >
            {sucursal}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default SesionEmpresaSucursalBarra;
