using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Abstracciones.BW.Graduaciones.AgregarGraduacion;

public interface IAgregarGraduacionBW
{
    Task<ModeloValidacion> Agregar(GraduacionDto graduacion);
}
