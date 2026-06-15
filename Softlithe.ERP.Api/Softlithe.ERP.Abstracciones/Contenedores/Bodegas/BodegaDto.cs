namespace Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

public class BodegaDto
{
    public int NoBodega { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int NoEmpresa { get; set; }
    public bool EsActivo { get; set; }

    public int Identificador { get; set; }

    /// <summary>
    /// Existencia del producto indicado en la consulta; null si no se pidió IdProducto o no hay registro en ExistenciaBodega.
    /// </summary>
    public decimal? Existencia { get; set; }
}
