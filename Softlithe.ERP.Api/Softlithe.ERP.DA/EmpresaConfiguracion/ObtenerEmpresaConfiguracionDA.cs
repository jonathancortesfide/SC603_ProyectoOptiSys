using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion;
using Softlithe.ERP.Abstracciones.DA.EmpresaConfiguracion;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.EmpresaConfiguracion
{
    public class ObtenerEmpresaConfiguracionDA : IObtenerEmpresaConfiguracionDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerEmpresaConfiguracionDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contexto = contextoBasedeDatos;
        }

        public async Task<List<ActividadEconomicaEmpresaDto>> ObtenerActividadesEconomicasPorIdentificador(int identificador)
        {
            try
            {
                return await _contexto.EmpresaActividadEconomicas
                    .AsNoTracking()
                    .Where(x => x.Identificador == identificador && x.Activo)
                    .Select(x => new ActividadEconomicaEmpresaDto
                    {
                        CodigoActividad = x.CodigoActividad,
                        Descripcion = x.Descripcion,
                        Activo = x.Activo,
                        ValorPorDefecto = x.ValorPorDefecto
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener las actividades económicas de la empresa: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }

        public async Task<ParametroFacturacionEmpresaDto?> ObtenerParametroFacturacionPorIdentificador(int identificador)
        {
            try
            {
                ParametroFacturacionEmpresa? entidad = await _contexto.ParametroFacturacionEmpresas
                    .AsNoTracking()
                    .Where(x => x.Identificador == identificador)
                    .OrderByDescending(x => x.NoParametroFacturacionEmpresa)
                    .FirstOrDefaultAsync();

                if (entidad == null)
                {
                    return null;
                }

                return new ParametroFacturacionEmpresaDto
                {
                    NoParametroFacturacionEmpresa = entidad.NoParametroFacturacionEmpresa,
                    Identificador = entidad.Identificador,
                    CodigoSeguridad = entidad.CodigoSeguridad,
                    UsuarioCertificado = entidad.UsuarioCertificado,
                    ContrasenaCertificado = entidad.ContrasenaCertificado,
                    AmbienteCertificado = entidad.AmbienteCertificado,
                    CorreoEmisor = entidad.CorreoEmisor,
                    ContrasenaCorreo = entidad.ContrasenaCorreo,
                    Pin = entidad.Pin,
                    RutaCertificado = entidad.RutaCertificado,
                    Host = entidad.Host,
                    Puerto = entidad.Puerto,
                    MensajeFactura = entidad.MensajeFactura,
                    CorreoReceptor = entidad.CorreoReceptor,
                    ContrasenaCorreoReceptor = entidad.ContrasenaCorreoReceptor,
                    HostReceptor = entidad.HostReceptor,
                    PuertoReceptor = entidad.PuertoReceptor,
                    SeguridadSslReceptor = entidad.SeguridadSslReceptor,
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener los parámetros de facturación de la empresa: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }
    }
}
