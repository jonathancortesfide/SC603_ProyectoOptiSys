using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion
{
    public class ParametroFacturacionEmpresaDto
    {
        public int NoParametroFacturacionEmpresa { get; set; }
        public int Identificador { get; set; }
        public string? CodigoSeguridad { get; set; }
        public string? UsuarioCertificado { get; set; }
        public string? ContrasenaCertificado { get; set; }
        public string? AmbienteCertificado { get; set; }
        public string? CorreoEmisor { get; set; }
        public string? ContrasenaCorreo { get; set; }
        public string? Pin { get; set; }
        public string? RutaCertificado { get; set; }
        public string? Host { get; set; }
        public int? Puerto { get; set; }
        public string? MensajeFactura { get; set; }
        public string? CorreoReceptor { get; set; }
        public string? ContrasenaCorreoReceptor { get; set; }
        public string? HostReceptor { get; set; }
        public int? PuertoReceptor { get; set; }
        public bool? SeguridadSslReceptor { get; set; }
    }
}
