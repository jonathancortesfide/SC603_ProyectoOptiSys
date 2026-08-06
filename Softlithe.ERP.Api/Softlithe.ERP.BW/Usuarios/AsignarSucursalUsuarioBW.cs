using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Usuarios;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;

namespace Softlithe.ERP.BW.Usuarios;

public class AsignarSucursalUsuarioBW : IAsignarSucursalUsuarioBW
{
    private readonly IAsignarSucursalUsuarioDA _da;
    private readonly IErrorLogger _logger;

    public AsignarSucursalUsuarioBW(IAsignarSucursalUsuarioDA da, IErrorLogger logger)
    {
        _da = da;
        _logger = logger;
    }

    public async Task<ModeloValidacion> AsignarSucursal(AsignarSucursalUsuarioDto dto)
    {
        if (dto.IdUsuario <= 0 || dto.Identificador <= 0)
            return new ModeloValidacion
            {
                EsCorrecto = false,
                Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
            };

        try
        {
            return await _da.AsignarSucursal(dto);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new ModeloValidacion
            {
                EsCorrecto = false,
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
            };
        }
    }
}
