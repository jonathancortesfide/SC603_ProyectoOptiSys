using Softlithe.ERP.Abstracciones.BW.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.DA.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.ListaPrecio.AgregarListaPrecio
{
    public class AgregarListaPrecioBW : IAgregarListaPrecioBW
    {
        private readonly IAgregarListaPrecioAD _agregarListaPrecioDA;

        public AgregarListaPrecioBW(IAgregarListaPrecioAD agregarListaPrecioDA)
        {
            _agregarListaPrecioDA = agregarListaPrecioDA;
        }
        public async Task<ModeloValidacion> Agregar(ListaPrecioDto listaPrecioDto)
        {
            ModeloValidacion elModeloDeValidacion = ConvierteAModeloDeValidacion(false, "No se realizo ningun registro");
            listaPrecioDto.Activo= true; // Establecer el estado como activo al agregar una nueva lista de precios sobre ecribiendo lo que le mande el api 
            int cantidadDeDatosAgregados = await _agregarListaPrecioDA.Agregar(listaPrecioDto);
            if (cantidadDeDatosAgregados == 1)
            {
                elModeloDeValidacion = ConvierteAModeloDeValidacion(true, "Registro exitoso");
            }
            return elModeloDeValidacion;
        }

        private ModeloValidacion ConvierteAModeloDeValidacion(bool esCorrecto, string mensaje)
        {
            return new ModeloValidacion
            {
                Mensaje = mensaje,
                EsCorrecto = esCorrecto
            };
        }
    }
    
}
