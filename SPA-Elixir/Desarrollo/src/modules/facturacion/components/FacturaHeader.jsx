import PropTypes from 'prop-types';

import {

  Grid,

  TextField,

  MenuItem,

  FormControl,

  InputLabel,

  Select,

  Typography,

} from '@mui/material';

import { CONDICION_VENTA } from '../domain/facturaModel';

import VendedorSelector from './VendedorSelector';



const headerPropTypes = {

  maestro: PropTypes.object.isRequired,

  updateMaestro: PropTypes.func.isRequired,

  vendedor: PropTypes.object,

  setVendedor: PropTypes.func,

  vendedores: PropTypes.array,

  setCondicionVenta: PropTypes.func,

  setPlazoDias: PropTypes.func,

};



const headerDefaultProps = {

  vendedor: null,

  setVendedor: undefined,

  vendedores: [],

  setCondicionVenta: undefined,

  setPlazoDias: undefined,

};



/**

 * Condición, crédito (si aplica) y fecha de emisión — lo que suele estar visible en una factura reciente.

 */

export function FacturaEncabezadoPrincipal({

  maestro,

  updateMaestro,

  setCondicionVenta,

  setPlazoDias,

}) {

  const handle =

    (field) =>

    (e) => {

      const v = e.target.value;

      updateMaestro({ [field]: v });

    };



  return (

    <Grid container spacing={2}>

      <Grid item xs={12} sm={6} md={4}>

        <FormControl fullWidth size="small">

          <InputLabel id="factura-condicion-label">Condición</InputLabel>

          <Select

            labelId="factura-condicion-label"

            label="Condición"

            value={maestro.condicionVenta}

            onChange={(e) =>

              typeof setCondicionVenta === 'function'

                ? setCondicionVenta(e.target.value)

                : updateMaestro({ condicionVenta: e.target.value })

            }

          >

            <MenuItem value={CONDICION_VENTA.CONTADO}>Contado</MenuItem>

            <MenuItem value={CONDICION_VENTA.CREDITO}>Crédito</MenuItem>

          </Select>

        </FormControl>

      </Grid>



      {maestro.condicionVenta === CONDICION_VENTA.CREDITO ? (

        <>

          <Grid item xs={12} sm={6} md={4}>

            <TextField

              label="Plazo (días)"

              fullWidth

              size="small"

              type="number"

              inputProps={{ step: 1, min: 1 }}

              value={maestro.plazoDias || 0}

              onChange={(e) =>

                typeof setPlazoDias === 'function'

                  ? setPlazoDias(e.target.value)

                  : updateMaestro({ plazoDias: Number(e.target.value) || 0 })

              }

            />

          </Grid>

          <Grid item xs={12} sm={6} md={4}>

            <TextField

              label="Vencimiento"

              type="date"

              fullWidth

              size="small"

              InputLabelProps={{ shrink: true }}

              value={maestro.fechaVencimiento || ''}

              onChange={handle('fechaVencimiento')}

            />

          </Grid>

        </>

      ) : (

        <Grid item xs={12} md={8}>

          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', pt: 1 }}>

            Contado: sin vencimiento ni plazo

          </Typography>

        </Grid>

      )}



      <Grid item xs={12} md={maestro.condicionVenta === CONDICION_VENTA.CREDITO ? 12 : 4}>

        <TextField

          label="Fecha emisión"

          type="datetime-local"

          fullWidth

          size="small"

          InputLabelProps={{ shrink: true }}

          value={maestro.fechaEmision}

          onChange={handle('fechaEmision')}

        />

      </Grid>

    </Grid>

  );

}



FacturaEncabezadoPrincipal.propTypes = headerPropTypes;

FacturaEncabezadoPrincipal.defaultProps = headerDefaultProps;



/**

 * Número, vendedor y observaciones — útil colapsar para no saturar la pantalla.

 */

export function FacturaEncabezadoOpcional({ maestro, updateMaestro, vendedor, setVendedor, vendedores }) {

  const handle =

    (field) =>

    (e) => {

      const v = e.target.value;

      updateMaestro({ [field]: v });

    };



  return (

    <Grid container spacing={2}>

      <Grid item xs={12} sm={6} md={4}>

        <TextField

          label="Número"

          fullWidth

          size="small"

          value={maestro.numero}

          onChange={handle('numero')}

          placeholder="Automático"

        />

      </Grid>

      <Grid item xs={12} sm={6} md={8}>

        <VendedorSelector

          value={vendedor}

          onChange={setVendedor}

          vendedores={vendedores}

          label="Vendedor"

        />

      </Grid>

      <Grid item xs={12}>

        <TextField

          label="Observaciones"

          fullWidth

          size="small"

          multiline

          minRows={2}

          value={maestro.observaciones}

          onChange={handle('observaciones')}

        />

      </Grid>

    </Grid>

  );

}



FacturaEncabezadoOpcional.propTypes = headerPropTypes;

FacturaEncabezadoOpcional.defaultProps = headerDefaultProps;



/** Encabezado completo (principal + opcional). */

const FacturaHeader = (props) => (

  <>

    <FacturaEncabezadoPrincipal {...props} />

    <FacturaEncabezadoOpcional {...props} />

  </>

);



FacturaHeader.propTypes = headerPropTypes;

FacturaHeader.defaultProps = headerDefaultProps;



export default FacturaHeader;


