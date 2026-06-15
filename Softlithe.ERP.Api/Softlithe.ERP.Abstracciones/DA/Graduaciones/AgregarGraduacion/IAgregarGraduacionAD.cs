using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Abstracciones.DA.Graduaciones.AgregarGraduacion;

public interface IAgregarGraduacionAD
{
    Task<int> Agregar(GraduacionDto graduacion);
}
