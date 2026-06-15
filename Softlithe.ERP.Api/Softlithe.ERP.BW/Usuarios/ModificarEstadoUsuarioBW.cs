using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Usuarios;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;

namespace Softlithe.ERP.BW.Usuarios;

public class ModificarEstadoUsuarioBW : IModificarEstadoUsuarioBW
{
    private readonly IModificarEstadoUsuarioDA _modificarEstadoUsuarioDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarEstadoUsuarioBW(
        IModificarEstadoUsuarioDA modificarEstadoUsuarioDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarEstadoUsuarioDA = modificarEstadoUsuarioDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarEstadoUsuario(ModificarEstadoUsuarioDto dto)
    {
        RespuestaCambiarEstadoUsuarioDA resultado = new RespuestaCambiarEstadoUsuarioDA { ResultadoRegistro = 0 };
        try
        {
            resultado = await _modificarEstadoUsuarioDA.ModificarEstadoUsuario(dto);
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(resultado, dto);
            return ConstruirRespuestaExitosa(resultado, respuestaBitacora);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return ConstruirRespuestaExitosa(resultado, 1);
        }
    }

    private ModeloValidacion ConstruirRespuestaExitosa(RespuestaCambiarEstadoUsuarioDA respuesta, int errorBitacora)
    {
        string estadoTxt = respuesta.ModeloUsuario.EsActivo ? "Activo" : "Inactivo";
        return new ModeloValidacion
        {
            Mensaje = (respuesta.ResultadoRegistro == 0
                    ? MensajeDeUsuarioDto.UsuarioNoGuardado
                    : string.Format(MensajeDeUsuarioDto.UsuarioEstadoCorrectamente, respuesta.ModeloUsuario.Nombre, estadoTxt))
                  + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = respuesta.ResultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(RespuestaCambiarEstadoUsuarioDA respuesta, ModificarEstadoUsuarioDto dto)
    {
        int identificadorBitacora = respuesta.ResultadoRegistro > 0
            ? respuesta.ModeloUsuario.Identificador
            : dto.Identificador;
        string estadoTxt = respuesta.ModeloUsuario.EsActivo ? "Activo" : "Inactivo";
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = respuesta.ResultadoRegistro > 0
                ? string.Format(MensajeDeUsuarioDto.UsuarioEstadoCorrectamente, respuesta.ModeloUsuario.Nombre, estadoTxt)
                : MensajeDeUsuarioDto.UsuarioNoGuardado,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarEstadoUsuario),
            tabla = "Usuario",
            idBitacora = Guid.NewGuid(),
            identificador = identificadorBitacora,
            usuario = dto.Usuario,
        });
    }
}
