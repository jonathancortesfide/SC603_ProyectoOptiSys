using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadConCatalogo
{
    public class AgregarEnfermedadConCatalogoResponseDto
    {
        public int NoEnfermedad { get; set; }
        public int RegistrosActualizados { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int Identificador { get; set; }
    }

    public interface IAgregarEnfermedadConCatalogoDA
    {
        Task<AgregarEnfermedadConCatalogoResponseDto> AgregarEnfermedadConCatalogo(AgregarEnfermedadConCatalogoDto enfermedadDto);
    }
}
