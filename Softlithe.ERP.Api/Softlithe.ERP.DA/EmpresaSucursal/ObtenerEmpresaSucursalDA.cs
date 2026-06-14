using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal;
using Softlithe.ERP.Abstracciones.DA.EmpresaSucursal;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.EmpresaSucursal
{
    public class ObtenerEmpresaSucursalDA : IObtenerEmpresaSucursalDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerEmpresaSucursalDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<List<EmpresaDto>> ObtenerEmpresasPorEmailUsuario(string email)
        {
            try
            {
                var consulta = from u in _contextoBasedeDatos.Usuarios
                               where u.Email == email
                               join ues in _contextoBasedeDatos.UsuarioEmpresaSucursales on u.IdUsuario equals ues.IdUsuario
                               join es in _contextoBasedeDatos.EmpresaSucursales on ues.Identificador equals es.Identificador
                               join e in _contextoBasedeDatos.Empresas on es.NoEmpresa equals e.NoEmpresa
                               select new EmpresaDto
                               {
                                   NoEmpresa = e.NoEmpresa,
                                   Imagen = e.Imagen,
                                   Nombre = e.Nombre,
                                   Direccion = e.Direccion,
                                   Telefono1 = e.Telefono1,
                                   Telefono2 = e.Telefono2,
                                   Email = e.Email,
                                   Url = e.Url,
                                   Cedula = e.Cedula,
                                   DetalleCuentasBancaria = e.DetalleCuentasBancaria
                               };

                List<EmpresaDto> lista = await consulta.ToListAsync();
                return lista.DistinctBy(x => x.NoEmpresa).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener las empresas del usuario: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }

        public async Task<List<SucursalDto>> ObtenerSucursalesPorEmailUsuario(string email, int noEmpresa)
        {
            try
            {
                var consulta = from u in _contextoBasedeDatos.Usuarios
                               where u.Email == email && u.UsuarioEmpresaSucursales.Any(ues => ues.EmpresaSucursal.NoEmpresa == noEmpresa)
                               join ues in _contextoBasedeDatos.UsuarioEmpresaSucursales on u.IdUsuario equals ues.IdUsuario
                               join es in _contextoBasedeDatos.EmpresaSucursales on ues.Identificador equals es.Identificador
                               join s in _contextoBasedeDatos.Sucursales on es.NoSucursal equals s.NoSucursal
                               where es.NoEmpresa == noEmpresa
                               select new SucursalDto
                               {
                                   Identificador = es.Identificador,
                                   NoSucursal = s.NoSucursal,
                                   Imagen = s.Imagen,
                                   Nombre = s.Nombre,
                                   Direccion = s.Direccion,
                                   Telefono1 = s.Telefono1,
                                   Telefono2 = s.Telefono2,
                                   Fax = s.Fax,
                                   Email = s.Email,
                                   Url = s.Url,
                                   Siglas = s.Siglas,
                                   Facebook = s.Facebook
                               };

                List<SucursalDto> lista = await consulta.ToListAsync();
                return lista.DistinctBy(x => x.Identificador).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener las sucursales del usuario: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }

        public async Task<ParametroFacturacionSucursalDto?> ObtenerParametroFacturacionSucursalPorIdentificador(int identificador)
        {
            try
            {
                var consulta =
                    from p in _contextoBasedeDatos.ParametroFacturacionSucursales.AsNoTracking()
                    where p.Identificador == identificador
                    join b in _contextoBasedeDatos.Bodegas.AsNoTracking() on p.NoBodega equals b.NoBodega into bJoin
                    from b in bJoin.DefaultIfEmpty()
                    orderby p.NoParametroFacturacionSucursal descending
                    select new ParametroFacturacionSucursalDto
                    {
                        NoParametroFacturacionSucursal = p.NoParametroFacturacionSucursal,
                        Identificador = p.Identificador,
                        CodigoEstablecimiento = p.CodigoEstablecimiento,
                        CodigoTerminal = p.CodigoTerminal,
                        CodigoProvincia = p.CodigoProvincia,
                        CodigoCanton = p.CodigoCanton,
                        CodigoDistrito = p.CodigoDistrito,
                        CodigoBarrio = p.CodigoBarrio,
                        OtrasSenas = p.OtrasSenas,
                        NoBodega = p.NoBodega,
                        NombreBodega = b != null ? b.Descripcion : null,
                    };

                return await consulta.FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener los parámetros de facturación de la sucursal: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }
    }
}
