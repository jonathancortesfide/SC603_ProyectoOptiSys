using Softlithe.ERP.Abstracciones.Contenedores;

namespace Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal
{
    public class SucursalDto
    {
        /// <summary>Clave Empresa_Sucursal (Usuario_Empresa_Sucursal.identificador).</summary>
        public int Identificador { get; set; }

        public int NoSucursal { get; set; }
        public byte[]? Imagen { get; set; }
        public string? Nombre { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono1 { get; set; }
        public string? Telefono2 { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public string? Url { get; set; }
        public string? Siglas { get; set; }
        public string? Facebook { get; set; }
    }

    public class SucursalConModeloDeValidacion : ModeloValidacion
    {
        public List<SucursalDto> LaListaDeSucursales { get; set; } = new List<SucursalDto>();
    }
}
