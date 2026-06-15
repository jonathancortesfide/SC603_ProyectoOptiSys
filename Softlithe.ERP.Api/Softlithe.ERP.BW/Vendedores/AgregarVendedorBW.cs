using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Vendedores;

namespace Softlithe.ERP.BW.Vendedores;

public class AgregarVendedorBW : IAgregarVendedorBW
{
    private readonly IAgregarVendedorDA _agregarVendedorDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public AgregarVendedorBW(
        IAgregarVendedorDA agregarVendedorDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _agregarVendedorDA = agregarVendedorDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> AgregarVendedor(AgregarVendedorDto dto)
    {
        try
        {
            int resultado = await _agregarVendedorDA.AgregarVendedor(dto);
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
            Mensaje = (resultadoRegistro > 0 ? MensajeDeVendedorDto.VendedorAgregadoCorrectamente : MensajeDeVendedorDto.VendedorNoGuardado)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(AgregarVendedorDto dto, int resultadoRegistro)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeVendedorDto.VendedorAgregadoCorrectamente + " Descripción: " + (dto.Descripcion ?? string.Empty)
                : MensajeDeVendedorDto.VendedorNoGuardado + " Descripción: " + (dto.Descripcion ?? string.Empty),
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(AgregarVendedor),
            tabla = "Vendedor",
            idBitacora = Guid.NewGuid(),
            identificador = dto.Identificador,
            usuario = dto.Usuario,
        });
    }
}
