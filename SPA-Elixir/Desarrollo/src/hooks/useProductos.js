import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductos,
  fetchProductoPorId,
  createProducto,
  updateProducto,
  changeEstadoProducto,
  fetchProductosMT,
  fetchProductosAR,
  deleteProducto,
  clearError,
  clearSuccess,
  setFiltros,
  setPaginaActual,
  setItemsPorPagina,
  limpiarProductoActual,
} from '../store/productos/ProductoSlice';

/**
 * Hook personalizado para gestionar productos
 * Proporciona acceso a estado y acciones para productos
 */
export const useProductos = () => {
  const dispatch = useDispatch();

  // Seleccionar estado
  const {
    productos,
    productoActual,
    productosPorTipo,
    productosPorDescripcion,
    loading,
    loadingProductoActual,
    error,
    successMessage,
    filtros,
    paginaActual,
    itemsPorPagina,
    totalItems,
  } = useSelector((state) => state.productos);

  // ============================================
  // CALLBACKS PARA FETCHS
  // ============================================

  const cargarProductos = useCallback(
    (noEmpresa = 1, textoBusqueda = '') => {
      dispatch(fetchProductos({ noEmpresa, textoBusqueda }));
    },
    [dispatch]
  );

  const cargarProductoPorId = useCallback(
    (idProducto) => {
      dispatch(fetchProductoPorId(idProducto));
    },
    [dispatch]
  );

  const cargarProductosMT = useCallback(
    (noEmpresa = 1, noTipo) => {
      dispatch(fetchProductosMT({ noEmpresa, noTipo }));
    },
    [dispatch]
  );

  const cargarProductosAR = useCallback(
    (noEmpresa = 1, descripcion) => {
      dispatch(fetchProductosAR({ noEmpresa, descripcion }));
    },
    [dispatch]
  );

  // ============================================
  // CALLBACKS PARA CREAR/ACTUALIZAR/ELIMINAR
  // ============================================

  const crearProducto = useCallback(
    (producto) => {
      return dispatch(createProducto(producto));
    },
    [dispatch]
  );

  const actualizarProducto = useCallback(
    (producto) => {
      return dispatch(updateProducto(producto));
    },
    [dispatch]
  );

  const cambiarEstado = useCallback(
    (idProducto, esActivo, usuario, identificador) => {
      return dispatch(
        changeEstadoProducto({ idProducto, esActivo, usuario, identificador })
      );
    },
    [dispatch]
  );

  const eliminar = useCallback(
    (id) => {
      return dispatch(deleteProducto(id));
    },
    [dispatch]
  );

  // ============================================
  // CALLBACKS PARA ESTADO
  // ============================================

  const limpiarError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const limpiarExito = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const actualizarFiltros = useCallback(
    (nuevosFiltros) => {
      dispatch(setFiltros(nuevosFiltros));
    },
    [dispatch]
  );

  const irAPagina = useCallback(
    (pagina) => {
      dispatch(setPaginaActual(pagina));
    },
    [dispatch]
  );

  const cambiarItemsPorPagina = useCallback(
    (items) => {
      dispatch(setItemsPorPagina(items));
      dispatch(setPaginaActual(0));
    },
    [dispatch]
  );

  const limpiarProductoSeleccionado = useCallback(() => {
    dispatch(limpiarProductoActual());
  }, [dispatch]);

  // ============================================
  // DATOS DERIVADOS
  // ============================================

  // Productos paginados
  const productosPaginados = useMemo(() => {
    const inicio = paginaActual * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return productos.slice(inicio, fin);
  }, [productos, paginaActual, itemsPorPagina]);

  // Total de páginas
  const totalPaginas = useMemo(() => {
    return Math.ceil(totalItems / itemsPorPagina);
  }, [totalItems, itemsPorPagina]);

  // Estado de carga
  const estaCargando = useMemo(() => {
    return loading || loadingProductoActual;
  }, [loading, loadingProductoActual]);

  // Estado de error
  const hayError = useMemo(() => {
    return Boolean(error);
  }, [error]);

  // Estado de éxito
  const hayExito = useMemo(() => {
    return Boolean(successMessage);
  }, [successMessage]);

  // ============================================
  // RETORNAR
  // ============================================

  return {
    // Estado
    productos,
    productoActual,
    productosPorTipo,
    productosPorDescripcion,
    loading,
    loadingProductoActual,
    error,
    successMessage,
    filtros,
    paginaActual,
    itemsPorPagina,
    totalItems,

    // Datos derivados
    productosPaginados,
    totalPaginas,
    estaCargando,
    hayError,
    hayExito,

    // Acciones - Carga
    cargarProductos,
    cargarProductoPorId,
    cargarProductosMT,
    cargarProductosAR,

    // Acciones - CRUD
    crearProducto,
    actualizarProducto,
    cambiarEstado,
    eliminar,

    // Acciones - Estado
    limpiarError,
    limpiarExito,
    actualizarFiltros,
    irAPagina,
    cambiarItemsPorPagina,
    limpiarProductoSeleccionado,
  };
};

export default useProductos;
