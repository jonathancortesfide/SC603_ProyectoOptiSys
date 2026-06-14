using Softlithe.ERP.Abstracciones.BC.Pacientes;
using Softlithe.ERP.Abstracciones.BW.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes;
using Softlithe.ERP.BC.Pacientes;
using Softlithe.ERP.BW.Pacientes;
using Softlithe.ERP.DA.PacientesClasificacion.AgregarClasificacion;
using Softlithe.ERP.DA.PacientesClasificacion.CambiarEstadoClasificacion;
using Softlithe.ERP.DA.PacientesClasificacion.ModificarClasificacion;
using Softlithe.ERP.DA.PacientesClasificacion.ObtenerClasificacionesPorIdentificador;
using Softlithe.ERP.DA.Pacientes;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciasPacientes
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            services.AddScoped<IPacienteRepository, PacienteRepository>();
            services.AddScoped<IPacienteBC, PacienteBC>();
            services.AddScoped<IObtenerPacienteBW, ObtenerPacienteBW>();
            services.AddScoped<IAgregarPacienteBW, AgregarPacienteBW>();
            services.AddScoped<IModificarPacienteBW, ModificarPacienteBW>();
            services.AddScoped<IModificarEstadoPacienteBW, ModificarEstadoPacienteBW>();

            //Inyeccion de PacienteClasificacion
            services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerClasificacionesPorIdentificador.IObtenerClasificacionesPorIdentificadorDA, ObtenerClasificacionesPorIdentificadorDA>();
            services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerClasificacionesPorIdentificador.IObtenerClasificacionesPorIdentificadorBW, Softlithe.ERP.BW.Pacientes.ObtenerClasificacionesPorIdentificador.ObtenerClasificacionesPorIdentificadorBW>();

            services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarClasificacion.IAgregarClasificacionDA, AgregarClasificacionDA>();
            services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarClasificacion.IAgregarClasificacionBW, Softlithe.ERP.BW.Pacientes.AgregarClasificacion.AgregarClasificacionBW>();

            services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.ModificarClasificacion.IModificarClasificacionDA, ModificarClasificacionDA>();
            services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.ModificarClasificacion.IModificarClasificacionBW, Softlithe.ERP.BW.Pacientes.ModificarClasificacion.ModificarClasificacionBW>();

            services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.CambiarEstadoClasificacion.ICambiarEstadoClasificacionDA, CambiarEstadoClasificacionDA>();
            services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.CambiarEstadoClasificacion.ICambiarEstadoClasificacionBW, Softlithe.ERP.BW.Pacientes.CambiarEstadoClasificacion.CambiarEstadoClasificacionBW>();

            return services;
        }
    }
}
