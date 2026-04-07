namespace Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarEstadoTipoLente
{
    public interface IModificarEstadoTipoLenteDA
    {
        Task<int> ModificarEstadoTipoLente(int noTipoLente, bool activo);
    }
}