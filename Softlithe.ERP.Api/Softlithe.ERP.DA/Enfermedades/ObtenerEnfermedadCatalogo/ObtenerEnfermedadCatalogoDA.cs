using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadCatalogo;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Enfermedades.ObtenerEnfermedadCatalogo
{
    public class ObtenerEnfermedadCatalogoDA : IObtenerEnfermedadCatalogoDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerEnfermedadCatalogoDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<List<EnfermedadCatalogoResponseDto>> ObtenerCatalogo()
        {
            try
            {
                var catalogo = await _contextoBasedeDatos.EnfermedadCatalogos
                    .Include(e => e.EnfermedadTipo)
                    .Select(e => new EnfermedadCatalogoResponseDto
                    {
                        idEnfermedad = e.IdEnfermedad,
                        descripcion = e.Descripcion,
                        noTipo = e.NoTipo,
                        tipoNombre = e.EnfermedadTipo != null ? e.EnfermedadTipo.Nombre : string.Empty
                    })
                    .OrderBy(e => e.descripcion)
                    .ToListAsync();

                return catalogo;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener el catálogo de enfermedades.", ex);
            }
        }
    }
}
