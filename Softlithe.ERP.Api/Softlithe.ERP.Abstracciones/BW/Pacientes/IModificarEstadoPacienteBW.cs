using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes
{
    public interface IModificarEstadoPacienteBW
    {
        Task<ModeloValidacion> ModificaEstadoPaciente(PacienteInActivaDto pacienteInActivaDto);
    }
}
