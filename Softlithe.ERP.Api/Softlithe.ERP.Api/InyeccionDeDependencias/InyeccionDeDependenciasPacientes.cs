using Softlithe.ERP.Abstracciones.BC.Generico;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.DA;
using Softlithe.ERP.BW.Generico;
using Softlithe.ERP.DA.Datos_Facturacion_Electronica;
using Softlithe.ERP.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.DA.Modelos;
using Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarPaciente;
using Softlithe.ERP.Abstracciones.BW.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarPaciente;
using Softlithe.ERP.Abstracciones.DA.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.BW.Pacientes.AgregarPaciente;
using Softlithe.ERP.BW.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.BW.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.DA.Pacientes.AgregarPaciente;
using Softlithe.ERP.DA.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.DA.Pacientes.ObtenerListaDePacientes;

namespace Softlithe.ERP.Api.Inyeccion
{
	internal static class InyeccionDeDependenciasPacientes
	{
		internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
		{
			//Inyeccion de pacientes
			services.AddScoped<IObtenerListaDePacientesDA, ObtenerListaDePacientesDA>();
			services.AddScoped<IObtenerListaDePacientesBW, ObtenerListaDePacientesBW>();
			services.AddScoped<IAgregarPacienteDA, AgregarPacienteDA>();
			services.AddScoped<IAgregarPacienteBW, AgregarPacienteBW>();
			services.AddScoped<IBuscarPacientePorNombreOIdentificacionDA, BuscarPacientePorNombreOIdentificacionDA>();
			services.AddScoped<IBuscarPacientePorNombreOIdentificacionBW, BuscarPacientePorNombreOIdentificacionBW>();

			//Inyeccion de PacienteClasificacion
			services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerClasificacionesPorIdentificador.IObtenerClasificacionesPorIdentificadorDA, Softlithe.ERP.DA.Pacientes.ObtenerClasificacionesPorIdentificador.ObtenerClasificacionesPorIdentificadorDA>();
			services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerClasificacionesPorIdentificador.IObtenerClasificacionesPorIdentificadorBW, Softlithe.ERP.BW.Pacientes.ObtenerClasificacionesPorIdentificador.ObtenerClasificacionesPorIdentificadorBW>();

			services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarClasificacion.IAgregarClasificacionDA, Softlithe.ERP.DA.Pacientes.AgregarClasificacion.AgregarClasificacionDA>();
			services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarClasificacion.IAgregarClasificacionBW, Softlithe.ERP.BW.Pacientes.AgregarClasificacion.AgregarClasificacionBW>();

			services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.ModificarClasificacion.IModificarClasificacionDA, Softlithe.ERP.DA.Pacientes.ModificarClasificacion.ModificarClasificacionDA>();
			services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.ModificarClasificacion.IModificarClasificacionBW, Softlithe.ERP.BW.Pacientes.ModificarClasificacion.ModificarClasificacionBW>();

			services.AddScoped<Softlithe.ERP.Abstracciones.DA.Pacientes.CambiarEstadoClasificacion.ICambiarEstadoClasificacionDA, Softlithe.ERP.DA.Pacientes.CambiarEstadoClasificacion.CambiarEstadoClasificacionDA>();
			services.AddScoped<Softlithe.ERP.Abstracciones.BW.Pacientes.CambiarEstadoClasificacion.ICambiarEstadoClasificacionBW, Softlithe.ERP.BW.Pacientes.CambiarEstadoClasificacion.CambiarEstadoClasificacionBW>();

			return services;
		}
	}
}
