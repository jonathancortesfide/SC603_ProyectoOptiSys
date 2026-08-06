import { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import { IconSearch, IconX, IconUser } from '@tabler/icons';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { useNavigate } from 'react-router-dom';
import { obtenerListaDePacientes } from 'src/requests/pacientes/RequestsPacientes';

const Search = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResultados([]);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResultados([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const lista = await obtenerListaDePacientes(query.trim());
        setResultados(lista.slice(0, 8));
      } catch {
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (paciente) => {
    setOpen(false);
    navigate('/pacientes', { state: { busqueda: paciente.cedula || paciente.nombre } });
  };

  return (
    <>
      <IconButton
        aria-label="Buscar paciente"
        color="inherit"
        onClick={() => setOpen(true)}
        size="large"
      >
        <IconSearch size="16" />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
      >
        <DialogContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <CustomTextField
              id="tb-search"
              placeholder="Buscar paciente por nombre o cédula..."
              fullWidth
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputProps={{ 'aria-label': 'Buscar paciente' }}
            />
            <IconButton size="small" onClick={() => setOpen(false)}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>

        {(loading || resultados.length > 0 || (query.trim() && !loading)) && (
          <>
            <Divider />
            <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : resultados.length > 0 ? (
                <>
                  <Typography variant="h5" px={1} pb={1}>
                    Pacientes encontrados
                  </Typography>
                  <List disablePadding>
                    {resultados.map((p) => (
                      <ListItemButton
                        key={p.noPaciente ?? p.cedula}
                        sx={{ py: 0.75, px: 1, borderRadius: 1 }}
                        onClick={() => handleSelect(p)}
                      >
                        <IconUser size="18" style={{ marginRight: 10, flexShrink: 0, opacity: 0.5 }} />
                        <ListItemText
                          primary={p.nombre}
                          secondary={p.cedula || '—'}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" px={1} py={1}>
                  No se encontraron pacientes para "{query}"
                </Typography>
              )}
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Search;
