using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Comunes;
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Parametro;
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Resultado;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA
{
    public interface IObtenerOpcionesPemitidasDA
    {
        Task<IEnumerable<Opciones>> ObetenerListaOpcionesModulo(ParametroOpcionesPermitidas prmOpcionesPermitidas);

        Task<RespuestaObtenerOpcionesPermitidosUsuario> ObtenerListaOpcionesPermitidasUsuario(ParametroOpcionesPermitidas prmOpcionesPermitidas);
    
    
    }
}
