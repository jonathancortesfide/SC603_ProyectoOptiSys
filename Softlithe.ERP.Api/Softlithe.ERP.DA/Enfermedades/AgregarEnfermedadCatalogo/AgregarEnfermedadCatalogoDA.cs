using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadCatalogo;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Enfermedades.AgregarEnfermedadCatalogo
{
    public class AgregarEnfermedadCatalogoDA : IAgregarEnfermedadCatalogoDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public AgregarEnfermedadCatalogoDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<AgregarEnfermedadCatalogoResponseDto> AgregarEnfermedadCatalogo(AgregarEnfermedadCatalogoDto enfermedadCatalogoDto)
        {
            if (enfermedadCatalogoDto == null) throw new ArgumentNullException(nameof(enfermedadCatalogoDto));

            try
            {
                // Validar que el tipo de enfermedad existe
                var tipoExiste = await _contextoBasedeDatos.EnfermedadTipos
                    .FirstOrDefaultAsync(t => t.NumeroTipo == enfermedadCatalogoDto.noTipo);

                if (tipoExiste == null)
                {
                    throw new Exception("El tipo de enfermedad especificado no existe.");
                }

                // Validar que no exista ya una enfermedad con la misma descripción
                var enfermedadExistente = await _contextoBasedeDatos.EnfermedadCatalogos
                    .FirstOrDefaultAsync(e => e.Descripcion.ToLower() == enfermedadCatalogoDto.descripcion.ToLower());

                if (enfermedadExistente != null)
                {
                    throw new Exception($"Ya existe una enfermedad con la descripción '{enfermedadCatalogoDto.descripcion}' en el catálogo.");
                }

                // Crear nueva enfermedad en el catálogo
                var nuevaEnfermedadCatalogo = new EnfermedadCatalogo
                {
                    Descripcion = enfermedadCatalogoDto.descripcion,
                    NoTipo = enfermedadCatalogoDto.noTipo
                };

                _contextoBasedeDatos.EnfermedadCatalogos.Add(nuevaEnfermedadCatalogo);
                int resultado = await _contextoBasedeDatos.SaveChangesAsync();

                return new AgregarEnfermedadCatalogoResponseDto
                {
                    IdEnfermedad = nuevaEnfermedadCatalogo.IdEnfermedad,
                    RegistrosActualizados = resultado,
                    Descripcion = nuevaEnfermedadCatalogo.Descripcion
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al agregar la enfermedad al catálogo.", ex);
            }
        }
    }
}
