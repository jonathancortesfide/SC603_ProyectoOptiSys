namespace Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarEstadoGraduacion;

public interface IModificarEstadoGraduacionDA
{
    Task<int> ModificarEstadoGraduacion(int idGraduacion, bool activo);
}
