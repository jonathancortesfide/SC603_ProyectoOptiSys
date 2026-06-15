/**
 * Contratos de datos (documentación / IntelliSense). El backend puede mapear otros nombres.
 *
 * @typedef {Object} Paciente
 * @property {string|number|null} id
 * @property {string} nombre
 * @property {string} [documentoIdentidad]
 * @property {string} [telefono]
 * @property {string} [email]
 */

/**
 * @typedef {Object} Producto
 * @property {string|number|null} id
 * @property {string} [codigoInterno]
 * @property {string} nombre
 * @property {number} [precioReferencia]
 * @property {number} [tasaImpuesto]
 */

/**
 * @typedef {Object} Vendedor
 * @property {string|number|null} id
 * @property {string} nombre
 */

/**
 * @typedef {Object} FormaPago
 * @property {string|number|null} id
 * @property {string} nombre
 */

/**
 * @typedef {Object} FacturaMaestro
 * @property {string|number|null} id
 * @property {string} serie
 * @property {string} numero
 * @property {string} fechaEmision
 * @property {string} fechaVencimiento
 * @property {string} condicionVenta
 * @property {string} monedaCodigo
 * @property {string} observaciones
 * @property {string} estado
 */

/**
 * Línea persistida / borrador.
 * @typedef {Object} FacturaDetalle
 * @property {string} id
 * @property {number} orden
 * @property {string|number|null} productoId
 * @property {Producto|null} [producto]
 * @property {number} cantidad
 * @property {number} precioUnitario
 * @property {number} descuentoPct
 * @property {number} tasaImpuesto
 */

/**
 * @typedef {Object} FacturaFormaPago
 * @property {string} id
 * @property {string|number|null} formaPagoId
 * @property {FormaPago|null} [formaPago]
 * @property {number} monto
 * @property {string} [referencia]
 * @property {string} [notas]
 */

export {};
