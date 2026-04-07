import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { obtenerCuentasDePaciente } from '../../../requests/pacientes/RequestsPacientes';

const InformacionFacturacion = ({ paciente, onUpdate }) => {
  const [documentos, setDocumentos] = useState([]);
  const [monedaFiltro, setMonedaFiltro] = useState('');
  const [monedasDisponibles, setMonedasDisponibles] = useState([]);
  const [success, setSuccess] = useState('');
  const [recibosPorFactura, setRecibosPorFactura] = useState({});
  const [facturasExpandidas, setFacturasExpandidas] = useState({});

  useEffect(() => {
    if (paciente) {
      cargarDocumentosPaciente();
    }
  }, [paciente?.numeroDePaciente, paciente?.id]);

  const cargarDocumentosPaciente = async () => {
    if (!paciente?.numeroDePaciente) {
      setDocumentos([]);
      setMonedasDisponibles([]);
      setMonedaFiltro('');
      setRecibosPorFactura({});
      return;
    }

    const cuentas = await obtenerCuentasDePaciente(paciente.numeroDePaciente);
    const docsTemp = (Array.isArray(cuentas) ? cuentas : []).flatMap((cuenta, cuentaIndex) => {
      const facturas = (cuenta.facturas || []).map((factura, facturaIndex) => ({
        id: `f-${cuentaIndex}-${facturaIndex}`,
        noFactura: factura.noFactura,
        noExamen: factura.noExamen,
        fecha: factura.fecha,
        tipo: factura.tipo || 'Factura',
        moneda: factura.moneda || cuenta.moneda,
        monto: Number(factura.monto || 0),
        saldo: Number(factura.saldo || 0),
      }));

      const creditos = (cuenta.creditos || []).map((credito, creditoIndex) => ({
        id: `c-${cuentaIndex}-${creditoIndex}`,
        noFactura: credito.noDocumento,
        noExamen: '-',
        fecha: credito.fecha,
        tipo: credito.tipoDocumento || 'Crédito',
        moneda: credito.moneda || cuenta.moneda,
        monto: Number(credito.monto || 0),
        saldo: Number(credito.saldo || 0),
      }));

      return [...facturas, ...creditos];
    });

    setDocumentos(docsTemp);
    setRecibosPorFactura({});

    // Extraer monedas únicas de los documentos
    const monedas = [...new Set(docsTemp.map((doc) => doc.moneda))];
    setMonedasDisponibles(monedas);

    // Establecer la primera moneda como filtro predeterminado
    if (monedas.length > 0) {
      setMonedaFiltro(monedas[0]);
    } else {
      setMonedaFiltro('');
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setMonedaFiltro(value);
  };

  const handleToggleRecibos = (doc) => {
    if (doc.tipo !== 'Factura') return;
    setFacturasExpandidas((prev) => ({
      ...prev,
      [doc.noFactura]: !prev[doc.noFactura],
    }));
  };

  const documentosFiltrados = monedaFiltro
    ? documentos.filter((doc) => doc.moneda === monedaFiltro)
    : documentos;

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Historial de Documentos
      </Typography>

      {monedasDisponibles.length > 1 && (
        <Box sx={{ mb: 3, maxWidth: 250 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Filtrar por Moneda</InputLabel>
            <Select
              value={monedaFiltro}
              label="Filtrar por Moneda"
              onChange={handleChange('moneda')}
            >
              {monedasDisponibles.map((moneda) => (
                <MenuItem key={moneda} value={moneda}>
                  {moneda}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>No. Documento</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>No. Examen</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Moneda</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Monto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Saldo</TableCell>
                  <TableCell sx={{ width: 40 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => (
                    <React.Fragment key={doc.id}>
                      <TableRow
                        hover
                        onClick={() => handleToggleRecibos(doc)}
                        sx={doc.tipo === 'Factura' ? { cursor: 'pointer' } : undefined}
                      >
                        <TableCell>{doc.noFactura}</TableCell>
                        <TableCell>{doc.noExamen || '-'}</TableCell>
                        <TableCell>{new Date(doc.fecha).toLocaleDateString('es-CR')}</TableCell>
                        <TableCell>{doc.tipo}</TableCell>
                        <TableCell>{doc.moneda}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {doc.monto.toLocaleString('es-CR', {
                            style: 'currency',
                            currency: doc.moneda === 'CRC' ? 'CRC' : 'USD',
                          })}
                        </TableCell>
                        <TableCell>
                          {doc.saldo.toLocaleString('es-CR', {
                            style: 'currency',
                            currency: doc.moneda === 'CRC' ? 'CRC' : 'USD',
                          })}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {doc.tipo === 'Factura' && (
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleToggleRecibos(doc);
                              }}
                              sx={{ transition: 'transform 0.2s', transform: facturasExpandidas[doc.noFactura] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                              aria-label="toggle-recibos"
                            >
                              <ExpandMoreIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                      {doc.tipo === 'Factura' && (
                        <TableRow>
                          <TableCell colSpan={8} sx={{ p: 0, borderBottom: facturasExpandidas[doc.noFactura] ? 'none' : undefined }}>
                            <Collapse in={Boolean(facturasExpandidas[doc.noFactura])} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 2, backgroundColor: '#fafafa' }}>
                                {(recibosPorFactura[doc.noFactura] || []).length > 0 ? (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>No. Recibo</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Moneda</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Monto</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {(recibosPorFactura[doc.noFactura] || []).map((recibo) => (
                                        <TableRow key={recibo.id}>
                                          <TableCell>{recibo.noRecibo}</TableCell>
                                          <TableCell>{new Date(recibo.fecha).toLocaleDateString('es-CR')}</TableCell>
                                          <TableCell>{recibo.moneda}</TableCell>
                                          <TableCell>
                                            {recibo.monto.toLocaleString('es-CR', {
                                              style: 'currency',
                                              currency: recibo.moneda === 'CRC' ? 'CRC' : 'USD',
                                            })}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <Typography color="text.secondary">No hay recibos para esta factura.</Typography>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#999' }}>
                      No hay documentos registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
    </Box>
  );
};

export default InformacionFacturacion;
