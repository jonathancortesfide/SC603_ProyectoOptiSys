using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Secciones;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Seguridad.Secciones
{
    public class ObtenerSeccionesDA : IObtenerSeccionesDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerSeccionesDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<List<SeccionDto>> ObtenerSecciones()
        {
            try
            {
                return await _contexto.Secciones
                    .Select(s => new SeccionDto
                    {
                        IdSeccion = s.IdSeccion,
                        Nombre = s.Nombre,
                        Activo = s.Activo
                    })
                    .OrderBy(s => s.Nombre)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener las secciones.", ex);
            }
        }
    }

    public class AgregarSeccionDA : IAgregarSeccionDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public AgregarSeccionDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> AgregarSeccion(AgregarSeccionDto Dto)
        {
            try
            {
                var existe = await _contexto.Secciones
                    .AnyAsync(s => s.Nombre.ToLower() == Dto.Nombre.ToLower());

                if (existe)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Ya existe una sección con ese nombre." };

                _contexto.Secciones.Add(new Seccion { Nombre = Dto.Nombre, Activo = true });
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Sección agregada correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar la sección.", ex);
            }
        }
    }

    public class ModificarEstadoSeccionDA : IModificarEstadoSeccionDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ModificarEstadoSeccionDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> ModificarEstadoSeccion(ModificarEstadoSeccionDto Dto)
        {
            try
            {
                var seccion = await _contexto.Secciones.FindAsync(Dto.IdSeccion);
                if (seccion == null)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Sección no encontrada." };

                seccion.Activo = Dto.EsActivo;
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Estado de la sección actualizado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar el estado de la sección.", ex);
            }
        }
    }
}
