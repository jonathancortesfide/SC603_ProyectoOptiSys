using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Graduaciones.ObtenerGraduacionPorIdentificador
{
    public interface IObtenerGraduacionPorIdentificadorAD
    {
        Task<GraduacionAgrupadaDto> Obtener(int identificador);
    }
}