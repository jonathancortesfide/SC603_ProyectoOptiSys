using System;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
    public class AgregarExamenDto
    {
        public int NoExamen { get; set; }
        public int NoPaciente { get; set; }
        public DateTime FechaExamen { get; set; }

        public string? MotivoDeConsulta { get; set; }

        public int NumeroEmpresa { get; set; }
        public int? Identificador { get; set; }

        public string? Estado { get; set; }

        // Profesional
        public string? CodigoProfesional { get; set; }
        public int? IdProfesional { get; set; }
        public string? NombreProfesional { get; set; }

        // Paciente
        public string? NombrePaciente { get; set; }
        public String? Motivo { get; set; }
        // Graduaciones
        public string? XmlGraduaciones { get; set; }

        public RxDto? RxActual { get; set; }
        public RxDto? RxBase { get; set; }
        public RxDto? RxCerca { get; set; }
        public RxDto? RxContacto { get; set; }

        // Diseño del lente
        public string? TipoLente { get; set; }
        public int? TipoLenteId { get; set; }

        public string? Material { get; set; }
        public int? MaterialId { get; set; }

        public string? Aro { get; set; }
        public int? CodigoAro { get; set; }

        // Laboratorio
        public string? Laboratorio { get; set; }
        public string? NumeroOrdenLaboratorio { get; set; }
        public string? NumeroPedidoLaboratorio { get; set; }

        // Observaciones
        public string? ObservacionesGenerales { get; set; }
        public string? Observaciones { get; set; }

        // Venta
        public string? Disposicion { get; set; }
        public string? Tratamiento { get; set; }

        // Costos
        public decimal? CostoAro { get; set; }
        public decimal? CostoLente { get; set; }
        public decimal? CostoMaterial { get; set; }
        public decimal? CostoExamen { get; set; }
        public decimal? PrecioFinal { get; set; }
    }

    public class RxDto
    {
        public RxEyeDto? OD { get; set; }
        public RxEyeDto? OI { get; set; }
        public string? Observaciones { get; set; }
    }

    public class RxEyeDto
    {
        public string? Esfera { get; set; }
        public string? Cilindro { get; set; }
        public string? Eje { get; set; }
        public string? DNP { get; set; }
        public string? Otro { get; set; }
    }
}