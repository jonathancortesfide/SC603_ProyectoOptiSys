using System.Collections.Generic;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

public class GraduacionDto
{
    public int IdGraduacion { get; set; }
    public int Identificador { get; set; }
    public string? Nombre { get; set; }
    public string? Abreviatura { get; set; }
    public string? DescripcionTecnica { get; set; }
    public int Orden { get; set; }
    public bool Activo { get; set; }
    public int IdTipoGraduacion { get; set; }
    public string? Usuario { get; set; }
}

public class GraduacionConModeloDeValidacion : ModeloValidacion
{
    /// <summary>Graduaciones agrupadas por tipo (contrato para el SPA).</summary>
    public List<TipoGraduacionDto> TiposGraduacion { get; set; } = new();
}
