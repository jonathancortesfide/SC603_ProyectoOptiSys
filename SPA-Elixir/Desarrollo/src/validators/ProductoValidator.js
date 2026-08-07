/**
 * Validador de Productos
 * Contiene funciones de validación para productos según las reglas de negocio
 */

// ============================================
// ERRORES
// ============================================

const ERRORES = {
  CODIGO_REQUERIDO: 'El código interno es requerido',
  CODIGO_DUPLICADO: 'El código interno ya existe',
  NOMBRE_REQUERIDO: 'El nombre del producto es requerido',
  DESCRIPCION_REQUERIDA: 'La descripción del producto es requerida',
  GRUPO_REQUERIDO: 'El grupo del producto es requerido',
  TIPO_ARTICULO_REQUERIDO: 'El tipo de artículo es requerido',
  PORCENTAJE_IMPUESTO_INVALIDO: 'El porcentaje de impuesto es inválido',
  EXISTENCIA_INVALIDA: 'La cantidad de existencia es inválida',
  MINIMO_INVALIDO: 'El stock mínimo es inválido',
  COSTO_INVALIDO: 'El costo del producto es inválido',
  PRECIO_INVALIDO: 'El precio del producto es inválido',
  USUARIO_REQUERIDO: 'El usuario es requerido',
  EMPRESA_REQUERIDA: 'El código de empresa es requerido',
  LISTA_PRECIOS_INVALIDA: 'La lista de precios contiene errores',
};

// ============================================
// VALIDADORES
// ============================================

/**
 * Valida los datos básicos de un producto
 * @param {Object} producto - Datos del producto
 * @returns {Object} Objeto con errores encontrados
 */
export const validarProductoBasico = (producto) => {
  const errores = {};

  if (!producto) {
    return { general: 'El producto no puede estar vacío' };
  }

  // Validar empresa
  if (!producto.noEmpresa || producto.noEmpresa <= 0) {
    errores.noEmpresa = ERRORES.EMPRESA_REQUERIDA;
  }

  // Validar código
  if (!producto.codigo || !String(producto.codigo).trim()) {
    errores.codigo = ERRORES.CODIGO_REQUERIDO;
  } else if (String(producto.codigo).trim().length > 50) {
    errores.codigo = 'El código no puede exceder 50 caracteres';
  }

  // Validar nombre
  if (!producto.nombre || !String(producto.nombre).trim()) {
    errores.nombre = ERRORES.NOMBRE_REQUERIDO;
  } else if (String(producto.nombre).trim().length > 200) {
    errores.nombre = 'El nombre no puede exceder 200 caracteres';
  }

  // Validar descripción
  if (!producto.descripcion || !String(producto.descripcion).trim()) {
    errores.descripcion = ERRORES.DESCRIPCION_REQUERIDA;
  } else if (String(producto.descripcion).trim().length > 500) {
    errores.descripcion = 'La descripción no puede exceder 500 caracteres';
  }

  // Validar grupo
  if (!producto.noGrupo || producto.noGrupo <= 0) {
    errores.noGrupo = ERRORES.GRUPO_REQUERIDO;
  }

  // Validar tipo de artículo
  if (!producto.tipoArticulo || !String(producto.tipoArticulo).trim()) {
    errores.tipoArticulo = ERRORES.TIPO_ARTICULO_REQUERIDO;
  }

  // Validar usuario
  if (!producto.usuario || !String(producto.usuario).trim()) {
    errores.usuario = ERRORES.USUARIO_REQUERIDO;
  }

  return errores;
};

/**
 * Valida los datos financieros del producto
 * @param {Object} producto - Datos del producto
 * @returns {Object} Objeto con errores encontrados
 */
export const validarProductoFinanciero = (producto) => {
  const errores = {};

  if (!producto) return errores;

  // Validar porcentaje de impuesto
  if (producto.porcentajeImpuesto !== undefined && producto.porcentajeImpuesto !== null) {
    const porciento = Number(producto.porcentajeImpuesto);
    if (isNaN(porciento) || porciento < 0 || porciento > 100) {
      errores.porcentajeImpuesto = ERRORES.PORCENTAJE_IMPUESTO_INVALIDO;
    }
  }

  // Validar existencia
  if (producto.existencia !== undefined && producto.existencia !== null) {
    const existencia = Number(producto.existencia);
    if (isNaN(existencia) || existencia < 0) {
      errores.existencia = ERRORES.EXISTENCIA_INVALIDA;
    }
  }

  // Validar stock mínimo
  if (producto.minimo !== undefined && producto.minimo !== null) {
    const minimo = Number(producto.minimo);
    if (isNaN(minimo) || minimo < 0) {
      errores.minimo = ERRORES.MINIMO_INVALIDO;
    }
  }

  // Validar costos
  ['costoPromedioPonderado', 'costoUltimaCompra', 'costoFinal'].forEach((campo) => {
    if (producto[campo] !== undefined && producto[campo] !== null && producto[campo] !== '') {
      const valor = Number(producto[campo]);
      if (isNaN(valor) || valor < 0) {
        errores[campo] = ERRORES.COSTO_INVALIDO;
      }
    }
  });

  // Validar precios en lista de precios
  if (Array.isArray(producto.listasPrecios) && producto.listasPrecios.length > 0) {
    const erroresLista = [];
    producto.listasPrecios.forEach((lp, idx) => {
      const erroresLP = {};

      if (!lp.nombre || !String(lp.nombre).trim()) {
        erroresLP.nombre = 'Nombre de lista es requerido';
      }

      if (lp.utilidad !== undefined && lp.utilidad !== null && lp.utilidad !== '') {
        const utilidad = Number(lp.utilidad);
        if (isNaN(utilidad) || utilidad < 0) {
          erroresLP.utilidad = 'Utilidad inválida';
        }
      }

      if (lp.precioNeto !== undefined && lp.precioNeto !== null && lp.precioNeto !== '') {
        const precio = Number(lp.precioNeto);
        if (isNaN(precio) || precio < 0) {
          erroresLP.precioNeto = 'Precio neto inválido';
        }
      }

      if (Object.keys(erroresLP).length > 0) {
        erroresLista[idx] = erroresLP;
      }
    });

    if (erroresLista.length > 0) {
      errores.listasPrecios = erroresLista;
    }
  }

  return errores;
};

