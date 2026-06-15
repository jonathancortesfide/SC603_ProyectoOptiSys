using Softlithe.ERP.Abstracciones.BW.Graduaciones.AgregarGraduacion;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.AgregarGraduacion;

namespace Softlithe.ERP.BW.Graduaciones.AgregarGraduacion;

public class AgregarGraduacionBW : IAgregarGraduacionBW
{
    private readonly IAgregarGraduacionAD _agregarGraduacionAD;

    public AgregarGraduacionBW(IAgregarGraduacionAD agregarGraduacionAD)
    {
        _agregarGraduacionAD = agregarGraduacionAD;
    }

    public async Task<ModeloValidacion> Agregar(GraduacionDto graduacion)
    {
        graduacion.Activo = true;
        int filas = await _agregarGraduacionAD.Agregar(graduacion);
        bool ok = filas == 1;
        return new ModeloValidacion
        {
            Mensaje = ok ? MensajeDeGraduacionesDto.GraduacionCreada : MensajeDeGraduacionesDto.ErrorAlCrearGraduacion,
            EsCorrecto = ok
        };
    }
}
