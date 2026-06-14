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
        private ModeloValidacion ConstruirRespuestaExitosa(int registrosAfectados, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (registrosAfectados > 0 ? "Tipo de lente modificado correctamente." : "Error al modificar el tipo de lente.") + (errorBitacora == 0 ? " Error al guardar en bitácora." : string.Empty),
                EsCorrecto = registrosAfectados > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(TipoLenteDto tipoLente, int registrosAfectados)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = registrosAfectados > 0 ? "Tipo de lente modificado correctamente. Descripción Tipo de lente: " + tipoLente.descripcion : "Error al modificar el Tipo de lente. Descripción Tipo de lente: " + tipoLente.descripcion,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificarTipoLente),
                tabla = "TipoLente",
                idBitacora = Guid.NewGuid(),
                identificador = tipoLente.Identificador,
                usuario = tipoLente.Usuario
            });
        }
    }
}
