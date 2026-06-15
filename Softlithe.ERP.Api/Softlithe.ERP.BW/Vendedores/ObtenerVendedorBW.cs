using System.Collections.Generic;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Vendedores;

namespace Softlithe.ERP.BW.Vendedores;

public class ObtenerVendedorBW : IObtenerVendedorBW
{
    private readonly IObtenerVendedorDA _obtenerVendedorDA;
    private readonly IErrorLogger _logger;

    public ObtenerVendedorBW(IObtenerVendedorDA obtenerVendedorDA, IErrorLogger errorLogger)
    {
        _obtenerVendedorDA = obtenerVendedorDA;
        _logger = errorLogger;
    }

    public async Task<VendedorConModeloDeValidacion> ObtenerVendedores(ParametroConsultaVendedor parametro)
    {
        if (parametro.Identificador <= 0)
        {
            return new VendedorConModeloDeValidacion
            {
                ListaVendedores = new List<VendedorDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                EsCorrecto = false,
            };
        }

        try
        {
            List<VendedorDto> lista =
                await _obtenerVendedorDA.ObtenerVendedores(parametro.Identificador, parametro.Descripcion);
            return new VendedorConModeloDeValidacion
            {
                ListaVendedores = lista,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new VendedorConModeloDeValidacion
            {
                ListaVendedores = new List<VendedorDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
            };
        }
    }

    public async Task<VendedorConModeloDeValidacion> ObtenerVendedorPorUsuario(ParametroConsultaVendedorPorUsuario parametro)
    {
        if (parametro.Identificador <= 0)
        {
            return new VendedorConModeloDeValidacion
            {
                ListaVendedores = new List<VendedorDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                EsCorrecto = false,
            };
        }

        if (parametro.IdUsuario <= 0)
        {
            return new VendedorConModeloDeValidacion
            {
                ListaVendedores = new List<VendedorDto>(),
                Mensaje = "El id de usuario es requerido.",
                EsCorrecto = false,
            };
        }

        try
        {
            VendedorDto? uno =
                await _obtenerVendedorDA.ObtenerVendedorPorUsuario(parametro.Identificador, parametro.IdUsuario);
            List<VendedorDto> lista = uno == null ? new List<VendedorDto>() : new List<VendedorDto> { uno };
            return new VendedorConModeloDeValidacion
            {
                ListaVendedores = lista,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new VendedorConModeloDeValidacion
            {
                ListaVendedores = new List<VendedorDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
            };
        }
    }
}
