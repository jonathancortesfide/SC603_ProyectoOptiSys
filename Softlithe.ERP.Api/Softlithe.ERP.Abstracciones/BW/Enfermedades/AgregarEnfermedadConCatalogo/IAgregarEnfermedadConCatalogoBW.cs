using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadConCatalogo
{
    public interface IAgregarEnfermedadConCatalogoBW
    {
        Task<ModeloValidacion> AgregarEnfermedadConCatalogo(AgregarEnfermedadConCatalogoDto enfermedadDto);
    }
}
