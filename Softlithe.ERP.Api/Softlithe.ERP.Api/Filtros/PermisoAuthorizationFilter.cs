using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Softlithe.ERP.Api.Filtros;

/// <summary>
/// Lee los claims "permiso" del JWT y verifica que el código requerido esté presente.
/// No realiza ninguna consulta a la base de datos — los permisos viajan firmados en el token.
/// </summary>
public sealed class PermisoAuthorizationFilter : IAsyncAuthorizationFilter
{
    private readonly string _codigo;

    public PermisoAuthorizationFilter(string codigo)
    {
        _codigo = codigo;
    }

    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedResult();
            return Task.CompletedTask;
        }

        var tienePermiso = user.Claims
            .Where(c => c.Type == "permiso")
            .Any(c => string.Equals(c.Value, _codigo, StringComparison.OrdinalIgnoreCase));

        if (!tienePermiso)
        {
            context.Result = new ObjectResult(new { error = $"Sin permiso: {_codigo}" })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }

        return Task.CompletedTask;
    }
}
