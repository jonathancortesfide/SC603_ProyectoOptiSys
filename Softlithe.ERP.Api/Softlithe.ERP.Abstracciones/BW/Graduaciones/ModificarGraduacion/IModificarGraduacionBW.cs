using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarGraduacion;

public interface IModificarGraduacionBW
{
    Task<ModeloValidacion> ModificarGraduacion(GraduacionDto graduacion);
}
