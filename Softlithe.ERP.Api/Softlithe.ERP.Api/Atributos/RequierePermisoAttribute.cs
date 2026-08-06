using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Api.Filtros;

namespace Softlithe.ERP.Api.Atributos;

/// <summary>
/// Exige que el JWT del usuario contenga el claim "permiso" con el <paramref name="codigo"/> indicado.
/// Los claims de permiso se inyectan en el token al momento del login.
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public sealed class RequierePermisoAttribute : TypeFilterAttribute
{
    public RequierePermisoAttribute(string codigo) : base(typeof(PermisoAuthorizationFilter))
    {
        Arguments = new object[] { codigo };
    }
}
