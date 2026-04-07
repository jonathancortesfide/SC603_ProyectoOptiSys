using Softlithe.ERP.Abstracciones.BW.ListaPrecio.ModificarEstadoListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ModificarEstadoListaPrecio;

namespace Softlithe.ERP.BW.ListaPrecio.ModificarEstadoListaPrecio
{
    public class ModificarEstadoListaPrecioBW : IModificarEstadoListaPrecioBW
    {
        private readonly IModificarEstadoListaPrecioDA _modificarEstadoListaPrecioDA;

        public ModificarEstadoListaPrecioBW(IModificarEstadoListaPrecioDA modificarEstadoListaPrecioDA)
        {
            _modificarEstadoListaPrecioDA = modificarEstadoListaPrecioDA;
        }

        public async Task<int> ModificarEstadoListaPrecio(int noLista, bool activo)
        {
            return await _modificarEstadoListaPrecioDA.ModificarEstadoListaPrecio(noLista, activo);
        }
    }
}