import React, { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    InputAdornment,
    Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { buscarUsuariosParaAsignar, asignarSucursalAUsuario } from '../../../requests/usuarios/RequestsUsuarios';
import { getSucursalIdentificador } from 'src/utils/sucursal';

/**
 * Pantalla para que el admin busque usuarios sin sucursal y los vincule a la sucursal activa.
 * Requiere permiso: USUARIO_SIN_SUCURSAL_VER / USUARIO_ASIGNAR_SUCURSAL
 */
const UsuariosPendientes = () => {
    const [busqueda, setBusqueda] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [asignando, setAsignando] = useState(null); // idUsuario en proceso
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null);

    const handleBuscar = async () => {
        setCargando(true);
        setError(null);
        setMensajeExito(null);
        const resultado = await buscarUsuariosParaAsignar(busqueda);
        setCargando(false);
        if (resultado.esCorrecto) {
            setUsuarios(resultado.lista);
            if (!resultado.lista.length) setError('No se encontraron usuarios sin sucursal con ese criterio.');
        } else {
            setError(resultado.mensaje || 'Error al buscar usuarios.');
        }
    };

    const handleAsignar = async (idUsuario, nombreUsuario) => {
        const identificador = getSucursalIdentificador();
        if (!identificador) {
            setError('No hay una sucursal seleccionada en la sesión.');
            return;
        }
        setAsignando(idUsuario);
        setError(null);
        setMensajeExito(null);
        const resultado = await asignarSucursalAUsuario(idUsuario, identificador);
        setAsignando(null);
        if (resultado.esCorrecto) {
            setMensajeExito(`${nombreUsuario} fue vinculado a la sucursal correctamente.`);
            setUsuarios((prev) => prev.filter((u) => u.idUsuario !== idUsuario));
        } else {
            setError(resultado.mensaje || 'No se pudo asignar la sucursal.');
        }
    };

    return (
        <PageContainer title="Usuarios Pendientes" description="Asignar sucursal a usuarios sin acceso">
            <Box>
                <Typography variant="h4" fontWeight={700} mb={1}>
                    Usuarios sin sucursal
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Buscá usuarios que se registraron pero no tienen sucursal asignada. Al hacer clic en
                    &quot;Asignar&quot; quedan vinculados a tu sucursal activa.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                    <CustomTextField
                        placeholder="Buscar por nombre o email..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleBuscar}
                        disabled={cargando}
                        startIcon={cargando ? <CircularProgress size={16} /> : <SearchIcon />}
                    >
                        Buscar
                    </Button>
                </Stack>

                {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
                {mensajeExito && <Alert severity="success" sx={{ mb: 2 }}>{mensajeExito}</Alert>}

                {usuarios.length > 0 && (
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Nombre</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell align="center"><strong>Acción</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usuarios.map((u) => (
                                    <TableRow key={u.idUsuario} hover>
                                        <TableCell>{u.nombre}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                startIcon={
                                                    asignando === u.idUsuario
                                                        ? <CircularProgress size={14} color="inherit" />
                                                        : <PersonAddIcon />
                                                }
                                                onClick={() => handleAsignar(u.idUsuario, u.nombre)}
                                                disabled={asignando !== null}
                                            >
                                                Asignar a mi sucursal
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </PageContainer>
    );
};

export default UsuariosPendientes;
