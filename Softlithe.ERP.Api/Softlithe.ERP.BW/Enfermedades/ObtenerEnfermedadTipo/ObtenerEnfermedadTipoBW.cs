using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadTipo;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadTipo;

namespace Softlithe.ERP.BW.Enfermedades.ObtenerEnfermedadTipo
{
    public class ObtenerEnfermedadTipoBW : IObtenerEnfermedadTipoBW
    {
        private readonly IObtenerEnfermedadTipoDA _obtenerEnfermedadTipoDA;

        public ObtenerEnfermedadTipoBW(IObtenerEnfermedadTipoDA obtenerEnfermedadTipoDA)
        {
            _obtenerEnfermedadTipoDA = obtenerEnfermedadTipoDA;
        }

        public async Task<List<EnfermedadTipoDto>> ObtenerTipos()
        {
            return await _obtenerEnfermedadTipoDA.ObtenerTipos();
        }
    }
}
