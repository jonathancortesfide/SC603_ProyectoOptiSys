using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ModificarListaPrecio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.ListaPrecio.ModificarListaPrecio
{
    public class ModificarListaPrecioBW : IModificarListaPrecioBW
    {
        private readonly IModificarListaPrecioDA _modificarListaPrecioDA;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public ModificarListaPrecioBW(IModificarListaPrecioDA modificarListaPrecioDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
        {
            _modificarListaPrecioDA = modificarListaPrecioDA;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> ModificarListaPrecio(ListaPrecioDto listaPrecioDto)
        {
            try
            {
                int resultado = await _modificarListaPrecioDA.ModificarListaPrecio(listaPrecioDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(listaPrecioDto, resultado);
                return ConstruirRespuestaExitosa(resultado, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, 1);
            }
        }
          
        private ModeloValidacion ConstruirRespuestaExitosa(int no_marcaIncluida, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (no_marcaIncluida == 0 ? MensajeDeListaPreciosDto.ErrorAlCrearListaPrecio : MensajeDeListaPreciosDto.ErrorAlActualizarListaPrecio) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = no_marcaIncluida > 0
            };
        }

        //pendinte consultar un par de cosas 
        private async Task<int> AgregarEventoBitacoraCorrecto(ListaPrecioDto listaPrecioDto, int no_marcaIncluida)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = no_marcaIncluida > 0 ? "Lista de Precio modificada correctamente. Descripción Lista de Precio: " + listaPrecioDto.descripcion : "Error al modificar la Lista de Precio. Descripción Lista de Precio: " + listaPrecioDto.descripcion,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificarListaPrecio),
                tabla = "ListaPrecio",
                idBitacora = Guid.NewGuid(),
                identificador = listaPrecioDto.Identificador,//pendinteconsultar,
                usuario = listaPrecioDto.Usuario//pendinteconsultar
            });
        }

    }
}

