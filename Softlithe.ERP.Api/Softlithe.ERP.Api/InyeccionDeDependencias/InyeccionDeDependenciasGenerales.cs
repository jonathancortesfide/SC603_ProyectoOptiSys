using Softlithe.ERP.Abstracciones.BC.Generico;
using Softlithe.ERP.Abstracciones.BW.Examenes.AgregarExamen;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarPaciente;
using Softlithe.ERP.Abstracciones.BW.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.Examenes.AgregarExamen;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarPaciente;
using Softlithe.ERP.Abstracciones.DA.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.Abstracciones.DA;
using Softlithe.ERP.BW.Examenes.AgregarExamen;
using Softlithe.ERP.BW.Generico;
using Softlithe.ERP.BW.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.BW.Pacientes.AgregarPaciente;
using Softlithe.ERP.BW.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.BW.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.DA.Datos_Facturacion_Electronica;
using Softlithe.ERP.DA.Examenes.AgregarExamen;
using Softlithe.ERP.DA.Modelos;
using Softlithe.ERP.DA.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.DA.Pacientes.AgregarPaciente;
using Softlithe.ERP.DA.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.DA.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.Fecha;
using Softlithe.ERP.BW.Generales.Fecha;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.BW.Generales.ManejoDeErrores.Composite;

namespace Softlithe.ERP.Api.Inyeccion
{
	internal static class InyeccionDeDependenciasGenerales
	{
		internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
		{
			//Base de datos y configuraciones
			services.AddScoped<IConexionABaseDeDatos, ConexionABaseDeDatos>();

			// 
			services.AddScoped<IObtenerOpcionesPemitidasDA, ObtenerOpcionesPemitidasDA>();
			services.AddScoped<IValidarDatoGenericoBC, ValidarDatoGenericoBC>();
			services.AddScoped<IGestionDeFecha, GestionDeFecha>();
			services.AddScoped<IAgregarEventoBitacoraBW, AgregarEventoBitacoraBW>();

			//Bitacora
			services.AddScoped<IAgregarEventoBitacoraDA, AgregarEventoBitacoraDA>();

			//Gestion de eventos de bitacora composite
			services.AddScoped<IInternalErrorLogger, BaseDeDatosLoggerBW>();
			services.AddScoped<IInternalErrorLogger, EventViewerLoggerBW>();
			services.AddScoped<IInternalErrorLogger, FileEventLoggerBW>();

			// El composite es el único IErrorLogger
			services.AddScoped<IErrorLogger, CompositeLogger>();

			return services;
		}
	}
}
