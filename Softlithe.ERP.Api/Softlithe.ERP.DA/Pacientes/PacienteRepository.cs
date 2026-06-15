using Dapper;
using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes;
using Softlithe.ERP.DA.Modelos;
using System.Data;

namespace Softlithe.ERP.DA.Pacientes
{
    public class PacienteRepository : IPacienteRepository
    {
        private readonly ContextoBasedeDatos _contexto;

        public PacienteRepository(ContextoBasedeDatos contexto)
        {
            _contexto = contexto;
        }

        public async Task<int?> ObtenerUltimoIdExamenPorNoPacienteAsync(int noPaciente)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@NoPaciente", noPaciente);

                // Asumimos que el SP devuelve los examenes y retornamos el id del mas reciente
                var resultado = await conexion.QueryFirstOrDefaultAsync<int?>(
                    "sp_Examen_ObtenerUltimoIdPorPaciente",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el ultimo id de examen por paciente", ex);
            }
        }

        private async Task<IDbConnection> ObtenerConexionAsync()
        {
            var conexion = _contexto.Database.GetDbConnection();

            if (conexion.State == ConnectionState.Closed)
                await conexion.OpenAsync();

            return conexion;
        }

        public async Task<List<PacienteDto>> ObtenerPacientesAsync(int identificador, string? textoBusqueda)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@Identificador", identificador);
                parametros.Add("@TextoBusqueda", string.IsNullOrWhiteSpace(textoBusqueda) ? null : textoBusqueda);

                List<PacienteDto> pacientes = (await conexion.QueryAsync<PacienteDto>(
                    "sp_Paciente_Obtener",
                    parametros,
                    commandType: CommandType.StoredProcedure)).ToList();

                return pacientes;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener pacientes", ex);
            }
        }

        public async Task<PacienteDto?> ObtenerPacientePorIdAsync(int noPaciente)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@NoPaciente", noPaciente);

                PacienteDto? paciente = await conexion.QueryFirstOrDefaultAsync<PacienteDto>(
                    "sp_Paciente_ObtenerPorId",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return paciente;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el paciente por id", ex);
            }
        }

        public async Task<int> InsertarPacienteAsync(PacienteDto pacienteDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@Identificador", pacienteDto.Identificador);
                parametros.Add("@TipoIdentificacion", string.IsNullOrWhiteSpace(pacienteDto.TipoIdentificacion) ? null : pacienteDto.TipoIdentificacion);
                parametros.Add("@Cedula", pacienteDto.Cedula);
                parametros.Add("@Nombre", pacienteDto.Nombre);
                parametros.Add("@Direccion", string.IsNullOrWhiteSpace(pacienteDto.Direccion) ? null : pacienteDto.Direccion);
                parametros.Add("@FechaNacimiento", pacienteDto.FechaNacimiento);
                parametros.Add("@Email", string.IsNullOrWhiteSpace(pacienteDto.Email) ? null : pacienteDto.Email);
                parametros.Add("@Email2", string.IsNullOrWhiteSpace(pacienteDto.Email2) ? null : pacienteDto.Email2);
                parametros.Add("@Telefono1", string.IsNullOrWhiteSpace(pacienteDto.Telefono1) ? null : pacienteDto.Telefono1);
                parametros.Add("@Telefono2", string.IsNullOrWhiteSpace(pacienteDto.Telefono2) ? null : pacienteDto.Telefono2);
                parametros.Add("@Sexo", string.IsNullOrWhiteSpace(pacienteDto.Sexo) ? null : pacienteDto.Sexo);
                parametros.Add("@Plazo", pacienteDto.Plazo);
                parametros.Add("@LimiteCredito", pacienteDto.LimiteCredito);
                parametros.Add("@Activo", pacienteDto.Activo);
                parametros.Add("@SinIdentificacion", pacienteDto.SinIdentificacion);
                parametros.Add("@FechaRegistro", pacienteDto.FechaRegistro ?? DateTime.Now);
                parametros.Add("@NombreContactoEmergencia", string.IsNullOrWhiteSpace(pacienteDto.NombreContactoEmergencia) ? null : pacienteDto.NombreContactoEmergencia);
                parametros.Add("@TelefonoContactoEmergencia", string.IsNullOrWhiteSpace(pacienteDto.TelefonoContactoEmergencia) ? null : pacienteDto.TelefonoContactoEmergencia);
                parametros.Add("@EsEmpadronado", pacienteDto.EsEmpadronado);
                parametros.Add("@CodigoActividad", string.IsNullOrWhiteSpace(pacienteDto.CodigoActividad) ? null : pacienteDto.CodigoActividad);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Paciente_Insertar",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al insertar paciente", ex);
            }
        }

        public async Task<int> ActualizarPacienteAsync(PacienteDto pacienteDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@NoPaciente", pacienteDto.NoPaciente);
                parametros.Add("@Identificador", pacienteDto.Identificador);
                parametros.Add("@TipoIdentificacion", string.IsNullOrWhiteSpace(pacienteDto.TipoIdentificacion) ? null : pacienteDto.TipoIdentificacion);
                parametros.Add("@Cedula", pacienteDto.Cedula);
                parametros.Add("@Nombre", pacienteDto.Nombre);
                parametros.Add("@Direccion", string.IsNullOrWhiteSpace(pacienteDto.Direccion) ? null : pacienteDto.Direccion);
                parametros.Add("@FechaNacimiento", pacienteDto.FechaNacimiento);
                parametros.Add("@Email", string.IsNullOrWhiteSpace(pacienteDto.Email) ? null : pacienteDto.Email);
                parametros.Add("@Email2", string.IsNullOrWhiteSpace(pacienteDto.Email2) ? null : pacienteDto.Email2);
                parametros.Add("@Telefono1", string.IsNullOrWhiteSpace(pacienteDto.Telefono1) ? null : pacienteDto.Telefono1);
                parametros.Add("@Telefono2", string.IsNullOrWhiteSpace(pacienteDto.Telefono2) ? null : pacienteDto.Telefono2);
                parametros.Add("@Sexo", string.IsNullOrWhiteSpace(pacienteDto.Sexo) ? null : pacienteDto.Sexo);
                parametros.Add("@Plazo", pacienteDto.Plazo);
                parametros.Add("@LimiteCredito", pacienteDto.LimiteCredito);
                parametros.Add("@SinIdentificacion", pacienteDto.SinIdentificacion);
                parametros.Add("@NombreContactoEmergencia", string.IsNullOrWhiteSpace(pacienteDto.NombreContactoEmergencia) ? null : pacienteDto.NombreContactoEmergencia);
                parametros.Add("@TelefonoContactoEmergencia", string.IsNullOrWhiteSpace(pacienteDto.TelefonoContactoEmergencia) ? null : pacienteDto.TelefonoContactoEmergencia);
                parametros.Add("@EsEmpadronado", pacienteDto.EsEmpadronado);
                parametros.Add("@CodigoActividad", string.IsNullOrWhiteSpace(pacienteDto.CodigoActividad) ? null : pacienteDto.CodigoActividad);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Paciente_Actualizar",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar paciente", ex);
            }
        }

        public async Task<int> ModificaEstadoPacienteAsync(PacienteInActivaDto pacienteInActivaDto)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@NoPaciente", pacienteInActivaDto.NoPaciente);
                parametros.Add("@Identificador", pacienteInActivaDto.Identificador);
                parametros.Add("@EsActivo", pacienteInActivaDto.EsActivo);

                var resultado = await conexion.ExecuteAsync(
                    "sp_Paciente_ModificaEstado",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar estado del paciente", ex);
            }
        }
    }
}
