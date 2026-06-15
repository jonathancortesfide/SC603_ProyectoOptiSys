using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.AgregarGraduacion;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Graduaciones.AgregarGraduacion;

public class AgregarGraduacionAD : IAgregarGraduacionAD
{
    private readonly ContextoBasedeDatos _contextoBasedeDatos;

    public AgregarGraduacionAD(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contextoBasedeDatos = contextoBasedeDatos;
    }

    public async Task<int> Agregar(GraduacionDto graduacion)
    {
        try
        {
            var entidad = new GraduacionAD
            {
                Identificador = graduacion.Identificador,
                Nombre = graduacion.Nombre,
                Abreviatura = graduacion.Abreviatura,
                DescripcionTecnica = graduacion.DescripcionTecnica,
                Orden = (short)graduacion.Orden,
                Activo = graduacion.Activo,
                IdTipoGraduacion = (short)graduacion.IdTipoGraduacion
            };
            _contextoBasedeDatos.GraduacionContexto.Add(entidad);
            return await _contextoBasedeDatos.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _contextoBasedeDatos.ChangeTracker.Clear();
            throw new Exception("Error al agregar la graduación: " + ex.Message, ex);
        }
    }
}
