using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.AgregarTipoLente;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.TipoLente.AgregarTipoLente
{
    public class AgregarTipoLenteAD : IAgregarTipoLenteAD
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public AgregarTipoLenteAD(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }
        public async Task<int> Agregar(TipoLenteDto elNuevoTipoLente)
        {
            try
            {
                TipoLenteAD elTipoLenteNuevo = ConvertirPacienteModelo(elNuevoTipoLente);
                _contextoBasedeDatos.TipoLente.Add(elTipoLenteNuevo);
                int cantidadDeDatosGuardados = await _contextoBasedeDatos.SaveChangesAsync();
                return cantidadDeDatosGuardados;
            }
            catch (Exception ex)
            {
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Error al agregar el tipo de lente: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.InnerException?.Message);
            }
        }

        private TipoLenteAD ConvertirPacienteModelo(TipoLenteDto elNuevoTipoLente)
        {
            return new TipoLenteAD
            {

                NoTipo = elNuevoTipoLente.no_tipo,
                Descripcion = elNuevoTipoLente.descripcion,
                NoEmpresa = elNuevoTipoLente.no_empresa,
                Activo = elNuevoTipoLente.Activo

            };


        }
    }
}
