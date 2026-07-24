using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Examenes
{
    public interface IExamenSnapshotBW
    {
        Task<ModeloValidacionConDatos<ExamenSnapshotDto>> ObtenerPorNoExamen(int noExamen);

        Task<ModeloValidacionConDatos<bool>> Crear(ExamenSnapshotDto examenSnapshot);
    }
}
