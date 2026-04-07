namespace Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarEstadoTipoLente
{
    public interface IModificarEstadoTipoLenteBW
    {
        Task<int> ModificarEstadoTipoLente(int noTipoLente, bool activo);
    }
}