using Novell.Directory.Ldap.Rfc2251;
using Softlithe.ERP.Abstracciones.BW.TipoLente.AgregarTipoLente;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.AgregarTipoLente;
using Softlithe.ERP.DA.TipoLente.AgregarTipoLente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.TipoLente.AgregarTipoLente
{
    public class AgregaTipoLenteBW : IAgregarTipoLenteBW
    {
        private readonly IAgregarTipoLenteAD _agregaTipoLenteAD;

        public AgregaTipoLenteBW (IAgregarTipoLenteAD agregaTipoLenteAD)
        {
            _agregaTipoLenteAD = agregaTipoLenteAD;
        }

        public async Task<ModeloValidacion> Agregar(TipoLenteDto tipoLenteDto)
        {
            ModeloValidacion elModeloDeValidacion = ConvierteAModeloDeValidacion(false, "No se realizo ningun registro");
            tipoLenteDto.Activo = true; // Establecer el estado como activo al agregar un nuevo tipo de lente
            int cantidadDeDatosAgregados = await _agregaTipoLenteAD.Agregar(tipoLenteDto);
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
