using System;

namespace Softlithe.ERP.Abstracciones.Contenedores.Productos
{
    public class ProductoDto
    {
        public int noProducto { get; set; }
        public int noEmpresa { get; set; }
        public string tipoArticulo { get; set; }
        public string codigoInterno { get; set; }
        public string codigoBarras { get; set; }
        public string codigoAuxiliar { get; set; }
        public string nombre { get; set; }
        public string codigoCabys { get; set; }
        public string unidadMedida { get; set; }
        public string tipoImpuesto { get; set; }
        public decimal porcentajeImpuesto { get; set; }
        public decimal existencia { get; set; }
        public bool activo { get; set; }
        public DateTime fechaCreacion { get; set; }
        public DateTime? fechaModificacion { get; set; }
    }
}