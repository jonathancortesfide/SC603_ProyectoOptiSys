using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Productos
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly ContextoBasedeDatos _contexto;

        public ProductoRepository(ContextoBasedeDatos contexto)
        {
            _contexto = contexto;
        }

        /// <summary>
        /// Obtiene lista de productos filtrados por empresa y búsqueda
        /// </summary>
        public async Task<List<ProductoDto>> ObtenerProductosAsync(int noEmpresa, string? textoBusqueda)
        {
            try
            {
                IQueryable<Producto> query = _contexto.Productos
                    .Where(p => p.NoEmpresa == noEmpresa);

                // Aplicar filtro de búsqueda si se proporciona
                if (!string.IsNullOrWhiteSpace(textoBusqueda))
                {
                    var busqueda = textoBusqueda.ToLower().Trim();
                    query = query.Where(p =>
                        p.Codigo.ToLower().Contains(busqueda) ||
                        p.Descripcion.ToLower().Contains(busqueda) ||
                        (p.CodigoBarra != null && p.CodigoBarra.ToLower().Contains(busqueda)) ||
                        (p.CodigoProveedor != null && p.CodigoProveedor.ToLower().Contains(busqueda))
                    );
                }

                // Traer entidades completas, luego convertir a DTOs en memoria
                var productosEntidades = await query
                    .Include(p => p.ProductoDetalle)
                    .ToListAsync();

                // Convertir a DTOs en memoria para evitar casting exception
                var productos = productosEntidades.Select(p => new ProductoDto
                {
                    IdProducto = p.IdProducto,
                    NoEmpresa = p.NoEmpresa,
                    Codigo = p.Codigo,
                    CodigoBarra = p.CodigoBarra,
                    CodigoProveedor = p.CodigoProveedor,
                    Descripcion = p.Descripcion,
                    NoGrupo = p.NoGrupo,
                    Activo = p.Activo,
                    NoUnidadMedida = p.NoUnidadMedida,
                    CostoPromedio = p.CostoPromedio,
                    UltimoCosto = p.UltimoCosto,
                    UltimoPrecioCosto = p.UltimoPrecioCosto,
                    TipoProducto = p.TipoProducto,
                    NoTipo = p.NoTipo,
                    NoMarca = p.NoMarca,
                    CodigoMaterial = p.CodigoMaterial,
                    CodigoImpuesto = p.CodigoImpuesto,
                    NoTarifa = p.NoTarifa,
                    CodigoCabys = p.CodigoCabys,
                    PrecioSinImpuesto = null,
                    PrecioConImpuesto = null,
                    // Campos de ProductoDetalle
                    Existencia = p.ProductoDetalle != null ? p.ProductoDetalle.Existencia : 0,
                    Minimo = p.ProductoDetalle != null ? p.ProductoDetalle.Minimo : null,
                    Perecedero = p.ProductoDetalle != null ? p.ProductoDetalle.Perecedero : null,
                    CaracteristicasAdicionales = p.ProductoDetalle != null ? p.ProductoDetalle.CaracteristicasAdicionales : null,
                    Foto = p.ProductoDetalle != null ? p.ProductoDetalle.Foto : null,
                    Identificador = 0,
                    Usuario = string.Empty
                }).ToList();

                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener productos", ex);
            }
        }

        /// <summary>
        /// Obtiene un producto específico por ID con todos sus detalles
        /// </summary>
        public async Task<ProductoDetalleDto?> ObtenerProductoPorIdAsync(int idProducto)
        {
            try
            {
                var productoEntidad = await _contexto.Productos
                    .Where(p => p.IdProducto == idProducto)
                    .Include(p => p.ProductoDetalle)
                    .FirstOrDefaultAsync();

                if (productoEntidad == null)
                    return null;

                var producto = new ProductoDetalleDto
                {
                    IdProducto = productoEntidad.IdProducto,
                    NoEmpresa = productoEntidad.NoEmpresa,
                    Codigo = productoEntidad.Codigo,
                    CodigoBarra = productoEntidad.CodigoBarra,
                    CodigoProveedor = productoEntidad.CodigoProveedor,
                    Descripcion = productoEntidad.Descripcion,
                    NoGrupo = productoEntidad.NoGrupo,
                    Activo = productoEntidad.Activo,
                    NoUnidadMedida = productoEntidad.NoUnidadMedida,
                    CostoPromedio = productoEntidad.CostoPromedio,
                    UltimoCosto = productoEntidad.UltimoCosto,
                    UltimoPrecioCosto = productoEntidad.UltimoPrecioCosto,
                    TipoProducto = productoEntidad.TipoProducto,
                    NoTipo = productoEntidad.NoTipo,
                    NoMarca = productoEntidad.NoMarca,
                    CodigoMaterial = productoEntidad.CodigoMaterial,
                    CodigoImpuesto = productoEntidad.CodigoImpuesto,
                    NoTarifa = productoEntidad.NoTarifa,
                    CodigoCabys = productoEntidad.CodigoCabys,
                    PrecioSinImpuesto = null,
                    PrecioConImpuesto = null,
                    // Campos de ProductoDetalle
                    Existencia = productoEntidad.ProductoDetalle != null ? productoEntidad.ProductoDetalle.Existencia : 0,
                    Minimo = productoEntidad.ProductoDetalle != null ? productoEntidad.ProductoDetalle.Minimo : null,
                    Perecedero = productoEntidad.ProductoDetalle != null ? productoEntidad.ProductoDetalle.Perecedero : null,
                    CaracteristicasAdicionales = productoEntidad.ProductoDetalle != null ? productoEntidad.ProductoDetalle.CaracteristicasAdicionales : null,
                    Foto = productoEntidad.ProductoDetalle != null ? productoEntidad.ProductoDetalle.Foto : null,
                    Identificador = 0,
                    Usuario = string.Empty
                };

                return producto;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el producto", ex);
            }
        }

        /// <summary>
        /// Obtiene productos filtrados por tipo
        /// </summary>
        public async Task<List<ProductoDto>> ObtenerProductosMTAsync(int noEmpresa, int noTipo)
        {
            try
            {
                var productosEntidades = await _contexto.Productos
                    .Where(p => p.NoEmpresa == noEmpresa && p.NoTipo == noTipo)
                    .Include(p => p.ProductoDetalle)
                    .ToListAsync();

                var productos = productosEntidades.Select(p => new ProductoDto
                {
                    IdProducto = p.IdProducto,
                    NoEmpresa = p.NoEmpresa,
                    Codigo = p.Codigo,
                    CodigoBarra = p.CodigoBarra,
                    CodigoProveedor = p.CodigoProveedor,
                    Descripcion = p.Descripcion,
                    NoGrupo = p.NoGrupo,
                    Activo = p.Activo,
                    NoUnidadMedida = p.NoUnidadMedida,
                    CostoPromedio = p.CostoPromedio,
                    UltimoCosto = p.UltimoCosto,
                    UltimoPrecioCosto = p.UltimoPrecioCosto,
                    TipoProducto = p.TipoProducto,
                    NoTipo = p.NoTipo,
                    NoMarca = p.NoMarca,
                    CodigoMaterial = p.CodigoMaterial,
                    CodigoImpuesto = p.CodigoImpuesto,
                    NoTarifa = p.NoTarifa,
                    CodigoCabys = p.CodigoCabys,
                    PrecioSinImpuesto = null,
                    PrecioConImpuesto = null,
                    // Campos de ProductoDetalle
                    Existencia = p.ProductoDetalle != null ? p.ProductoDetalle.Existencia : 0,
                    Minimo = p.ProductoDetalle != null ? p.ProductoDetalle.Minimo : null,
                    Perecedero = p.ProductoDetalle != null ? p.ProductoDetalle.Perecedero : null,
                    CaracteristicasAdicionales = p.ProductoDetalle != null ? p.ProductoDetalle.CaracteristicasAdicionales : null,
                    Foto = p.ProductoDetalle != null ? p.ProductoDetalle.Foto : null,
                    Identificador = 0,
                    Usuario = string.Empty
                }).ToList();

                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener productos por tipo", ex);
            }
        }

        /// <summary>
        /// Obtiene productos filtrados por descripción
        /// </summary>
        public async Task<List<ProductoDto>> ObtenerProductosARAsync(int noEmpresa, string descripcion)
        {
            try
            {
                var busqueda = descripcion.ToLower().Trim();
                var productosEntidades = await _contexto.Productos
                    .Where(p => p.NoEmpresa == noEmpresa && 
                                p.Descripcion.ToLower().Contains(busqueda))
                    .Include(p => p.ProductoDetalle)
                    .ToListAsync();

                var productos = productosEntidades.Select(p => new ProductoDto
                {
                    IdProducto = p.IdProducto,
                    NoEmpresa = p.NoEmpresa,
                    Codigo = p.Codigo,
                    CodigoBarra = p.CodigoBarra,
                    CodigoProveedor = p.CodigoProveedor,
                    Descripcion = p.Descripcion,
                    NoGrupo = p.NoGrupo,
                    Activo = p.Activo,
                    NoUnidadMedida = p.NoUnidadMedida,
                    CostoPromedio = p.CostoPromedio,
                    UltimoCosto = p.UltimoCosto,
                    UltimoPrecioCosto = p.UltimoPrecioCosto,
                    TipoProducto = p.TipoProducto,
                    NoTipo = p.NoTipo,
                    NoMarca = p.NoMarca,
                    CodigoMaterial = p.CodigoMaterial,
                    CodigoImpuesto = p.CodigoImpuesto,
                    NoTarifa = p.NoTarifa,
                    CodigoCabys = p.CodigoCabys,
                    PrecioSinImpuesto = null,
                    PrecioConImpuesto = null,
                    // Campos de ProductoDetalle
                    Existencia = p.ProductoDetalle != null ? p.ProductoDetalle.Existencia : 0,
                    Minimo = p.ProductoDetalle != null ? p.ProductoDetalle.Minimo : null,
                    Perecedero = p.ProductoDetalle != null ? p.ProductoDetalle.Perecedero : null,
                    CaracteristicasAdicionales = p.ProductoDetalle != null ? p.ProductoDetalle.CaracteristicasAdicionales : null,
                    Foto = p.ProductoDetalle != null ? p.ProductoDetalle.Foto : null,
                    Identificador = 0,
                    Usuario = string.Empty
                }).ToList();

                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener productos por descripción", ex);
            }
        }

        /// <summary>
        /// Inserta un nuevo producto con su detalle
        /// </summary>
        public async Task<int> InsertarProductoAsync(ProductoDto productoDto)
        {
            using (var transaction = _contexto.Database.BeginTransaction())
            {
                try
                {
                    // Crear nuevo Producto
                    var producto = new Producto
                    {
                        NoEmpresa = productoDto.NoEmpresa,
                        Codigo = productoDto.Codigo.Trim(),
                        CodigoBarra = productoDto.CodigoBarra?.Trim(),
                        CodigoProveedor = productoDto.CodigoProveedor?.Trim(),
                        Descripcion = productoDto.Descripcion.Trim(),
                        NoGrupo = productoDto.NoGrupo,
                        Activo = productoDto.Activo ?? true,
                        NoUnidadMedida = productoDto.NoUnidadMedida,
                        CostoPromedio = productoDto.CostoPromedio,
                        UltimoCosto = productoDto.UltimoCosto,
                        UltimoPrecioCosto = productoDto.UltimoPrecioCosto,
                        TipoProducto = productoDto.TipoProducto?.Trim(),
                        NoTipo = productoDto.NoTipo,
                        NoMarca = productoDto.NoMarca,
                        CodigoMaterial = productoDto.CodigoMaterial?.Trim(),
                        CodigoImpuesto = productoDto.CodigoImpuesto?.Trim(),
                        NoTarifa = productoDto.NoTarifa?.Trim(),
                        CodigoCabys = productoDto.CodigoCabys?.Trim()
                    };

                    _contexto.Productos.Add(producto);
                    await _contexto.SaveChangesAsync();

                    // Crear ProductoDetalle asociado
                    var productoDetalle = new ProductoDetalle
                    {
                        IdProducto = producto.IdProducto,
                        Existencia = productoDto.Existencia ?? 0,
                        Minimo = productoDto.Minimo,
                        Perecedero = productoDto.Perecedero,
                        CaracteristicasAdicionales = productoDto.CaracteristicasAdicionales?.Trim(),
                        Foto = productoDto.Foto
                    };

                    _contexto.ProductosDetalle.Add(productoDetalle);
                    await _contexto.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return producto.IdProducto;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception("Error al insertar producto", ex);
                }
            }
        }

        /// <summary>
        /// Actualiza un producto existente
        /// </summary>
        public async Task<int> ActualizarProductoAsync(ProductoDto productoDto)
        {
            using (var transaction = _contexto.Database.BeginTransaction())
            {
                try
                {
                    // Obtener producto existente
                    var producto = await _contexto.Productos
                        .Include(p => p.ProductoDetalle)
                        .FirstOrDefaultAsync(p => p.IdProducto == productoDto.IdProducto);

                    if (producto == null)
                        throw new Exception("Producto no encontrado");

                    // Actualizar datos de Producto
                    producto.Codigo = productoDto.Codigo.Trim();
                    producto.CodigoBarra = productoDto.CodigoBarra?.Trim();
                    producto.CodigoProveedor = productoDto.CodigoProveedor?.Trim();
                    producto.Descripcion = productoDto.Descripcion.Trim();
                    producto.NoGrupo = productoDto.NoGrupo;
                    producto.Activo = productoDto.Activo ?? true;
                    producto.NoUnidadMedida = productoDto.NoUnidadMedida;
                    producto.CostoPromedio = productoDto.CostoPromedio;
                    producto.UltimoCosto = productoDto.UltimoCosto;
                    producto.UltimoPrecioCosto = productoDto.UltimoPrecioCosto;
                    producto.TipoProducto = productoDto.TipoProducto?.Trim();
                    producto.NoTipo = productoDto.NoTipo;
                    producto.NoMarca = productoDto.NoMarca;
                    producto.CodigoMaterial = productoDto.CodigoMaterial?.Trim();
                    producto.CodigoImpuesto = productoDto.CodigoImpuesto?.Trim();
                    producto.NoTarifa = productoDto.NoTarifa?.Trim();
                    producto.CodigoCabys = productoDto.CodigoCabys?.Trim();

                    _contexto.Productos.Update(producto);
                    await _contexto.SaveChangesAsync();

                    // Actualizar o crear ProductoDetalle
                    if (producto.ProductoDetalle == null)
                    {
                        producto.ProductoDetalle = new ProductoDetalle
                        {
                            IdProducto = producto.IdProducto
                        };
                        _contexto.ProductosDetalle.Add(producto.ProductoDetalle);
                    }

                    producto.ProductoDetalle.Existencia = productoDto.Existencia ?? 0;
                    producto.ProductoDetalle.Minimo = productoDto.Minimo;
                    producto.ProductoDetalle.Perecedero = productoDto.Perecedero;
                    producto.ProductoDetalle.CaracteristicasAdicionales = productoDto.CaracteristicasAdicionales?.Trim();
                    if (productoDto.Foto != null)
                    {
                        producto.ProductoDetalle.Foto = productoDto.Foto;
                    }

                    _contexto.ProductosDetalle.Update(producto.ProductoDetalle);
                    await _contexto.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return 1;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception("Error al actualizar producto", ex);
                }
            }
        }

        /// <summary>
        /// Cambia el estado (activo/inactivo) de un producto
        /// </summary>
        public async Task<int> ModificaEstadoProductoAsync(ProductoInActivaDto productoInActivaDto)
        {
            try
            {
                var producto = await _contexto.Productos
                    .FirstOrDefaultAsync(p => p.IdProducto == productoInActivaDto.IdProducto);

                if (producto == null)
                    throw new Exception("Producto no encontrado");

                producto.Activo = productoInActivaDto.EsActivo;

                _contexto.Productos.Update(producto);
                await _contexto.SaveChangesAsync();

                return 1;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al cambiar estado del producto", ex);
            }
        }

        /// <summary>
        /// Elimina un producto y su detalle
        /// </summary>
        public async Task<int> EliminarProductoAsync(int idProducto)
        {
            using (var transaction = _contexto.Database.BeginTransaction())
            {
                try
                {
                    // Eliminar ProductoDetalle primero (por FK)
                    var productoDetalle = await _contexto.ProductosDetalle
                        .FirstOrDefaultAsync(pd => pd.IdProducto == idProducto);

                    if (productoDetalle != null)
                    {
                        _contexto.ProductosDetalle.Remove(productoDetalle);
                        await _contexto.SaveChangesAsync();
                    }

                    // Eliminar Producto
                    var producto = await _contexto.Productos
                        .FirstOrDefaultAsync(p => p.IdProducto == idProducto);

                    if (producto == null)
                        throw new Exception("Producto no encontrado");

                    _contexto.Productos.Remove(producto);
                    await _contexto.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return 1;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception("Error al eliminar producto", ex);
                }
            }
        }
    }
}
