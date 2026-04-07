using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Pacientes
{
public class PacienteDto
{
    public int numeroDePaciente { get; set; }
    public int noEmpresa { get; set; }
    public string numeroDePacienteStr { get; set; } = string.Empty;
    public string tipoIdentificacion { get; set; } = string.Empty;
    public string identificacion { get; set; } = string.Empty;
    public string nombre { get; set; } = string.Empty;
    public DateTime? fechaNacimiento { get; set; }
    public string? sexo { get; set; }
    public int? noPaisNacionalidad { get; set; }
    public string? telefono1 { get; set; }
    public string? telefono2 { get; set; }
    public string? email1 { get; set; }
    public string? direccion { get; set; }
    public bool noEnviaFacturaElectronica { get; set; }
    public string? contactoEmergenciaNombre { get; set; }
    public string? contactoEmergenciaTelefono { get; set; }
    public bool esActivo { get; set; }
    public DateTime fechaCreacion { get; set; }
    public DateTime? fechaModificacion { get; set; }
}
}
