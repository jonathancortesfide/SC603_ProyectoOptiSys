using Softlithe.ERP.Abstracciones.Contenedores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BC.Generico
{
    public interface IValidarDatoGenericoBC
    {
        Task<ModeloValidacion> ValidarDatoBooleanoFalse(bool valorBooleano, Enum valorConstateMensajeValidacion);
        Task<ModeloValidacion> ValidarDatoStringVacio(string valorAlfanumerico, Enum valorConstateMensajeValidacion);
    }
}
