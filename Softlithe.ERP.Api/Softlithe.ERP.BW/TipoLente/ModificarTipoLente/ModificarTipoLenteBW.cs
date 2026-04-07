using Microsoft.Identity.Client;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarTipoLente;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarTipoLente;
using Softlithe.ERP.BW.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.DA.ListaPrecio.ModificarListaPrecio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.TipoLente.ModificarTipoLente
{
    public class ModificarTipoLenteBW : IModificarTipoLenteBW
    {
        readonly IModificarTipoLenteAD _modificarTipoLenteDA;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;
        public ModificarTipoLenteBW(IModificarTipoLenteAD modificarTipoLenteDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
        {
            _modificarTipoLenteDA = modificarTipoLenteDA;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> ModificarTipoLente(TipoLenteDto elTipoLente)
        {
            try
            {
                int resultado = await _modificarTipoLenteDA.ModificarTipoLente(elTipoLente);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(elTipoLente, resultado);
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
                Mensaje = (no_marcaIncluida == 0 ? MensajeDeTipoLenteDto.ErrorAlCrearTipoLente : MensajeDeTipoLenteDto.ErrorAlActualizarTipoLente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = no_marcaIncluida > 0
            };
        }

        //pendinte consultar un par de cosas 
        private async Task<int> AgregarEventoBitacoraCorrecto(TipoLenteDto tipoLente, int no_marcaIncluida)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = no_marcaIncluida > 0 ? "Tipo de lente modificada correctamente. Descripción Tipo de lente: " + tipoLente.descripcion : "Error al modificar la Lista de Precio. Descripción Lista de Precio: " + tipoLente.descripcion,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificarTipoLente),
                tabla = "TipoLente",
                idBitacora = Guid.NewGuid(),
                identificador = tipoLente.Identificador,//pendinteconsultar,
                usuario = tipoLente.Usuario//pendinteconsultar
            });
        }


    }
}
