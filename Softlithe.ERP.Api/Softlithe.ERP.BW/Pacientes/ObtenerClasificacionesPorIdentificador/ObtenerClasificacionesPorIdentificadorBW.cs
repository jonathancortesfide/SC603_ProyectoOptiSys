using Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerClasificacionesPorIdentificador;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerClasificacionesPorIdentificador;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.ObtenerClasificacionesPorIdentificador
{
    public class ObtenerClasificacionesPorIdentificadorBW : IObtenerClasificacionesPorIdentificadorBW
    {
        private readonly IObtenerClasificacionesPorIdentificadorDA _da;

        public ObtenerClasificacionesPorIdentificadorBW(IObtenerClasificacionesPorIdentificadorDA da)
        {
            _da = da;
        }

        public async Task<PacienteClasificacionConModeloDeValidacion> ObtenerPorIdentificador(int identificador)
        {
            var resultado = new PacienteClasificacionConModeloDeValidacion() { Mensaje = string.Empty };
            try
            {
                var lista = await _da.ObtenerPorIdentificador(identificador);
                resultado.laListaDeClasificaciones = lista;
                resultado.EsCorrecto = true;
                resultado.Mensaje = "Consulta realizada correctamente";
                return resultado;
            }
            catch (System.Exception ex)
            {
                resultado.EsCorrecto = false;
                resultado.Mensaje = "Ocurrió un error al obtener las clasificaciones: " + ex.Message;
                return resultado;
            }
        }
    }
}
