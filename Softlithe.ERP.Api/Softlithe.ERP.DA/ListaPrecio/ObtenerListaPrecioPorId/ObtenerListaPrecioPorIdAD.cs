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

        public async Task<List<ListaPrecioDto>> Obtener(string descripcion, int identificador)
        {
            try
            {
                var query = _contextoBasedeDatos.ListaPrecioContexto
                    .Join(
                        _contextoBasedeDatos.MonedasSucursal,
                        l => l.IdMoneda,
                        ms => ms.idMoneda,
                        (l, ms) => new { l, ms }
                    )
                    .Where(x => x.ms.identificador == identificador
                                && (string.IsNullOrEmpty(descripcion)
                                    || EF.Functions.Like(x.l.Descripcion, $"%{descripcion}%")))
                    .Select(x => new ListaPrecioDto
                    {
                        descripcion = x.l.Descripcion,
                        id_moneda = x.l.IdMoneda,
                        no_lista = x.l.NoLista,
                        Activo = x.l.Activo,
                        descripcionMoneda = x.ms.Moneda.descripcion,
                        ValorPorDefecto = x.l.ValorPorDefecto
                    });

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener las listas de precios por descripción.", ex);
            }
        }



    }
}
