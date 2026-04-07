using Dapper;
using Microsoft.Data.SqlClient;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.Examenes.AgregarExamen;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Examenes.AgregarExamen
{
	public class AgregarExamenDA : IAgregarExamenDA
	{
		private readonly IConexionABaseDeDatos _conexionABaseDeDatos;
		public AgregarExamenDA(IConexionABaseDeDatos conexionABaseDeDatos)
		{
			_conexionABaseDeDatos = conexionABaseDeDatos;
		}

		public async Task<int> Agregar(AgregarExamenDto datos)
		{
			try
			{
				int numeroDeExamen = 0;
				using (IDbConnection dbConnection = new SqlConnection(_conexionABaseDeDatos.ObtenerCadenaDeConexion()))
				{
					DynamicParameters parameters = ObtenerParametrosDeRegistro(datos);
					numeroDeExamen = await dbConnection.QuerySingleOrDefaultAsync<int>("[dbo].[paDMLExamen]", parameters, commandType: CommandType.StoredProcedure);
				}
				return numeroDeExamen;
			}
			catch (Exception ex)
			{
				return -1;
			}
		}

		private DynamicParameters ObtenerParametrosDeRegistro(AgregarExamenDto datos)
		{
			DynamicParameters parameters = new DynamicParameters();
			parameters.Add("pno_examen", datos.NoExamen);
			parameters.Add("pno_paciente", datos.NoPaciente);
			parameters.Add("pfecha_examen", datos.FechaExamen);
			parameters.Add("pmotivo", datos.Motivo);
			parameters.Add("ptipo_examen", datos.TipoExamen);
			parameters.Add("pdp_general", datos.DpGeneral);
			parameters.Add("pMedio_transp", datos.MedioTransp);
			parameters.Add("pfo", datos.Fo);
			parameters.Add("ppio", datos.Pio);
			parameters.Add("pno_empresa", datos.NumeroEmpresa);
			parameters.Add("pestado", datos.Estado);
			parameters.Add("pultimo_examen", datos.UltimoExamen);
			parameters.Add("ptratamiento_anterior", datos.TratamientoAnterior);
			parameters.Add("pmodo_uso", datos.ModoUso);
			parameters.Add("ptipo_patologias", datos.TipoPatologias);
			parameters.Add("ptiene_diseno", datos.TieneDiseno);
			parameters.Add("ptiene_aro", datos.TieneAro);
			parameters.Add("pdiagonal", datos.Diagonal);
			parameters.Add("pTipoDML", datos.TipoDml);
			parameters.Add("pvertical", datos.Vertical);
			parameters.Add("ppuente", datos.Puente);
			parameters.Add("phorizontal", datos.Horizontal);
			parameters.Add("pxmlPatologias", datos.XmlPatologias);
			parameters.Add("pxmlGraduaciones", datos.XmlGraduaciones);
			parameters.Add("pxmlDisenos", datos.XmlDisenos);
			parameters.Add("pcodigoAro", datos.CodigoAro);
			parameters.Add("pimagen", datos.Imagen);
			parameters.Add("pcodigoExamen", datos.CodigoExamen);
			parameters.Add("pno_proveedor_laboratorio", datos.NumeroProveedorLaboratorio);
			parameters.Add("pno_orden_laboratorio", datos.NumeroOrdenLaboratorio);
			parameters.Add("pno_pedido_laboratorio", datos.NumeroPedidoLaboratorio);
			parameters.Add("pcodigo_lentecontacto", datos.codigoLenteContacto);
			return parameters;
		}
	}
}
