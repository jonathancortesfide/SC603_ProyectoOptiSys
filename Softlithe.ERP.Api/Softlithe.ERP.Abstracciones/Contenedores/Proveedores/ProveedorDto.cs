using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Proveedores
{
    public class ProveedorDto
    {
        [Required(ErrorMessage = MensajeDeProveedorDto.CodigoProveedorRequerido)]
        public int NoProveedor { get; set; }
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }
        [Required(ErrorMessage = MensajeDeProveedorDto.NombreProveedorRequerido)]
        public string Nombre { get; set; } = string.Empty;
        [Required(ErrorMessage = MensajeDeProveedorDto.CedulaProveedorRequerida)]
        public string Cedula { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Notas { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; }
        public int Plazo { get; set; }
        public string Email { get; set; } = string.Empty;
        public int NoNacionalidad { get; set; }
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
        public bool EsActivo { get; set; }
        public decimal LimiteCredito { get; set; }
        public int NoMoneda { get; set; }
        public decimal Saldo { get; set; }
        public string Telefono1 { get; set; } = string.Empty;
        public string Telefono2 { get; set; } = string.Empty;
        public bool EsLaboratorio { get; set; }
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;
    }

    public class ProveedorConModeloDeValidacion : ModeloValidacion
    {
        public List<ProveedorDto> LaListaDeProveedores { get; set; } = new List<ProveedorDto>();
    }
}
