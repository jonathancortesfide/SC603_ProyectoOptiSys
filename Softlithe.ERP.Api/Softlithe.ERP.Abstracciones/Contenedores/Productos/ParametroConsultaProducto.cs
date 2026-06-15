using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Productos
{
    public class ParametroConsultaProducto
    {
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida)]
        public int NoEmpresa { get; set; }

        /// <summary>Búsqueda por código, código de barra, código proveedor, descripción o nombre de marca.</summary>
        public string TextoBusqueda { get; set; } = string.Empty;
    }

    public class ParametroConsultaProductoPorId
    {
        [Required(ErrorMessage = MensajeDeProductoDto.CodigoProductoRequerido)]
        public int IdProducto { get; set; }
    }
}
