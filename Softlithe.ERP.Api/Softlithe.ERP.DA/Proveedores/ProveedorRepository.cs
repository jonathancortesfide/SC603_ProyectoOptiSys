using Dapper;
using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;
using Softlithe.ERP.Abstracciones.DA.Proveedores;
using Softlithe.ERP.DA.Modelos;
using System.Data;

namespace Softlithe.ERP.DA.Proveedores
{
    public class ProveedorRepository : IProveedorRepository
    {
        private readonly ContextoBasedeDatos _contexto;

        public ProveedorRepository(ContextoBasedeDatos contexto)
        {
            _contexto = contexto;
        }
        public async Task<List<ProveedorDto>> ObtenerProveedoresPorIdentificadorAsync(int identificador)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@Identificador", identificador);

                var proveedores = (await conexion.QueryAsync<ProveedorDto>(
                    "sp_ObtenerLaboratorios",
                    parametros,
                    commandType: CommandType.StoredProcedure)).ToList();

                return proveedores;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener laboratorios", ex);
            }
        }
        private async Task<IDbConnection> ObtenerConexionAsync()
        {
            var conexion = _contexto.Database.GetDbConnection();

            if (conexion.State == ConnectionState.Closed)
                await conexion.OpenAsync();

            return conexion;
        }

        public async Task<List<ProveedorDto>> ObtenerProveedoresAsync(
            int identificador,
            int? noProveedor,
            string cedula,
            string nombre,
            bool? esActivo)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@Identificador", identificador);
                parametros.Add("@NoProveedor", noProveedor);
                parametros.Add("@Cedula", string.IsNullOrWhiteSpace(cedula) ? null : cedula);
                parametros.Add("@Nombre", string.IsNullOrWhiteSpace(nombre) ? null : nombre);
                parametros.Add("@EsActivo", esActivo);
  

                List<ProveedorDto> proveedores = (await conexion.QueryAsync<ProveedorDto>(
                    "sp_Proveedor_Obtener",
                    parametros,
                    commandType: CommandType.StoredProcedure)).ToList();

                return proveedores;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener proveedores", ex);
            }
        }

        public async Task<int> InsertarProveedorAsync(ProveedorDto proveedorDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@Cedula", proveedorDto.Cedula);
                parametros.Add("@Nombre", proveedorDto.Nombre);
                parametros.Add("@Direccion", string.IsNullOrWhiteSpace(proveedorDto.Direccion) ? null : proveedorDto.Direccion);
                parametros.Add("@Notas", string.IsNullOrWhiteSpace(proveedorDto.Notas) ? null : proveedorDto.Notas);
                parametros.Add("@FechaRegistro", proveedorDto.FechaRegistro);
                parametros.Add("@Plazo", proveedorDto.Plazo);
                parametros.Add("@Email", string.IsNullOrWhiteSpace(proveedorDto.Email) ? null : proveedorDto.Email);
                parametros.Add("@NoNacionalidad", proveedorDto.NoNacionalidad);
                parametros.Add("@Activo", proveedorDto.EsActivo);
                parametros.Add("@Identificador", proveedorDto.Identificador);
                parametros.Add("@LimiteCredito", proveedorDto.LimiteCredito);
                parametros.Add("@NoMoneda", proveedorDto.NoMoneda);
                parametros.Add("@Saldo", proveedorDto.Saldo);
                parametros.Add("@Telefono1", string.IsNullOrWhiteSpace(proveedorDto.Telefono1) ? null : proveedorDto.Telefono1);
                parametros.Add("@Telefono2", string.IsNullOrWhiteSpace(proveedorDto.Telefono2) ? null : proveedorDto.Telefono2);
                parametros.Add("@EsLaboratorio", proveedorDto.EsLaboratorio);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Proveedor_Insertar",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al insertar proveedor", ex);
            }
        }

        public async Task<int> ActualizarProveedorAsync(ProveedorDto proveedorDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();

                parametros.Add("@NoProveedor", proveedorDto.NoProveedor);
                parametros.Add("@Cedula", proveedorDto.Cedula);
                parametros.Add("@Nombre", proveedorDto.Nombre);
                parametros.Add("@Direccion", string.IsNullOrWhiteSpace(proveedorDto.Direccion) ? null : proveedorDto.Direccion);
                parametros.Add("@Notas", string.IsNullOrWhiteSpace(proveedorDto.Notas) ? null : proveedorDto.Notas);
                parametros.Add("@Plazo", proveedorDto.Plazo);
                parametros.Add("@Email", string.IsNullOrWhiteSpace(proveedorDto.Email) ? null : proveedorDto.Email);
                parametros.Add("@NoNacionalidad", proveedorDto.NoNacionalidad);
                parametros.Add("@LimiteCredito", proveedorDto.LimiteCredito);
                parametros.Add("@NoMoneda", proveedorDto.NoMoneda);
                parametros.Add("@Saldo", proveedorDto.Saldo);
                parametros.Add("@Telefono1", string.IsNullOrWhiteSpace(proveedorDto.Telefono1) ? null : proveedorDto.Telefono1);
                parametros.Add("@Telefono2", string.IsNullOrWhiteSpace(proveedorDto.Telefono2) ? null : proveedorDto.Telefono2);
                parametros.Add("@EsLaboratorio", proveedorDto.EsLaboratorio);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Proveedor_Actualizar",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar proveedor", ex);
            }
        }

        public async Task<int> ModificaEstadoProveedorAsync(ProveedorInActivaDto proveedorInActivaDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@NoProveedor", proveedorInActivaDto.NoProveedor);
                parametros.Add("@EsActivo", proveedorInActivaDto.EsActivo);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Proveedor_ModificaEstado",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar estado del proveedor", ex);
            }
        }
    }
}