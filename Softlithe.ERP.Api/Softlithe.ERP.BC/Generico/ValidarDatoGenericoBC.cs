using Bccr.Sugef.AutorizacionUsuario.Abstracciones.Contenedores.Utilitarios;
using Softlithe.FE.Abstracciones.Contenedores.Utilidades.Constantes;
using Softlithe.FE.Abstracciones.Contenedores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.BC.Generico;


namespace Softlithe.ERP.BW.Generico
{
    public class ValidarDatoGenericoBC : IValidarDatoGenericoBC
    {
        private ModeloValidacion modeloValidacion = new ModeloValidacion() { EsCorrecto = true, Mensaje = string.Empty };
        public async Task<ModeloValidacion> ValidarDatoBooleanoFalse(bool valorBooleano, Enum valorConstateMensajeValidacion)
        {
            if (valorBooleano == false)
            {
                modeloValidacion = new ModeloValidacion() { EsCorrecto = false, Mensaje = await Task.Run(() => DescripcionEnum.ObtenerDescripcion(valorConstateMensajeValidacion)) };
            }

            return modeloValidacion;
        }
        public async Task<ModeloValidacion> ValidarDatoStringVacio(string valorAlfanumerico, Enum valorConstateMensajeValidacion)
        {
            if (string.IsNullOrWhiteSpace(valorAlfanumerico))
            {
                modeloValidacion = new ModeloValidacion() { EsCorrecto = false, Mensaje = await Task.Run(() => DescripcionEnum.ObtenerDescripcion(valorConstateMensajeValidacion)) };
            }

            return modeloValidacion;
        }
        // pendinte c rear un emtodo para validar id que no sean 0 
    }
}
