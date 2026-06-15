using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadCatalogo
{
    public class AgregarEnfermedadCatalogoResponseDto
    {
        public int IdEnfermedad { get; set; }
        public int RegistrosActualizados { get; set; }
        public string Descripcion { get; set; } = string.Empty;
    }

    public interface IAgregarEnfermedadCatalogoDA
    {
        Task<AgregarEnfermedadCatalogoResponseDto> AgregarEnfermedadCatalogo(AgregarEnfermedadCatalogoDto enfermedadCatalogoDto);
    }
}