/**
 * Valida los datos completos de un producto
 * @param {Object} producto - Datos del producto
 * @returns {Object} Objeto con errores encontrados
 */
export const validarProducto = (producto) => {
  const erroresBasicos = validarProductoBasico(producto);
  const erroresFinancieros = validarProductoFinanciero(producto);

  return {
    ...erroresBasicos,
    ...erroresFinancieros,
  };
};

/**
 * Verifica si hay errores de validación
 * @param {Object} errores - Objeto de errores
 * @returns {boolean} True si hay errores
 */
export const tieneErrores = (errores) => {
  if (!errores || typeof errores !== 'object') return false;
  return Object.keys(errores).some((key) => {
    const valor = errores[key];
    if (Array.isArray(valor)) {
      return valor.some((v) => v !== null && v !== undefined);
    }
    return valor !== null && valor !== undefined && valor !== '';
  });
};

/**
 * Formatea los errores para mostrar en UI
 * @param {Object} errores - Objeto de errores
 * @returns {Array} Array de mensajes de error
 */
export const formatearErrores = (errores) => {
  const mensajes = [];

  if (!errores || typeof errores !== 'object') return mensajes;

  Object.entries(errores).forEach(([key, valor]) => {
    if (Array.isArray(valor)) {
      valor.forEach((v, idx) => {
        if (typeof v === 'object' && v !== null) {
          Object.entries(v).forEach(([subKey, subValor]) => {
            if (subValor) {
              mensajes.push(`Lista ${idx + 1} - ${subKey}: ${subValor}`);
            }
          });
        } else if (v) {
          mensajes.push(`${key}[${idx}]: ${v}`);
        }
      });
    } else if (valor) {
      mensajes.push(valor);
    }
  });

  return mensajes;
};

/**
 * Obtiene primer error encontrado
 * @param {Object} errores - Objeto de errores
 * @returns {string|null} Primer error encontrado
 */
export const obtenerPrimerError = (errores) => {
  if (!errores || typeof errores !== 'object') return null;

  for (const [key, valor] of Object.entries(errores)) {
    if (valor) {
      if (typeof valor === 'string') return valor;
      if (Array.isArray(valor) && valor.length > 0) {
        return typeof valor[0] === 'string' ? valor[0] : JSON.stringify(valor[0]);
      }
    }
  }

  return null;
};

/**
 * Normaliza los datos del producto antes de enviar al API
 * @param {Object} producto - Datos del producto
 * @returns {Object} Producto normalizado
 */
export const normalizarProducto = (producto) => {
  if (!producto) return {};

  // Determinar el estado activo: buscar en esActivo, activo, o Activo
  const esActivo = producto.esActivo !== undefined 
    ? Boolean(producto.esActivo) 
    : (producto.activo !== undefined ? Boolean(producto.activo) : true);

  return {
    IdProducto: producto.idProducto || 0, // PascalCase para coincidir con el DTO del backend
    NoEmpresa: Number(producto.noEmpresa) || 1,
    Codigo: String(producto.codigo || '').trim(),
    Nombre: String(producto.nombre || '').trim(),
    Descripcion: String(producto.descripcion || '').trim(),
    CodigoBarra: String(producto.codigoBarras || '').trim(),
    CodigoAuxiliar: String(producto.codigoAuxiliar || '').trim(),
    CodigoCabys: String(producto.codigoCabys || '').trim(),
    CodigoProveedor: String(producto.codigoProveedor || '').trim(),
    TipoArticulo: producto.tipoArticulo || 'Material',
    NoGrupo: Number(producto.noGrupo) || 0,
    NoMarca: producto.noMarca ? Number(producto.noMarca) : null,
    TipoProducto: String(producto.tipoProducto || 'AR').trim(),
    NoTipo: Number(producto.noTipo) || 1,
    TipoImpuesto: producto.tipoImpuesto || 'IVA',
    PorcentajeImpuesto: Number(producto.porcentajeImpuesto) || 0,
    UnidadMedida: String(producto.unidadMedida || '').trim(),
    Existencia: Number(producto.existencia) || 0,
    Minimo: Number(producto.minimo) || 0,
    Perecedero: Boolean(producto.esPerecedero),
    Activo: esActivo, // Propiedad esperada por el backend (PascalCase, singular)
    CostoPromedio: producto.costoPromedio ? Number(producto.costoPromedio) : 0,
    UltimoCosto: producto.ultimoCosto ? Number(producto.ultimoCosto) : 0,
    UltimoPrecioCosto: producto.ultimoPrecioCosto ? Number(producto.ultimoPrecioCosto) : 0,
    Usuario: String(producto.usuario || '').trim(),
    Identificador: Number(producto.identificador) || 1,
    TipoLente: producto.tipoLente ? String(producto.tipoLente).trim() : null,
    CaracteristicasAdicionales: String(producto.caracteristicas || '').trim(),
    Foto: producto.foto || null,
  };
};

export const ERRORES_VALIDACION = ERRORES;
