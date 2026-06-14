using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadConCatalogo;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Enfermedades.AgregarEnfermedadConCatalogo
{
    public class AgregarEnfermedadConCatalogoDA : IAgregarEnfermedadConCatalogoDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public AgregarEnfermedadConCatalogoDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<AgregarEnfermedadConCatalogoResponseDto> AgregarEnfermedadConCatalogo(AgregarEnfermedadConCatalogoDto enfermedadDto)
        {
            if (enfermedadDto == null) throw new ArgumentNullException(nameof(enfermedadDto));

            try
            {
                int idEnfermedad = enfermedadDto.idEnfermedad ?? 0;

                // Si no hay ID de enfermedad, crear una nueva en el catálogo
                if (idEnfermedad == 0)
                {
                    if (string.IsNullOrWhiteSpace(enfermedadDto.descripcion))
                        throw new Exception("La descripción de la enfermedad es requerida.");

                    if (!enfermedadDto.noTipo.HasValue || enfermedadDto.noTipo == 0)
                        throw new Exception("El tipo de enfermedad es requerido.");

                    // Validar que el tipo existe
                    var tipoExiste = await _contextoBasedeDatos.EnfermedadTipos
                        .FirstOrDefaultAsync(t => t.NumeroTipo == enfermedadDto.noTipo);

                    if (tipoExiste == null)
                        throw new Exception("El tipo de enfermedad especificado no existe.");

                    // Validar que no exista ya
                    var enfermedadExistente = await _contextoBasedeDatos.EnfermedadCatalogos
                        .FirstOrDefaultAsync(e => e.Descripcion.ToLower() == enfermedadDto.descripcion.ToLower());

                    if (enfermedadExistente != null)
                        idEnfermedad = enfermedadExistente.IdEnfermedad;
                    else
                    {
                        // Crear nueva enfermedad en el catálogo
                        var nuevaEnfermedadCatalogo = new EnfermedadCatalogo
                        {
                            Descripcion = enfermedadDto.descripcion,
                            NoTipo = enfermedadDto.noTipo.Value
                        };

                        _contextoBasedeDatos.EnfermedadCatalogos.Add(nuevaEnfermedadCatalogo);
                        await _contextoBasedeDatos.SaveChangesAsync();
                        idEnfermedad = nuevaEnfermedadCatalogo.IdEnfermedad;
                    }
                }
                else
                {
                    // Validar que la enfermedad existe en el catálogo
                    var enfermedadCatalogo = await _contextoBasedeDatos.EnfermedadCatalogos
                        .FirstOrDefaultAsync(e => e.IdEnfermedad == idEnfermedad);

                    if (enfermedadCatalogo == null)
                        throw new Exception("El catálogo de enfermedad especificado no existe.");
                }

                // Verificar que la enfermedad no esté ya asignada a esa sucursal
                var enfermedadSucursalExistente = await _contextoBasedeDatos.Enfermedades
                    .FirstOrDefaultAsync(e => e.idEnfermedad == idEnfermedad && e.identificador == enfermedadDto.identificador);

                if (enfermedadSucursalExistente != null)
                    throw new Exception("Esta enfermedad ya está asignada a esa sucursal.");

                // Asignar enfermedad a la sucursal
                var nuevaEnfermedad = new EnfermedadSucursal
                {
                    identificador = enfermedadDto.identificador,
                    idEnfermedad = idEnfermedad
                };

                _contextoBasedeDatos.Enfermedades.Add(nuevaEnfermedad);
                int resultado = await _contextoBasedeDatos.SaveChangesAsync();

                // Obtener los datos completos para la respuesta
                var enfermedadCatalogoCompleta = await _contextoBasedeDatos.EnfermedadCatalogos
                    .FirstOrDefaultAsync(e => e.IdEnfermedad == idEnfermedad);

                return new AgregarEnfermedadConCatalogoResponseDto
                {
                    NoEnfermedad = nuevaEnfermedad.numeroEnfermedad,
                    RegistrosActualizados = resultado,
                    Descripcion = enfermedadCatalogoCompleta?.Descripcion ?? string.Empty,
                    Identificador = enfermedadDto.identificador
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al agregar la enfermedad a la sucursal.", ex);
            }
        }
    }
}
