using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio
{
    //[Table "ListaPrecio"]       
    public class ListaPrecioDto
    {
        public int no_lista { get; set; }
        public string descripcion { get; set; }
        public int id_moneda { get; set; }
        public int Identificador { get; set; }
        public string? Usuario { get; set; } = string.Empty;   
        public Boolean? Activo { get; set; } 

    }

    public class ListaPrecioConModeloDeValidacion : ModeloValidacion
    {
        public List<ListaPrecioDto> LaListaDePrecios { get; set; } = new List<ListaPrecioDto>();

    }
}
