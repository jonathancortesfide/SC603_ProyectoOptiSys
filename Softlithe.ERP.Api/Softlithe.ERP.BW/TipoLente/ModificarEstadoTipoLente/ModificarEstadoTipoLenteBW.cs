using Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarEstadoTipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarEstadoTipoLente;

namespace Softlithe.ERP.BW.TipoLente.ModificarEstadoTipoLente
{
    public class ModificarEstadoTipoLenteBW : IModificarEstadoTipoLenteBW
    {
        private readonly IModificarEstadoTipoLenteDA _modificarEstadoTipoLenteDA;

        public ModificarEstadoTipoLenteBW(IModificarEstadoTipoLenteDA modificarEstadoTipoLenteDA)
        {
            _modificarEstadoTipoLenteDA = modificarEstadoTipoLenteDA;
        }

        public async Task<int> ModificarEstadoTipoLente(int noTipoLente, bool activo)
        {
            return await _modificarEstadoTipoLenteDA.ModificarEstadoTipoLente(noTipoLente, activo);
        }
    }
}