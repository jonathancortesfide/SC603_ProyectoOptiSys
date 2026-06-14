using Softlithe.ERP.Abstracciones.BW.Seguridad.Secciones;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Secciones;

namespace Softlithe.ERP.BW.Seguridad.Secciones
{
    public class ObtenerSeccionesBW : IObtenerSeccionesBW
    {
        private readonly IObtenerSeccionesDA _da;
        public ObtenerSeccionesBW(IObtenerSeccionesDA da) => _da = da;

        public async Task<SeccionConModeloDeValidacion> ObtenerSecciones()
        {
            try
            {
                var lista = await _da.ObtenerSecciones();
                return new SeccionConModeloDeValidacion { EsCorrecto = true, Mensaje = "OK", Secciones = lista };
            }
            catch (Exception ex)
            {
                return new SeccionConModeloDeValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class AgregarSeccionBW : IAgregarSeccionBW
    {
        private readonly IAgregarSeccionDA _da;
        public AgregarSeccionBW(IAgregarSeccionDA da) => _da = da;

        public async Task<ModeloValidacion> AgregarSeccion(AgregarSeccionDto Dto)
        {
            try
            {
                return await _da.AgregarSeccion(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class ModificarEstadoSeccionBW : IModificarEstadoSeccionBW
    {
        private readonly IModificarEstadoSeccionDA _da;
        public ModificarEstadoSeccionBW(IModificarEstadoSeccionDA da) => _da = da;

        public async Task<ModeloValidacion> ModificarEstadoSeccion(ModificarEstadoSeccionDto Dto)
        {
            try
            {
                return await _da.ModificarEstadoSeccion(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }
}
