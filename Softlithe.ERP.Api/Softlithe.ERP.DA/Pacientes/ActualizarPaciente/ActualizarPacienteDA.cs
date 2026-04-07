using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ActualizarPaciente;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.ActualizarPaciente
{
	public class ActualizarPacienteDA : IActualizarPacienteDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public ActualizarPacienteDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<bool> Actualizar(int numeroDePaciente, PacienteDto elPaciente)
		{
			try
			{
				var pacienteExistente = await _contextoBasedeDatos.Pacientes.FindAsync(numeroDePaciente);
				if (pacienteExistente == null)
				{
					return false;
				}

				pacienteExistente.no_empresa = elPaciente.noEmpresa;
				pacienteExistente.tipo_identificacion = elPaciente.tipoIdentificacion;
				pacienteExistente.identificacion = elPaciente.identificacion;
				pacienteExistente.nombre = elPaciente.nombre;
				pacienteExistente.fecha_nacimiento = elPaciente.fechaNacimiento;
				pacienteExistente.sexo = elPaciente.sexo;
				pacienteExistente.nacionalidad = elPaciente.nacionalidad;
				pacienteExistente.telefono1 = elPaciente.telefono1;
				pacienteExistente.telefono2 = elPaciente.telefono2;
				pacienteExistente.email1 = elPaciente.email1;
				pacienteExistente.direccion = elPaciente.direccion;
				pacienteExistente.no_envia_factura_electronica = elPaciente.noEnviaFacturaElectronica;
				pacienteExistente.contacto_emergencia_nombre = elPaciente.contactoEmergenciaNombre;
				pacienteExistente.contacto_emergencia_telefono = elPaciente.contactoEmergenciaTelefono;
				pacienteExistente.es_activo = elPaciente.esActivo;
				pacienteExistente.fecha_modificacion = DateTime.Now;

				_contextoBasedeDatos.Pacientes.Update(pacienteExistente);
				await _contextoBasedeDatos.SaveChangesAsync();
				return true;
			}
			catch (Exception)
			{
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw;
			}
		}
	}
}
