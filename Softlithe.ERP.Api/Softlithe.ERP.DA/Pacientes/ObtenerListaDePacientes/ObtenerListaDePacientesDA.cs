using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Comunes;
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Parametro;
using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Resultado;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.ObtenerListaDePacientes
{
	public class ObtenerListaDePacientesDA: IObtenerListaDePacientesDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;
		public ObtenerListaDePacientesDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<List<PacienteDto>> Obtener()
		{
				List<PacienteDto> listaDePacientes = await (from pacientes in _contextoBasedeDatos.Pacientes
        select new PacienteDto
        {
            numeroDePaciente = pacientes.no_paciente,
            noEmpresa = pacientes.no_empresa,
            numeroDePacienteStr = pacientes.numero_de_paciente,
            tipoIdentificacion = pacientes.tipo_identificacion,
            identificacion = pacientes.identificacion,
            nombre = pacientes.nombre,
            fechaNacimiento = pacientes.fecha_nacimiento,
            sexo = pacientes.sexo,
            nacionalidad = pacientes.nacionalidad,
            telefono1 = pacientes.telefono1,
            telefono2 = pacientes.telefono2,
            email1 = pacientes.email1,
            direccion = pacientes.direccion,
            noEnviaFacturaElectronica = pacientes.no_envia_factura_electronica,
            contactoEmergenciaNombre = pacientes.contacto_emergencia_nombre,
            contactoEmergenciaTelefono = pacientes.contacto_emergencia_telefono,
            esActivo = pacientes.es_activo,
            fechaCreacion = pacientes.fecha_creacion,
            fechaModificacion = pacientes.fecha_modificacion
        })
        .Take(200)
        .ToListAsync();

				return listaDePacientes;
		}
	}
}
