using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarGraduacion;

public interface IModificarGraduacionDA
{
    Task<int> ModificarGraduacion(GraduacionDto graduacion);
}
