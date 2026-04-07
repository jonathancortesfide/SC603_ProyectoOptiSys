
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Comunes;
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Parametro;
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Resultado;
using Softlithe.ERP.Abstracciones.DA;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Datos_Facturacion_Electronica
{
    public class ObtenerOpcionesPemitidasDA : IObtenerOpcionesPemitidasDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        public ObtenerOpcionesPemitidasDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

 

        public Task<RespuestaObtenerOpcionesPermitidosUsuario> ObtenerListaOpcionesPermitidasUsuario(ParametroOpcionesPermitidas prmOpcionesPermitidas)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Opciones>> ObetenerListaOpcionesModulo(ParametroOpcionesPermitidas prmOpcionesPermitidas)
        {
            
            IEnumerable<Opciones> lstopciones = (from seguridadopcion in _contextoBasedeDatos.SeguridadOpciones
                                        where seguridadopcion.Identificador == prmOpcionesPermitidas.identificador
                                        && seguridadopcion.NoModulo == prmOpcionesPermitidas.codigoModulo
                                        select new Opciones
                                        {
                                            numeroOpcion = seguridadopcion.NoOpcion,
                                            descripcionOpcion = seguridadopcion.Descripcion
                                            
                                           
                                        }).ToList();

            return await Task.FromResult(lstopciones);

        }

        
    }
}
