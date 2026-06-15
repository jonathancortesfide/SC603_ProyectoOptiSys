using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Abstracciones.DA.Graduaciones.ObtenerGraduacionPorIdentificador;

public interface IObtenerGraduacionPorIdentificadorAD
{
    Task<GraduacionAgrupadaDto> Obtener(int identificador);
}
