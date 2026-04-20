using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.BuscarPacientePorNombreOIdentificacion
{
	public class BuscarPacientePorNombreOIdentificacionDA: IBuscarPacientePorNombreOIdentificacionDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;
		public BuscarPacientePorNombreOIdentificacionDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<List<PacienteDto>> Obtener(string parametroDeBusqueda)
		{
            var query = _contextoBasedeDatos.Pacientes.AsQueryable();

            // Si parametroDeBusqueda tiene valor, aplicamos el filtro (por identificacion o nombre)
            if (!string.IsNullOrEmpty(parametroDeBusqueda))
            {
                query = query.Where(p => p.identificacion.Contains(parametroDeBusqueda) || p.nombre.Contains(parametroDeBusqueda));
            }

            List<PacienteDto> elPacienteBuscado = await (from pacientes in query
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
                .Take(string.IsNullOrEmpty(parametroDeBusqueda) ? 100 : int.MaxValue)
                .OrderBy(paciente => paciente.nombre)
                .ToListAsync();

            return elPacienteBuscado;
		}
	}
}
