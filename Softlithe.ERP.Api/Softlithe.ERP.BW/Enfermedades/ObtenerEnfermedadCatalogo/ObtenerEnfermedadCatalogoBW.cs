using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadCatalogo;

namespace Softlithe.ERP.BW.Enfermedades.ObtenerEnfermedadCatalogo
{
    public class ObtenerEnfermedadCatalogoBW : IObtenerEnfermedadCatalogoBW
    {
        private readonly IObtenerEnfermedadCatalogoDA _obtenerEnfermedadCatalogoDA;

        public ObtenerEnfermedadCatalogoBW(IObtenerEnfermedadCatalogoDA obtenerEnfermedadCatalogoDA)
        {
            _obtenerEnfermedadCatalogoDA = obtenerEnfermedadCatalogoDA;
        }

        public async Task<List<EnfermedadCatalogoResponseDto>> ObtenerCatalogo()
        {
            return await _obtenerEnfermedadCatalogoDA.ObtenerCatalogo();
        }
    }
}
