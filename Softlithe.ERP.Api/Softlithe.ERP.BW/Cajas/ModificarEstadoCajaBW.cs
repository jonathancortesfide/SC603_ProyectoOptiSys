using Softlithe.ERP.Abstracciones.BW.Cajas;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Cajas;

namespace Softlithe.ERP.BW.Cajas;

public class ModificarEstadoCajaBW : IModificarEstadoCajaBW
{
    private readonly IModificarEstadoCajaDA _modificarEstadoCajaDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarEstadoCajaBW(
        IModificarEstadoCajaDA modificarEstadoCajaDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarEstadoCajaDA = modificarEstadoCajaDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarEstadoCaja(ModificarEstadoCajaDto dto)
    {
        RespuestaCambiarEstadoCajaDA resultado = new RespuestaCambiarEstadoCajaDA { ResultadoRegistro = 0 };
        try
        {
            resultado = await _modificarEstadoCajaDA.ModificarEstadoCaja(dto);
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(resultado, dto.Usuario);
            return ConstruirRespuestaExitosa(resultado, respuestaBitacora);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return ConstruirRespuestaExitosa(resultado, 1);
        }
    }

    private ModeloValidacion ConstruirRespuestaExitosa(RespuestaCambiarEstadoCajaDA respuesta, int errorBitacora)
    {
        string estadoTxt = respuesta.ModeloCaja.EsActivo ? "Activo" : "Inactivo";
        return new ModeloValidacion
        {
            Mensaje = (respuesta.ResultadoRegistro == 0
                    ? MensajeDeCajaDto.CajaNoGuardada
                    : string.Format(MensajeDeCajaDto.CajaEstadoCorrectamente, respuesta.ModeloCaja.Nombre, estadoTxt))
                  + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = respuesta.ResultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(RespuestaCambiarEstadoCajaDA respuesta, string usuarioRegistro)
    {
        string estadoTxt = respuesta.ModeloCaja.EsActivo ? "Activo" : "Inactivo";
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = respuesta.ResultadoRegistro > 0
                ? string.Format(MensajeDeCajaDto.CajaEstadoCorrectamente, respuesta.ModeloCaja.Nombre, estadoTxt)
                : MensajeDeCajaDto.CajaNoGuardada,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarEstadoCaja),
            tabla = "Caja",
            idBitacora = Guid.NewGuid(),
            identificador = respuesta.ModeloCaja.Identificador,
            usuario = usuarioRegistro,
        });
    }
}
