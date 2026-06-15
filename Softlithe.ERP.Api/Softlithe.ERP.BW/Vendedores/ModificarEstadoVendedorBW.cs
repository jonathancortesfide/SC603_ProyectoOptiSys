using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Vendedores;

namespace Softlithe.ERP.BW.Vendedores;

public class ModificarEstadoVendedorBW : IModificarEstadoVendedorBW
{
    private readonly IModificarEstadoVendedorDA _modificarEstadoVendedorDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarEstadoVendedorBW(
        IModificarEstadoVendedorDA modificarEstadoVendedorDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarEstadoVendedorDA = modificarEstadoVendedorDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarEstadoVendedor(ModificarEstadoVendedorDto dto)
    {
        RespuestaCambiarEstadoVendedorDA resultado = new RespuestaCambiarEstadoVendedorDA { ResultadoRegistro = 0 };
        try
        {
            resultado = await _modificarEstadoVendedorDA.ModificarEstadoVendedor(dto);
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(resultado, dto.Usuario);
            return ConstruirRespuestaExitosa(resultado, respuestaBitacora);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return ConstruirRespuestaExitosa(resultado, 1);
        }
    }

    private ModeloValidacion ConstruirRespuestaExitosa(RespuestaCambiarEstadoVendedorDA respuesta, int errorBitacora)
    {
        string estadoTxt = respuesta.ModeloVendedor.EsActivo ? "Activo" : "Inactivo";
        return new ModeloValidacion
        {
            Mensaje = (respuesta.ResultadoRegistro == 0
                    ? MensajeDeVendedorDto.VendedorNoGuardado
                    : string.Format(MensajeDeVendedorDto.VendedorEstadoCorrectamente, respuesta.ModeloVendedor.Descripcion, estadoTxt))
                  + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = respuesta.ResultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(RespuestaCambiarEstadoVendedorDA respuesta, string usuarioRegistro)
    {
        string estadoTxt = respuesta.ModeloVendedor.EsActivo ? "Activo" : "Inactivo";
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = respuesta.ResultadoRegistro > 0
                ? string.Format(MensajeDeVendedorDto.VendedorEstadoCorrectamente, respuesta.ModeloVendedor.Descripcion, estadoTxt)
                : MensajeDeVendedorDto.VendedorNoGuardado,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarEstadoVendedor),
            tabla = "Vendedor",
            idBitacora = Guid.NewGuid(),
            identificador = respuesta.ModeloVendedor.Identificador,
            usuario = usuarioRegistro,
        });
    }
}
