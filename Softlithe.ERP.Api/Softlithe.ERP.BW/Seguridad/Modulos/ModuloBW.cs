using Softlithe.ERP.Abstracciones.BW.Seguridad.Modulos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Modulos;

namespace Softlithe.ERP.BW.Seguridad.Modulos
{
    public class ObtenerModulosBW : IObtenerModulosBW
    {
        private readonly IObtenerModulosDA _da;
        public ObtenerModulosBW(IObtenerModulosDA da) => _da = da;

        public async Task<ModuloConModeloDeValidacion> ObtenerModulos()
        {
            try
            {
                var lista = await _da.ObtenerModulos();
                return new ModuloConModeloDeValidacion { EsCorrecto = true, Mensaje = "OK", Modulos = lista };
            }
            catch (Exception ex)
            {
                return new ModuloConModeloDeValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class AgregarModuloBW : IAgregarModuloBW
    {
        private readonly IAgregarModuloDA _da;
        public AgregarModuloBW(IAgregarModuloDA da) => _da = da;

        public async Task<ModeloValidacion> AgregarModulo(AgregarModuloDto Dto)
        {
            try
            {
                return await _da.AgregarModulo(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class ModificarEstadoModuloBW : IModificarEstadoModuloBW
    {
        private readonly IModificarEstadoModuloDA _da;
        public ModificarEstadoModuloBW(IModificarEstadoModuloDA da) => _da = da;

        public async Task<ModeloValidacion> ModificarEstadoModulo(ModificarEstadoModuloDto Dto)
        {
            try
            {
                return await _da.ModificarEstadoModulo(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }
}
