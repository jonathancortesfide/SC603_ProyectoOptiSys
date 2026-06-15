using Dapper;
using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;
using Softlithe.ERP.DA.Modelos;
using System.Data;

namespace Softlithe.ERP.DA.Productos
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly ContextoBasedeDatos _contexto;

        public ProductoRepository(ContextoBasedeDatos contexto)
        {
            _contexto = contexto;
        }

        public async Task<List<ProductoDto>> ObtenerProductosARAsync(int noEmpresa, string descripcion)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@no_empresa", noEmpresa);
                parametros.Add("@filtro", descripcion);

                var filas = await conexion.QueryAsync(
                    "sp_ObtenerProductosAR",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                var productos = new List<ProductoDto>();

                foreach (var fila in filas)
                {
                    var dict = (IDictionary<string, object?>)fila;

                    int? GetInt(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                        {
                            if (val is int i) return i;
                            if (int.TryParse(val.ToString(), out var r)) return r;
                        }
                        return null;
                    }

                    decimal? GetDecimal(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                        {
                            if (val is decimal d) return d;
                            if (val is double dd) return (decimal)dd;
                            if (val is float f) return (decimal)f;
                            if (decimal.TryParse(val.ToString(), out var r)) return r;
                        }
                        return null;
                    }

                    bool? GetBool(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                        {
                            if (val is bool b) return b;
                            if (val is byte bt) return bt != 0;
                            if (val is int i) return i != 0;
                            if (bool.TryParse(val.ToString(), out var r)) return r;
                        }
                        return null;
                    }

                    string? GetString(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                            return val.ToString();
                        return null;
                    }

                    var producto = new ProductoDto
                    {
                        IdProducto = GetInt("id_producto") ?? 0,
                        NoEmpresa = GetInt("no_empresa") ?? noEmpresa,
                        Codigo = GetString("codigo") ?? string.Empty,
                        CodigoBarra = GetString("codigo_barra"),
                        CodigoProveedor = GetString("codigo_proveedor"),
                        descripcion = GetString("descripcion") ?? string.Empty,
                        NoGrupo = GetInt("no_grupo") ?? 0,
                        Activo = GetBool("activo"),
                        NoUnidadMedida = GetInt("no_unidad_medida"),
                        CostoPromedio = GetDecimal("costo_promedio"),
                        UltimoCosto = GetDecimal("ultimo_costo"),
                        UltimoPrecioCosto = GetDecimal("ultimo_precio_costo"),
                        TipoProducto = GetString("tipo_producto"),
                        NoTipo = GetInt("no_tipo"),
                        NoMarca = GetInt("no_marca"),
                        CodigoMaterial = GetString("codigo_material"),
                        CodigoImpuesto = GetString("codigo_impuesto"),
                        NoTarifa = GetString("no_tarifa"),
                        CodigoCabys = GetString("codigo_cabys")
                    };

                    producto.Identificador = 0;
                    producto.Usuario = string.Empty;

                    productos.Add(producto);
                }

                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener productos AR", ex);
            }
        }

        public async Task<List<ProductoDto>> ObtenerProductosMTAsync(int noEmpresa, int noTipo)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@no_empresa", noEmpresa);
                parametros.Add("@no_tipo", noTipo);

                var filas = await conexion.QueryAsync(
                    "sp_ObtenerProductosMT",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                var productos = new List<ProductoDto>();


                foreach (var fila in filas)
                {
                    // Dapper devuelve un objeto dinámico; tratarlo como diccionario para mapeo explícito
                    var dict = (IDictionary<string, object?>)fila;

                    int? GetInt(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                        {
                            if (val is int i) return i;
                            if (int.TryParse(val.ToString(), out var r)) return r;
                        }
                        return null;
                    }

                    decimal? GetDecimal(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                        {
                            if (val is decimal d) return d;
                            if (val is double dd) return (decimal)dd;
                            if (val is float f) return (decimal)f;
                            if (decimal.TryParse(val.ToString(), out var r)) return r;
                        }
                        return null;
                    }

                    bool? GetBool(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                        {
                            if (val is bool b) return b;
                            if (val is byte bt) return bt != 0;
                            if (val is int i) return i != 0;
                            if (bool.TryParse(val.ToString(), out var r)) return r;
                        }
                        return null;
                    }

                    string? GetString(string key)
                    {
                        if (dict.TryGetValue(key, out var val) && val != null)
                            return val.ToString();
                        return null;
                    }

                    var producto = new ProductoDto
                    {
                        IdProducto = GetInt("id_producto") ?? 0,
                        NoEmpresa = GetInt("no_empresa") ?? noEmpresa,
                        Codigo = GetString("codigo") ?? string.Empty,
                        CodigoBarra = GetString("codigo_barra"),
                        CodigoProveedor = GetString("codigo_proveedor"),
                        descripcion = GetString("descripcion") ?? string.Empty,
                        NoGrupo = GetInt("no_grupo") ?? 0,
                        Activo = GetBool("activo"),
                        NoUnidadMedida = GetInt("no_unidad_medida"),
                        CostoPromedio = GetDecimal("costo_promedio"),
                        UltimoCosto = GetDecimal("ultimo_costo"),
                        UltimoPrecioCosto = GetDecimal("ultimo_precio_costo"),
                        TipoProducto = GetString("tipo_producto"),
                        NoTipo = GetInt("no_tipo"),
                        NoMarca = GetInt("no_marca"),
                        CodigoMaterial = GetString("codigo_material"),
                        CodigoImpuesto = GetString("codigo_impuesto"),
                        NoTarifa = GetString("no_tarifa"),
                        CodigoCabys = GetString("codigo_cabys")
                    };

                    // Campos obligatorios de DTO que no devuelve el SP: Identificador y Usuario
                    producto.Identificador = 0;
                    producto.Usuario = string.Empty;

                    productos.Add(producto);
                }

                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener productos MT", ex);
            }
        }

        private async Task<IDbConnection> ObtenerConexionAsync()
        {
            var conexion = _contexto.Database.GetDbConnection();

            if (conexion.State == ConnectionState.Closed)
                await conexion.OpenAsync();

            return conexion;
        }

        public async Task<List<ProductoDto>> ObtenerProductosAsync(int noEmpresa, string? textoBusqueda)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@NoEmpresa", noEmpresa);
                parametros.Add("@TextoBusqueda", string.IsNullOrWhiteSpace(textoBusqueda) ? null : textoBusqueda);

                List<ProductoDto> productos = (await conexion.QueryAsync<ProductoDto>(
                    "sp_Producto_Obtener",
                    parametros,
                    commandType: CommandType.StoredProcedure)).ToList();

                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener productos", ex);
            }
        }

        public async Task<ProductoDetalleDto?> ObtenerProductoPorIdAsync(int idProducto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@IdProducto", idProducto);

                var producto = await conexion.QueryFirstOrDefaultAsync<ProductoDetalleDto>(
                    "sp_Producto_ObtenerPorId",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return producto;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el producto", ex);
            }
        }

        public async Task<int> InsertarProductoAsync(ProductoDto productoDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@Codigo", productoDto.Codigo);
                parametros.Add("@NoEmpresa", productoDto.NoEmpresa);
                parametros.Add("@CodigoBarra", string.IsNullOrWhiteSpace(productoDto.CodigoBarra) ? null : productoDto.CodigoBarra);
                parametros.Add("@CodigoProveedor", string.IsNullOrWhiteSpace(productoDto.CodigoProveedor) ? null : productoDto.CodigoProveedor);
                parametros.Add("@Descripcion", productoDto.descripcion);
                parametros.Add("@NoGrupo", productoDto.NoGrupo);
                parametros.Add("@Activo", productoDto.Activo);
                parametros.Add("@NoUnidadMedida", productoDto.NoUnidadMedida);
                parametros.Add("@CostoPromedio", productoDto.CostoPromedio);
                parametros.Add("@UltimoCosto", productoDto.UltimoCosto);
                parametros.Add("@UltimoPrecioCosto", productoDto.UltimoPrecioCosto);
                parametros.Add("@TipoProducto", string.IsNullOrWhiteSpace(productoDto.TipoProducto) ? null : productoDto.TipoProducto);
                parametros.Add("@NoTipo", productoDto.NoTipo);
                parametros.Add("@NoMarca", productoDto.NoMarca);
                parametros.Add("@CodigoMaterial", string.IsNullOrWhiteSpace(productoDto.CodigoMaterial) ? null : productoDto.CodigoMaterial);
                parametros.Add("@CodigoImpuesto", string.IsNullOrWhiteSpace(productoDto.CodigoImpuesto) ? null : productoDto.CodigoImpuesto);
                parametros.Add("@NoTarifa", string.IsNullOrWhiteSpace(productoDto.NoTarifa) ? null : productoDto.NoTarifa);
                parametros.Add("@CodigoCabys", string.IsNullOrWhiteSpace(productoDto.CodigoCabys) ? null : productoDto.CodigoCabys);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Producto_Insertar",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al insertar producto", ex);
            }
        }

        public async Task<int> ActualizarProductoAsync(ProductoDto productoDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@IdProducto", productoDto.IdProducto);
                parametros.Add("@Codigo", productoDto.Codigo);
                parametros.Add("@CodigoBarra", string.IsNullOrWhiteSpace(productoDto.CodigoBarra) ? null : productoDto.CodigoBarra);
                parametros.Add("@CodigoProveedor", string.IsNullOrWhiteSpace(productoDto.CodigoProveedor) ? null : productoDto.CodigoProveedor);
                parametros.Add("@Descripcion", productoDto.descripcion);
                parametros.Add("@NoGrupo", productoDto.NoGrupo);
                parametros.Add("@Activo", productoDto.Activo);
                parametros.Add("@NoUnidadMedida", productoDto.NoUnidadMedida);
                parametros.Add("@CostoPromedio", productoDto.CostoPromedio);
                parametros.Add("@UltimoCosto", productoDto.UltimoCosto);
                parametros.Add("@UltimoPrecioCosto", productoDto.UltimoPrecioCosto);
                parametros.Add("@TipoProducto", string.IsNullOrWhiteSpace(productoDto.TipoProducto) ? null : productoDto.TipoProducto);
                parametros.Add("@NoTipo", productoDto.NoTipo);
                parametros.Add("@NoMarca", productoDto.NoMarca);
                parametros.Add("@CodigoMaterial", string.IsNullOrWhiteSpace(productoDto.CodigoMaterial) ? null : productoDto.CodigoMaterial);
                parametros.Add("@CodigoImpuesto", string.IsNullOrWhiteSpace(productoDto.CodigoImpuesto) ? null : productoDto.CodigoImpuesto);
                parametros.Add("@NoTarifa", string.IsNullOrWhiteSpace(productoDto.NoTarifa) ? null : productoDto.NoTarifa);
                parametros.Add("@CodigoCabys", string.IsNullOrWhiteSpace(productoDto.CodigoCabys) ? null : productoDto.CodigoCabys);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Producto_Actualizar",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar producto", ex);
            }
        }

        public async Task<int> ModificaEstadoProductoAsync(ProductoInActivaDto productoInActivaDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@IdProducto", productoInActivaDto.IdProducto);
                parametros.Add("@EsActivo", productoInActivaDto.EsActivo);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Producto_ModificaEstado",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar estado del producto", ex);
            }
        }
    }
}
