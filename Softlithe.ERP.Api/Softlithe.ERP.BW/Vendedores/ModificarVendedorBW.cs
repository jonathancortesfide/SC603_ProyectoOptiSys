using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Vendedores;

namespace Softlithe.ERP.BW.Vendedores;

public class ModificarVendedorBW : IModificarVendedorBW
{
    private readonly IModificarVendedorDA _modificarVendedorDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarVendedorBW(
        IModificarVendedorDA modificarVendedorDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarVendedorDA = modificarVendedorDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarVendedor(ModificarVendedorDto dto)
    {
        try
        {
            int resultado = await _modificarVendedorDA.ModificarVendedor(dto);
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
            Mensaje = (resultadoRegistro > 0 ? MensajeDeVendedorDto.VendedorModificadoCorrectamente : MensajeDeVendedorDto.VendedorNoGuardado)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(ModificarVendedorDto dto, int resultadoRegistro)
    {
        string desc = dto.Descripcion ?? string.Empty;
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeVendedorDto.VendedorModificadoCorrectamente + " no_vendedor: " + dto.NoVendedor + " Descripción: " + desc
                : MensajeDeVendedorDto.VendedorNoGuardado + " no_vendedor: " + dto.NoVendedor + " Descripción: " + desc,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarVendedor),
            tabla = "Vendedor",
            idBitacora = Guid.NewGuid(),
            identificador = dto.Identificador,
            usuario = dto.Usuario,
        });
    }
}
