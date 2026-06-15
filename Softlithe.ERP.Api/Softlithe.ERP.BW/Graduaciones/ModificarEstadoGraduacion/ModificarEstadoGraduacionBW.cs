using Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarEstadoGraduacion;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarEstadoGraduacion;

namespace Softlithe.ERP.BW.Graduaciones.ModificarEstadoGraduacion;

public class ModificarEstadoGraduacionBW : IModificarEstadoGraduacionBW
{
    private readonly IModificarEstadoGraduacionDA _modificarEstadoGraduacionDA;

    public ModificarEstadoGraduacionBW(IModificarEstadoGraduacionDA modificarEstadoGraduacionDA)
    {
        _modificarEstadoGraduacionDA = modificarEstadoGraduacionDA;
    }

    public Task<int> ModificarEstadoGraduacion(int idGraduacion, bool activo) =>
        _modificarEstadoGraduacionDA.ModificarEstadoGraduacion(idGraduacion, activo);
}
