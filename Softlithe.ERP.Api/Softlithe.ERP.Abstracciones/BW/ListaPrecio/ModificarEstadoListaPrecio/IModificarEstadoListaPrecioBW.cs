namespace Softlithe.ERP.Abstracciones.BW.ListaPrecio.ModificarEstadoListaPrecio
{
    public interface IModificarEstadoListaPrecioBW
    {
        Task<int> ModificarEstadoListaPrecio(int noLista, bool activo);
    }
}