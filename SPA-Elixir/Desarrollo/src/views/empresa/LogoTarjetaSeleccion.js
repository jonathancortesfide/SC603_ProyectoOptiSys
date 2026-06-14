import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Avatar } from '@mui/material';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';

import axios from 'src/utils/axios';
import {
  apiBaseAbsoluto,
  bytesToImagenDataUrl,
  interpretarImagenApi,
} from 'src/utils/empresaImagen';

/** Logo en tarjeta de selección (empresa o sucursal): binario/URL con auth si aplica. */
const LogoTarjetaSeleccion = ({ imagenRaw }) => {
  const interpretado = useMemo(() => interpretarImagenApi(imagenRaw), [imagenRaw]);
  const [src, setSrc] = useState(null);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    setFallo(false);
    let blobRevoke = null;
    let cancelled = false;

    const cargar = async () => {
      if (interpretado.tipo === 'bytes') {
        setSrc(bytesToImagenDataUrl(interpretado.bytes));
        return;
      }
      if (interpretado.tipo !== 'href') {
        setSrc(null);
        return;
      }

      const url = interpretado.src;
      if (!url) {
        setSrc(null);
        return;
      }
      if (url.startsWith('data:')) {
        setSrc(url);
        return;
      }

      try {
        const apiOrigin = new URL(apiBaseAbsoluto(), window.location.href).origin;
        const imgOrigin = new URL(url, window.location.href).origin;
        const mismoOrigenQueApi = imgOrigin === apiOrigin;

        if (mismoOrigenQueApi) {
          const { data } = await axios.get(url, { responseType: 'blob' });
          if (cancelled) return;
          if (!(data instanceof Blob) || data.size === 0) {
            setSrc(null);
            return;
          }
          const u = URL.createObjectURL(data);
          blobRevoke = u;
          setSrc(u);
        } else {
          setSrc(url);
        }
      } catch {
        if (!cancelled) setSrc(null);
      }
    };

    cargar();

    return () => {
      cancelled = true;
      if (blobRevoke) URL.revokeObjectURL(blobRevoke);
    };
  }, [interpretado]);

  useEffect(() => {
    setFallo(false);
  }, [src]);

  const placeholder = (
    <Avatar
      variant="rounded"
      sx={{
        width: 96,
        height: 96,
        bgcolor: 'primary.light',
        color: 'primary.contrastText',
      }}
    >
      <BusinessCenterOutlinedIcon sx={{ fontSize: 48 }} />
    </Avatar>
  );

  if (!src || fallo) {
    return placeholder;
  }

  return (
    <Box
      sx={{
        width: 96,
        height: 96,
        flexShrink: 0,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'grey.50'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0.75,
      }}
    >
      <Box
        component="img"
        src={src}
        alt=""
        onError={() => setFallo(true)}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
    </Box>
  );
};

LogoTarjetaSeleccion.propTypes = {
  imagenRaw: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]),
};

LogoTarjetaSeleccion.defaultProps = {
  imagenRaw: null,
};

export default LogoTarjetaSeleccion;
