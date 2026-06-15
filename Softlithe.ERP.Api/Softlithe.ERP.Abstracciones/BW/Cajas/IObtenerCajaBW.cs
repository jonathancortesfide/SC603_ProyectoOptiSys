using Softlithe.ERP.Abstracciones.Contenedores.Cajas;

namespace Softlithe.ERP.Abstracciones.BW.Cajas;

public interface IObtenerCajaBW
{
    Task<CajaConModeloDeValidacion> ObtenerCajas(ParametroConsultaCaja parametro);
}
