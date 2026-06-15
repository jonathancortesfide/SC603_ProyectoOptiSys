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

const InformacionFacturacion = ({ paciente, onUpdate }) => {
  const [documentos, setDocumentos] = useState([]);
  const [monedaFiltro, setMonedaFiltro] = useState('');
  const [monedasDisponibles, setMonedasDisponibles] = useState([]);
  const [success, setSuccess] = useState('');
  const [recibosPorFactura, setRecibosPorFactura] = useState({});
  const [facturasExpandidas, setFacturasExpandidas] = useState({});

  useEffect(() => {
    if (paciente) {
      // Cargar documentos del paciente (mock data)
      cargarDocumentosPaciente();
    }
  }, [paciente]);

  const cargarDocumentosPaciente = async () => {
    // Mock - En producción llamar al API de documentos del paciente
    const docsTemp = [
      {
        id: 1,
        noFactura: 'F-001',
        noExamen: 'E-001',
        fecha: '2025-02-15',
        tipo: 'Factura',
        moneda: 'CRC',
        monto: 150000,
        saldo: 0,
      },
      {
        id: 2,
        noFactura: 'F-002',
        noExamen: 'E-002',
        fecha: '2025-02-10',
        tipo: 'Factura',
        moneda: 'USD',
        monto: 250,
        saldo: 250,
      },
      {
        id: 4,
        noFactura: 'F-003',
        noExamen: 'E-003',
        fecha: '2025-02-01',
        tipo: 'Factura',
        moneda: 'USD',
        monto: 500,
        saldo: 0,
      },
      {
        id: 5,
        noFactura: 'F-004',
        noExamen: 'E-004',
        fecha: '2025-01-28',
        tipo: 'Factura',
        moneda: 'CRC',
        monto: 75000,
        saldo: 15000,
      },
      {
        id: 6,
        noFactura: 'F-005',
        noExamen: 'E-005',
        fecha: '2025-01-22',
        tipo: 'Factura',
        moneda: 'USD',
        monto: 300,
        saldo: 300,
      },
    ];
    setDocumentos(docsTemp);

    setRecibosPorFactura({
      'F-001': [
        { id: 101, noRecibo: 'R-0101', fecha: '2025-02-18', moneda: 'CRC', monto: 50000 },
        { id: 102, noRecibo: 'R-0102', fecha: '2025-02-20', moneda: 'CRC', monto: 100000 },
      ],
      'F-003': [
        { id: 201, noRecibo: 'R-0201', fecha: '2025-02-03', moneda: 'USD', monto: 300 },
        { id: 202, noRecibo: 'R-0202', fecha: '2025-02-05', moneda: 'USD', monto: 200 },
      ],
      'F-002': [],
      'F-005': [],
    });

    // Extraer monedas únicas de los documentos
    const monedas = [...new Set(docsTemp.map((doc) => doc.moneda))];
    setMonedasDisponibles(monedas);

    // Establecer la primera moneda como filtro predeterminado
    if (monedas.length > 0) {
      setMonedaFiltro(monedas[0]);
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
