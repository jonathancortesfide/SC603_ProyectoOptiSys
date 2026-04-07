using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.DA.Modelos;


namespace Softlithe.ERP.DA.ListaPrecio.AgregarListaPrecio
{
    public class AgregarListaPrecioAD : IAgregarListaPrecioAD
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public AgregarListaPrecioAD(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<int> Agregar(ListaPrecioDto laNuevaListaPrecio)

        {
            try
            {
                ListaPrecioAD laListaNuevaPrecio = ConvertirListaModelo(laNuevaListaPrecio);
                _contextoBasedeDatos.ListaPrecioContexto.Add(laListaNuevaPrecio);
                int cantidadDeDatosGuardados = await _contextoBasedeDatos.SaveChangesAsync();
                return cantidadDeDatosGuardados;
            }
            catch (Exception ex)
            {
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Error al agregar la lista de precio: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.InnerException?.Message);
            }

        }
        private ListaPrecioAD ConvertirListaModelo(ListaPrecioDto laListaNuevaPrecio)
        {
            return new ListaPrecioAD
            {

                // NoLista = laListaNuevaPrecio.no_lista, este no porque lo agrega la db 
                Descripcion = laListaNuevaPrecio.descripcion,
                IdMoneda = laListaNuevaPrecio.id_moneda,
                Activo = laListaNuevaPrecio.Activo,
                //Usuario = laListaNuevaPrecio.Usuario,
                //Identificador = laListaNuevaPrecio.Identificador


            };


        }
    }
}
 