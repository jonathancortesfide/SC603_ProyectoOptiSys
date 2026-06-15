using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarGraduacion;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarGraduacion;

namespace Softlithe.ERP.BW.Graduaciones.ModificarGraduacion;

public class ModificarGraduacionBW : IModificarGraduacionBW
{
    private readonly IModificarGraduacionDA _modificarGraduacionDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarGraduacionBW(
        IModificarGraduacionDA modificarGraduacionDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarGraduacionDA = modificarGraduacionDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarGraduacion(GraduacionDto graduacion)
    {
        try
        {
            int resultado = await _modificarGraduacionDA.ModificarGraduacion(graduacion);
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(graduacion, resultado);
            return ConstruirRespuesta(resultado, respuestaBitacora);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new ModeloValidacion
            {
                Mensaje = MensajeDeGraduacionesDto.ErrorAlActualizarGraduacion,
                EsCorrecto = false
            };
        }
    }

    private ModeloValidacion ConstruirRespuesta(int filasAfectadas, int respuestaBitacora)
    {
        bool ok = filasAfectadas > 0;
        string mensaje = ok
            ? MensajeDeGraduacionesDto.GraduacionActualizada
            : MensajeDeGraduacionesDto.ErrorAlActualizarGraduacion;
        if (ok && respuestaBitacora == 0)
        {
            mensaje += MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora;
        }

        return new ModeloValidacion
        {
            Mensaje = mensaje,
            EsCorrecto = ok
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(GraduacionDto graduacion, int filasAfectadas)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = filasAfectadas > 0
                ? "Graduación modificada correctamente. Nombre: " + graduacion.Nombre
                : "Error al modificar la graduación. Nombre: " + graduacion.Nombre,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarGraduacion),
            tabla = "Graduacion",
            idBitacora = Guid.NewGuid(),
            identificador = graduacion.Identificador,
            usuario = graduacion.Usuario ?? string.Empty
        });
    }
}
