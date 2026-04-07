using Softlithe.ERP.Abstracciones.BW.Grupos.ObtenerGruposPorEmpresa;
using Softlithe.ERP.Abstracciones.DA.Grupos.ObtenerGruposPorEmpresa;
using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Grupos.ObtenerGruposPorEmpresa
{
    public class ObtenerGruposPorEmpresaBW : IObtenerGruposPorEmpresaBW
    {
        private readonly IObtenerGruposPorEmpresaDA _da;

        public ObtenerGruposPorEmpresaBW(IObtenerGruposPorEmpresaDA da)
        {
            _da = da;
        }

        public async Task<GrupoConModeloDeValidacion> ObtenerPorEmpresa(int no_empresa)
        {
            var resultado = new GrupoConModeloDeValidacion() { Mensaje = string.Empty };
            try
            {
                var lista = await _da.ObtenerPorEmpresa(no_empresa);
                resultado.laListaDeGrupos = lista;
                resultado.EsCorrecto = true;
                resultado.Mensaje = "Consulta realizada correctamente";
                return resultado;
            }
            catch (System.Exception ex)
            {
                resultado.EsCorrecto = false;
                resultado.Mensaje = "Ocurrió un error al obtener los grupos: " + ex.Message;
                return resultado;
            }
        }
    }
}
