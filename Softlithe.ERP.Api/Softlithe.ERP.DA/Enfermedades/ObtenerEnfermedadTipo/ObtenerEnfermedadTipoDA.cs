using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadTipo;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Enfermedades.ObtenerEnfermedadTipo
{
    public class ObtenerEnfermedadTipoDA : IObtenerEnfermedadTipoDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerEnfermedadTipoDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<List<EnfermedadTipoDto>> ObtenerTipos()
        {
            try
            {
                return await _contextoBasedeDatos.EnfermedadTipos
                    .Select(t => new EnfermedadTipoDto
                    {
                        numeroTipo = t.NumeroTipo,
                        nombre = t.Nombre
                    })
                    .OrderBy(t => t.nombre)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener los tipos de enfermedad.", ex);
            }
        }
    }
}
