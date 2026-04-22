using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerClasificacionesPorIdentificador
{
    public interface IObtenerClasificacionesPorIdentificadorDA
    {
        Task<List<PacienteClasificacionDto>> ObtenerPorIdentificador(int no_empresa);
    }
}
