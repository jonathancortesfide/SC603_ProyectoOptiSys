using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadCatalogo
{
    public interface IAgregarEnfermedadCatalogoBW
    {
        Task<ModeloValidacion> AgregarEnfermedadCatalogo(AgregarEnfermedadCatalogoDto enfermedadCatalogoDto);
    }
}
