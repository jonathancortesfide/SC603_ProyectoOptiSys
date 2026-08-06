import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from 'src/guards/authGuard/UseAuth';

/**
 * Se muestra cuando el usuario autenticado no tiene ninguna empresa/sucursal asignada.
 * Ocurre con el auto-registro hasta que el admin lo vincule a una sucursal.
 */
const SinSucursal = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  const handleReintentar = () => {
    navigate('/resolver-contexto', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at top, rgba(25,118,210,0.12), transparent 55%)'
            : 'radial-gradient(ellipse at top, rgba(25,118,210,0.08), transparent 55%)',
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center" py={6}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Sin sucursal asignada
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Tu cuenta fue creada correctamente, pero todavía no tenés una sucursal asignada.
            <br />
            Contactá al administrador para que te habilite el acceso.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={handleReintentar}>
              Reintentar
            </Button>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default SinSucursal;
