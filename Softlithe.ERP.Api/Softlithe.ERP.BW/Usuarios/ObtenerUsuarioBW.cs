using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Usuarios;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;

namespace Softlithe.ERP.BW.Usuarios;

public class ObtenerUsuarioBW : IObtenerUsuarioBW
{
    private readonly IObtenerUsuarioDA _obtenerUsuarioDA;
    private readonly IErrorLogger _logger;

    public ObtenerUsuarioBW(IObtenerUsuarioDA obtenerUsuarioDA, IErrorLogger errorLogger)
    {
        _obtenerUsuarioDA = obtenerUsuarioDA;
        _logger = errorLogger;
    }

    public async Task<UsuarioConModeloDeValidacion> ObtenerUsuario(ParametroConsultaUsuario parametro)
    {
        if (parametro.Identificador <= 0)
        {
            return new UsuarioConModeloDeValidacion
            {
                ListaUsuarios = new List<UsuarioDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                EsCorrecto = false,
            };
        }

        try
        {
            List<UsuarioDto> lista =
                await _obtenerUsuarioDA.ObtenerUsuarios(parametro.Identificador, parametro.Descripcion);
            return new UsuarioConModeloDeValidacion
            {
                ListaUsuarios = lista,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new UsuarioConModeloDeValidacion
            {
                ListaUsuarios = new List<UsuarioDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
            };
        }
    }

    public async Task<ModeloValidacionConDatos<UsuarioDto?>> ObtenerUsuarioPorId(ParametroConsultaUsuarioPorId parametro)
    {
        if (parametro.IdUsuario <= 0)
        {
            return new ModeloValidacionConDatos<UsuarioDto?>
            {
                Mensaje = MensajeDeUsuarioDto.CodigoUsuarioRequerido,
                EsCorrecto = false,
                Datos = null,
            };
        }

        try
        {
            UsuarioDto? usuario = await _obtenerUsuarioDA.ObtenerUsuarioPorId(parametro.IdUsuario);
            if (usuario == null)
            {
                return new ModeloValidacionConDatos<UsuarioDto?>
                {
                    Mensaje = "No se encontró el usuario solicitado.",
                    EsCorrecto = false,
                    Datos = null,
                };
            }

            return new ModeloValidacionConDatos<UsuarioDto?>
            {
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
                Datos = usuario,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new ModeloValidacionConDatos<UsuarioDto?>
            {
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
                Datos = null,
            };
        }
    }

    public async Task<ModeloValidacionConDatos<UsuarioDto?>> ObtenerUsuarioPorCorreo(ParametroConsultaUsuarioPorCorreo parametro)
    {
        if (string.IsNullOrWhiteSpace(parametro.Email))
        {
            return new ModeloValidacionConDatos<UsuarioDto?>
            {
                Mensaje = MensajesGeneralesDelSistemaDto.EmailRequerido,
                EsCorrecto = false,
                Datos = null,
            };
        }

        try
        {
            UsuarioDto? usuario = await _obtenerUsuarioDA.ObtenerUsuarioPorCorreo(parametro.Email);
            if (usuario == null)
            {
                return new ModeloValidacionConDatos<UsuarioDto?>
                {
                    Mensaje = MensajeDeUsuarioDto.UsuarioCorreoNoEncontrado,
                    EsCorrecto = false,
                    Datos = null,
                };
            }

            return new ModeloValidacionConDatos<UsuarioDto?>
            {
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
                Datos = usuario,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new ModeloValidacionConDatos<UsuarioDto?>
            {
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
                Datos = null,
            };
        }
    }
}
