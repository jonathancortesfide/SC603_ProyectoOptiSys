import React, { useEffect, useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  CircularProgress,
  Stack,
} from '@mui/material';
import { obtenerCuentasDePaciente } from '../../requests/pacientes/RequestsPacientes';

const FechaCell = ({ fecha }) => (
  <>{fecha ? new Date(fecha).toLocaleDateString('es-ES') : '-'}</>
);

const CuentasPaciente = ({ open, onClose, paciente, cuentas: cuentasProp, onImport }) => {
  const [loading, setLoading] = useState(false);
  const [cuentas, setCuentas] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (open && paciente) loadCuentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paciente]);

  const loadCuentas = async () => {
    setLoading(true);
    try {
      if (cuentasProp && Array.isArray(cuentasProp) && cuentasProp.length) {
        setCuentas(cuentasProp);
      } else {
        const data = await obtenerCuentasDePaciente(paciente.id || paciente.numeroDePaciente || paciente.identificacion);
        // Expecting data: [{ moneda: 'CRC', saldo: 1200, facturas: [...], creditos: [...] }, ...]
        setCuentas(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setCuentas([]);
    }
    setLoading(false);
  };

  const monedas = useMemo(() => cuentas.map(c => c.moneda || 'N/A'), [cuentas]);

  const handleChange = (e, newValue) => setTab(newValue);

    return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Detalle de cuentas - {paciente?.nombre || paciente?.identificacion}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        ) : (
          <>
            {cuentas.length === 0 ? (
              <Typography>No hay cuentas para este paciente</Typography>
            ) : (
              <Box>
                <Tabs value={tab} onChange={handleChange} aria-label="monedas tabs">
                  {monedas.map((m, i) => (
                    <Tab key={m + i} label={`${m} — Saldo: ${cuentas[i]?.saldo ?? 0}`} />
                  ))}
                </Tabs>

                <Box sx={{ mt: 2 }}>
                  <Stack spacing={3}>
                    {/* Facturas list */}
                    <Paper variant="outlined">
                      <Box sx={{ p: 1 }}><Typography variant="h6">Facturas ({cuentas[tab]?.moneda || '-'})</Typography></Box>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>No Factura</TableCell>
                              <TableCell>No Examen</TableCell>
                              <TableCell>Fecha</TableCell>
                              <TableCell>Moneda</TableCell>
                              <TableCell align="right">Monto</TableCell>
                              <TableCell align="right">Saldo</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(cuentas[tab]?.facturas || []).sort((a,b)=> new Date(b.fecha) - new Date(a.fecha)).map(f => (
                              <TableRow key={f.noFactura || f.id}>
                                <TableCell>{f.noFactura}</TableCell>
                                <TableCell>{f.noExamen}</TableCell>
                                <TableCell><FechaCell fecha={f.fecha} /></TableCell>
                                <TableCell>{f.moneda}</TableCell>
                                <TableCell align="right">{f.monto}</TableCell>
                                <TableCell align="right">{f.saldo}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>

                    {/* Documentos de crédito */}
                    <Paper variant="outlined">
                      <Box sx={{ p: 1 }}><Typography variant="h6">Documentos de crédito ({cuentas[tab]?.moneda || '-'})</Typography></Box>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>No Documento</TableCell>
                              <TableCell>Fecha</TableCell>
                              <TableCell>Tipo de documento</TableCell>
                              <TableCell>Moneda</TableCell>
                              <TableCell align="right">Monto</TableCell>
                              <TableCell align="right">Saldo</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(cuentas[tab]?.creditos || []).sort((a,b)=> new Date(b.fecha) - new Date(a.fecha)).map(d => (
                              <TableRow key={d.noDocumento || d.id}>
                                <TableCell>{d.noDocumento}</TableCell>
                                <TableCell><FechaCell fecha={d.fecha} /></TableCell>
                                <TableCell>{d.tipoDocumento}</TableCell>
                                <TableCell>{d.moneda}</TableCell>
                                <TableCell align="right">{d.monto}</TableCell>
                                <TableCell align="right">{d.saldo}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Stack>
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      {/* Optional import action to copy cuentas back to a parent form */}
      {onImport && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" onClick={() => { onImport(cuentas); onClose && onClose(); }}>
            Importar cuentas al formulario
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default CuentasPaciente;
