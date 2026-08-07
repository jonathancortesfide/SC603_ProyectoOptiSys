import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  obtenerListaDeProductos,
  obtenerProductoPorId,
  agregarProducto,
  modificarProducto,
  cambiarEstadoProducto,
  obtenerProductosMT,
  obtenerProductosAR,
  eliminarProducto,
} from '../../requests/mantenimientos/producto/RequestsProductos';

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchProductos = createAsyncThunk(
  'productos/fetchProductos',
  async ({ noEmpresa, textoBusqueda = '' }, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux fetchProductos:', { noEmpresa, textoBusqueda });
      const data = await obtenerListaDeProductos(noEmpresa, textoBusqueda);
      console.log('✅ Redux fetchProductos exitoso:', data?.length, 'registros');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || 
                          error.response?.data?.Mensaje ||
                          error.message || 
                          'Error al obtener productos';
      console.error('❌ Redux fetchProductos error:', mensajeError);
      return rejectWithValue(mensajeError);
    }
  }
);

export const fetchProductoPorId = createAsyncThunk(
  'productos/fetchProductoPorId',
  async (idProducto, { rejectWithValue }) => {
    try {
      const data = await obtenerProductoPorId(idProducto);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener producto');
    }
  }
);

export const createProducto = createAsyncThunk(
  'productos/createProducto',
  async (producto, { rejectWithValue }) => {
    try {
      const response = await agregarProducto(producto);
      if (response && response.esCorrecto !== false) {
        return { ...producto };
      } else {
        return rejectWithValue(response?.mensaje || 'Error al crear producto');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al crear producto');
    }
  }
);

export const updateProducto = createAsyncThunk(
  'productos/updateProducto',
  async (producto, { rejectWithValue }) => {
    try {
      const response = await modificarProducto(producto);
      if (response && response.esCorrecto !== false) {
        return producto;
      } else {
        return rejectWithValue(response?.mensaje || 'Error al modificar producto');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al modificar producto');
    }
  }
);

export const changeEstadoProducto = createAsyncThunk(
  'productos/changeEstadoProducto',
  async ({ idProducto, esActivo, usuario, identificador }, { rejectWithValue }) => {
    try {
      const response = await cambiarEstadoProducto(idProducto, esActivo, usuario, identificador);
      if (response && response.esCorrecto !== false) {
        return { idProducto, esActivo };
      } else {
        return rejectWithValue(response?.mensaje || 'Error al cambiar estado');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cambiar estado');
    }
  }
);

export const fetchProductosMT = createAsyncThunk(
  'productos/fetchProductosMT',
  async ({ noEmpresa, noTipo }, { rejectWithValue }) => {
    try {
      const data = await obtenerProductosMT(noEmpresa, noTipo);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener productos');
    }
  }
);

export const fetchProductosAR = createAsyncThunk(
  'productos/fetchProductosAR',
  async ({ noEmpresa, descripcion }, { rejectWithValue }) => {
    try {
      const data = await obtenerProductosAR(noEmpresa, descripcion);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener productos');
    }
  }
);

export const deleteProducto = createAsyncThunk(
  'productos/deleteProducto',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🗑️ Iniciando eliminación de producto ID:', id);
      const response = await eliminarProducto(id);
      console.log('📨 Respuesta del servidor:', response);
      
      // Verificar si la eliminación fue exitosa
      // EsCorrecto viene en PascalCase desde el backend .NET
      const esExitoso = response?.EsCorrecto === true || response?.esCorrecto === true;
      
      if (esExitoso) {
        console.log('✅ Producto eliminado correctamente');
        return id;
      } else {
        const mensajeError = response?.Mensaje || response?.mensaje || 'Error al eliminar producto';
        console.error('❌ Error en eliminación:', mensajeError);
        return rejectWithValue(mensajeError);
      }
    } catch (error) {
      console.error('❌ Excepción al eliminar:', error);
      return rejectWithValue(error.message || 'Error al eliminar producto');
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  // Listados
  productos: [],
  productoActual: null,
  productosPorTipo: [],
  productosPorDescripcion: [],

  // Carga y estado
  loading: false,
  loadingProductoActual: false,
  error: null,
  successMessage: null,

  // Filtros y búsqueda
  filtros: {
    noEmpresa: 1,
    textoBusqueda: '',
    pagina: 0,
    itemsPorPagina: 10,
  },

  // Paginación
  paginaActual: 0,
  itemsPorPagina: 10,
  totalItems: 0,
};

// ============================================
// SLICE
// ============================================

const productoSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    setFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    setPaginaActual: (state, action) => {
      state.paginaActual = action.payload;
    },
    setItemsPorPagina: (state, action) => {
      state.itemsPorPagina = action.payload;
    },
    limpiarProductoActual: (state) => {
      state.productoActual = null;
    },
    setProductos: (state, action) => {
      state.productos = action.payload;
      state.totalItems = action.payload.length;
    },
  },

  // ============================================
  // EXTRA REDUCERS
  // ============================================

  extraReducers: (builder) => {
    // Fetch Productos
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
        state.totalItems = action.payload.length;
        state.error = null;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Producto por ID
    builder
      .addCase(fetchProductoPorId.pending, (state) => {
        state.loadingProductoActual = true;
        state.error = null;
      })
      .addCase(fetchProductoPorId.fulfilled, (state, action) => {
        state.loadingProductoActual = false;
        state.productoActual = action.payload;
        state.error = null;
      })
      .addCase(fetchProductoPorId.rejected, (state, action) => {
        state.loadingProductoActual = false;
        state.error = action.payload;
      });

    // Create Producto
    builder
      .addCase(createProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProducto.fulfilled, (state, action) => {
        state.loading = false;
        state.productos.push(action.payload);
        state.successMessage = 'Producto creado correctamente';
        state.error = null;
      })
      .addCase(createProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Producto
    builder
      .addCase(updateProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProducto.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.productos.findIndex((p) => p.id === action.payload.id || p.idProducto === action.payload.idProducto);
        if (index !== -1) {
          state.productos[index] = action.payload;
        }
        state.successMessage = 'Producto modificado correctamente';
        state.error = null;
      })
      .addCase(updateProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Change Estado Producto
    builder
      .addCase(changeEstadoProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeEstadoProducto.fulfilled, (state, action) => {
        state.loading = false;
        const producto = state.productos.find((p) => p.id === action.payload.idProducto || p.idProducto === action.payload.idProducto);
        if (producto) {
          producto.esActivo = action.payload.esActivo;
          producto.activo = action.payload.esActivo;
        }
        state.successMessage = 'Estado del producto actualizado';
        state.error = null;
      })
      .addCase(changeEstadoProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Productos MT
    builder
      .addCase(fetchProductosMT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductosMT.fulfilled, (state, action) => {
        state.loading = false;
        state.productosPorTipo = action.payload;
        state.error = null;
      })
      .addCase(fetchProductosMT.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Productos AR
    builder
      .addCase(fetchProductosAR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductosAR.fulfilled, (state, action) => {
        state.loading = false;
        state.productosPorDescripcion = action.payload;
        state.error = null;
      })
      .addCase(fetchProductosAR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Producto
    builder
      .addCase(deleteProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProducto.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = state.productos.filter((p) => p.id !== action.payload && p.idProducto !== action.payload);
        state.totalItems = state.productos.length;
        state.successMessage = 'Producto eliminado correctamente';
        state.error = null;
      })
      .addCase(deleteProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setFiltros,
  setPaginaActual,
  setItemsPorPagina,
  limpiarProductoActual,
  setProductos,
} = productoSlice.actions;

export default productoSlice.reducer;
