using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarPaciente;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.AgregarPaciente
{
	public class AgregarPacienteDA: IAgregarPacienteDA
	{

		private readonly ContextoBasedeDatos _contextoBasedeDatos;
		public AgregarPacienteDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<int> Agregar(PacienteDto elPaciente)
		{
			try
			{
				Paciente elPacienteNuevo = ConvertirPacienteModelo(elPaciente);
				if (elPacienteNuevo.fecha_creacion == default)
				{
					elPacienteNuevo.fecha_creacion = DateTime.Now;
				}
				_contextoBasedeDatos.Pacientes.Add(elPacienteNuevo);
				await _contextoBasedeDatos.SaveChangesAsync();
				return elPacienteNuevo.no_paciente;
			}
			catch (Exception)
			{
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw;
			}
		}

		private Paciente ConvertirPacienteModelo(PacienteDto elPaciente)
		{
			return new Paciente {
				no_empresa = elPaciente.noEmpresa,
				tipo_identificacion = elPaciente.tipoIdentificacion,
				identificacion = elPaciente.identificacion,
				nombre = elPaciente.nombre,
				fecha_nacimiento = elPaciente.fechaNacimiento,
				sexo = elPaciente.sexo,
				nacionalidad = elPaciente.nacionalidad,
				telefono1 = elPaciente.telefono1,
				telefono2 = elPaciente.telefono2,
				email1 = elPaciente.email1,
				direccion = elPaciente.direccion,
				no_envia_factura_electronica = elPaciente.noEnviaFacturaElectronica,
				contacto_emergencia_nombre = elPaciente.contactoEmergenciaNombre,
				contacto_emergencia_telefono = elPaciente.contactoEmergenciaTelefono,
				es_activo = elPaciente.esActivo,
				fecha_creacion = elPaciente.fechaCreacion == default ? DateTime.Now : elPaciente.fechaCreacion,
				fecha_modificacion = elPaciente.fechaModificacion
			};
		}
	}
}
