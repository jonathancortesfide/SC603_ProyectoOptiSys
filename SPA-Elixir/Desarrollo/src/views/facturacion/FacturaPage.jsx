import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import {
  useFactura,
  FacturaEncabezadoPrincipal,
  FacturaEncabezadoOpcional,
  ClienteSelector,
  PacienteCuentaSelector,
  ContextoCajaFactura,
  FacturaDetalle,
  FacturaTotales,
  FacturaPagos,
} from 'src/modules/facturacion';

/** Página de factura (POS / ERP). Estado centralizado en useFactura. Reutilizable para otros documentos. */
const FacturaPage = () => {
  const factura = useFactura();
  const {
    maestro,
    updateMaestro,
    paciente,
    setPaciente,
    vendedor,
    setVendedor,
    cuentaPaciente,
    setCuentaPaciente,
    cuentasPacienteDisponibles,
    setCondicionVenta,
    setPlazoDias,
    tipoCambioSugerido,
    detalle,
    addLinea,
    updateLinea,
    removeLinea,
    aplicarProductoALinea,
    pagos,
    addPago,
    updatePago,
    removePago,
    aplicarFormaPago,
    totales,
    totalPagos,
    diferenciaPagoVsTotal,
    catalogos,
  } = factura;

  return (
    <PageContainer title="Facturación" description="Registro de factura">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ParentCard title="Cliente y condiciones">
            <Grid container spacing={3}>
              <Grid item xs={12} lg={5}>
                <Stack spacing={2}>
                  <ClienteSelector
                    value={paciente}
                    onChange={setPaciente}
                    pacientes={catalogos.pacientes}
                  />
                  <PacienteCuentaSelector
                    paciente={paciente}
                    cuenta={cuentaPaciente}
                    onChange={setCuentaPaciente}
                    cuentasDisponibles={cuentasPacienteDisponibles}
                    monedasSucursal={catalogos.monedasSucursal}
                    monedaCodigoDocumento={maestro.monedaCodigo}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={7}>
                <FacturaEncabezadoPrincipal
                  maestro={maestro}
                  updateMaestro={updateMaestro}
                  setCondicionVenta={setCondicionVenta}
                  setPlazoDias={setPlazoDias}
                />
              </Grid>
            </Grid>
          </ParentCard>
        </Grid>

        <Grid item xs={12}>
          <ParentCard title="Detalle de productos">
            <FacturaDetalle
              detalle={detalle}
              detalleConImportes={totales.detalleConImportes}
              productos={catalogos.productos}
              monedaCodigo={maestro.monedaCodigo}
              addLinea={addLinea}
              updateLinea={updateLinea}
              removeLinea={removeLinea}
              aplicarProductoALinea={aplicarProductoALinea}
            />
          </ParentCard>
        </Grid>

        <Grid item xs={12}>
          <Accordion
            disableGutters
            elevation={0}
            defaultExpanded={false}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              '&:before': { display: 'none' },
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                minHeight: 56,
                bgcolor: 'action.hover',
                '& .MuiAccordionSummary-content': { my: 1.25 },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Opciones adicionales
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}
              >
                — número, vendedor, observaciones, caja
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2.5, pt: 0 }}>
              <FacturaEncabezadoOpcional
                maestro={maestro}
                updateMaestro={updateMaestro}
                vendedor={vendedor}
                setVendedor={setVendedor}
                vendedores={catalogos.vendedores}
              />
              <Divider sx={{ my: 2 }} />
              <ContextoCajaFactura
                maestro={maestro}
                updateMaestro={updateMaestro}
                cajas={catalogos.cajas}
                cierresCaja={catalogos.cierresCaja}
                monedasSucursal={catalogos.monedasSucursal}
                mostrarResumen={false}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} lg={6}>
          <ParentCard title="Pagos">
            <FacturaPagos
              pagos={pagos}
              formasPago={catalogos.formasPago}
              monedaCodigoDocumento={maestro.monedaCodigo}
              tipoCambioSugerido={tipoCambioSugerido}
              monedasSucursal={catalogos.monedasSucursal}
              addPago={addPago}
              updatePago={updatePago}
              removePago={removePago}
              aplicarFormaPago={aplicarFormaPago}
            />
          </ParentCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <ParentCard title="Totales">
            <FacturaTotales
              totales={totales}
              monedaCodigo={maestro.monedaCodigo}
              totalPagos={totalPagos}
              diferenciaPagoVsTotal={diferenciaPagoVsTotal}
            />
          </ParentCard>
        </Grid>

        <Grid item xs={12}>
          <ParentCard title="Acciones (prototipo)">
            <Stack spacing={1.5}>
              <Typography variant="body2" color="textSecondary">
                Estas acciones quedan en modo prototipo hasta integrar API / impresión.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" color="success" disabled>
                  Cobrar / Emitir (próximamente)
                </Button>
                <Button variant="outlined" disabled>
                  Imprimir
                </Button>
              </Stack>
            </Stack>
          </ParentCard>
        </Grid>
      </Grid>

      <Box mt={2} />
    </PageContainer>
  );
};

export default FacturaPage;
