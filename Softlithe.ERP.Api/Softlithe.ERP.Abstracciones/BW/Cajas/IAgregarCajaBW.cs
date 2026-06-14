using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;

namespace Softlithe.ERP.Abstracciones.BW.Cajas;

public interface IAgregarCajaBW
{
    Task<ModeloValidacion> AgregarCaja(AgregarCajaDto dto);
}
