namespace Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarEstadoGraduacion;

public interface IModificarEstadoGraduacionBW
{
    Task<int> ModificarEstadoGraduacion(int idGraduacion, bool activo);
}
