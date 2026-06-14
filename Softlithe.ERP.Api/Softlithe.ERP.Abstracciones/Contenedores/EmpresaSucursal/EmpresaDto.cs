using Softlithe.ERP.Abstracciones.Contenedores;

namespace Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal
{
    public class EmpresaDto
    {
        public int NoEmpresa { get; set; }
        public byte[]? Imagen { get; set; }
        public string? Nombre { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono1 { get; set; }
        public string? Telefono2 { get; set; }
        public string? Email { get; set; }
        public string? Url { get; set; }
        public string? Cedula { get; set; }
        public string? DetalleCuentasBancaria { get; set; }
    }

    public class EmpresaConModeloDeValidacion : ModeloValidacion
    {
        public List<EmpresaDto> LaListaDeEmpresas { get; set; } = new List<EmpresaDto>();
    }
}
