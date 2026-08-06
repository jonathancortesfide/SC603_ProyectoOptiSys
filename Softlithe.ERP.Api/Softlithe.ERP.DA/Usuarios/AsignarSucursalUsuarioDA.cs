using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Usuarios;

public class AsignarSucursalUsuarioDA : IAsignarSucursalUsuarioDA
{
    private readonly ContextoBasedeDatos _contexto;

    public AsignarSucursalUsuarioDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<ModeloValidacion> AsignarSucursal(AsignarSucursalUsuarioDto dto)
    {
        var yaExiste = await _contexto.UsuarioEmpresaSucursales
            .AnyAsync(ues => ues.IdUsuario == dto.IdUsuario && ues.Identificador == dto.Identificador);

        if (yaExiste)
            return new ModeloValidacion { EsCorrecto = false, Mensaje = "El usuario ya tiene asignada esa sucursal." };

        _contexto.UsuarioEmpresaSucursales.Add(new UsuarioEmpresaSucursal
        {
            IdUsuario = dto.IdUsuario,
            Identificador = dto.Identificador,
        });

        await _contexto.SaveChangesAsync();

        return new ModeloValidacion { EsCorrecto = true, Mensaje = "Sucursal asignada correctamente." };
    }
}
