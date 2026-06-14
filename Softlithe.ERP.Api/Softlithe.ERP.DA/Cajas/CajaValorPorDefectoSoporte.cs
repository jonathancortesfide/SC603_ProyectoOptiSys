using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Cajas;

internal static class CajaValorPorDefectoSoporte
{
    internal static async Task QuitarOtrosPorDefecto(
        ContextoBasedeDatos contexto,
        int identificador,
        int noCajaActual)
    {
        List<Caja> otras = await contexto.Cajas
            .Where(c =>
                c.Identificador == identificador
                && c.NoCaja != noCajaActual
                && c.ValorPorDefecto)
            .ToListAsync();

        if (otras.Count == 0)
        {
            return;
        }

        foreach (Caja caja in otras)
        {
            caja.ValorPorDefecto = false;
        }

        contexto.Cajas.UpdateRange(otras);
    }
}
