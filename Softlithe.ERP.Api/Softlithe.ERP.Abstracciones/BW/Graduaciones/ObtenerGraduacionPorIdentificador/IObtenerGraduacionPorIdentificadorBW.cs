using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Abstracciones.BW.Graduaciones.ObtenerGraduacionPorIdentificador;

public interface IObtenerGraduacionPorIdentificadorBW
{
    Task<GraduacionConModeloDeValidacion> Obtener(int identificador);
}
