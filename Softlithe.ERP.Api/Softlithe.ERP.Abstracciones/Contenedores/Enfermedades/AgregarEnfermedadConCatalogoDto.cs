using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
    public class AgregarEnfermedadConCatalogoDto
    {
        /// <summary>
        /// ID de la enfermedad en el catálogo (si ya existe).
        /// Si es 0 o null, debe proporcionarse descripcion y noTipo para crear una nueva.
        /// </summary>
        public int? idEnfermedad { get; set; }

        /// <summary>
        /// Descripción de la enfermedad (requerida si idEnfermedad es 0 o null para crear una nueva enfermedad).
        /// </summary>
        public string descripcion { get; set; } = string.Empty;

        /// <summary>
        /// Tipo de enfermedad (requerido si idEnfermedad es 0 o null para crear una nueva enfermedad).
        /// </summary>
        public int? noTipo { get; set; }

        /// <summary>
        /// Identificador de la sucursal donde se asignará la enfermedad.
        /// </summary>
        public int identificador { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string usuario { get; set; } = string.Empty;
    }
}
