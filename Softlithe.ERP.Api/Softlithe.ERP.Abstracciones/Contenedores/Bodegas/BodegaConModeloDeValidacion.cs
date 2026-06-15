using Softlithe.ERP.Abstracciones.Contenedores;

namespace Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

public class BodegaConModeloDeValidacion : ModeloValidacion
{
    public List<BodegaDto> ListaBodegas { get; set; } = new();
}
