using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerClasificacionesPorIdentificador
{
    public interface IObtenerClasificacionesPorIdentificadorBW
    {
        Task<PacienteClasificacionConModeloDeValidacion> ObtenerPorIdentificador(int no_empresa);
    }
}
