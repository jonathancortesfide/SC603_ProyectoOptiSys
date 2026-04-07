using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ObetenerListaPrecioPorID;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.ListaPrecio.ObtenerListaPrecioPorID
{
    public class ObtenerListaPrecioPorIdAD : IObtenerListaPrecioPorIdAD

    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerListaPrecioPorIdAD(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<List<ListaPrecioDto>> Obtener(int idMoneda)
        {
            try
            {
                List<ListaPrecioDto> listaPrecioDtos = await (from listaPrecios in _contextoBasedeDatos.ListaPrecioContexto
                                                              where listaPrecios.IdMoneda == idMoneda
                    select new ListaPrecioDto
                    {
                        descripcion = listaPrecios.Descripcion,
                        id_moneda = listaPrecios.IdMoneda,
                        no_lista = listaPrecios.NoLista,
                        Activo = listaPrecios.Activo

                    }).ToListAsync();

                return listaPrecioDtos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener las listas de precios por ID de moneda.", ex);
            }
        }

    }
}
