using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Usuarios;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;

namespace Softlithe.ERP.BW.Usuarios;

public class AgregarUsuarioBW : IAgregarUsuarioBW
{
    private readonly IAgregarUsuarioDA _agregarUsuarioDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public AgregarUsuarioBW(
        IAgregarUsuarioDA agregarUsuarioDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _agregarUsuarioDA = agregarUsuarioDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> AgregarUsuario(AgregarUsuarioDto dto)
    {
        try
        {
            int resultado = await _agregarUsuarioDA.AgregarUsuario(dto);
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(dto, resultado);
            return ConstruirRespuestaExitosa(resultado, respuestaBitacora);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return ConstruirRespuestaExitosa(0, 1);
        }
    }

    private ModeloValidacion ConstruirRespuestaExitosa(int resultadoRegistro, int errorBitacora)
    {
        return new ModeloValidacion
        {
            Mensaje = (resultadoRegistro > 0 ? MensajeDeUsuarioDto.UsuarioAgregadoCorrectamente : MensajeDeUsuarioDto.UsuarioNoGuardado)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(AgregarUsuarioDto dto, int resultadoRegistro)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeUsuarioDto.UsuarioAgregadoCorrectamente + " Nombre: " + dto.Nombre
                : MensajeDeUsuarioDto.UsuarioNoGuardado + " Nombre: " + dto.Nombre,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(AgregarUsuario),
            tabla = "Usuario",
            idBitacora = Guid.NewGuid(),
            identificador = dto.Identificador,
            usuario = dto.Usuario,
        });
    }
}
