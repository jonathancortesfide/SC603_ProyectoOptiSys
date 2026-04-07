using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;

namespace Softlithe.ERP.Abstracciones.DA.ListaPrecio.ModificarEstadoListaPrecio
{
    public interface IModificarEstadoListaPrecioDA
    {
        Task<int> ModificarEstadoListaPrecio(int noLista, bool activo);
    }
}