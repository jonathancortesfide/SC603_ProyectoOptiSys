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
                parametros.Add("@Descripcion", productoDto.Descripcion);
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
                parametros.Add("@Descripcion", productoDto.Descripcion);
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
