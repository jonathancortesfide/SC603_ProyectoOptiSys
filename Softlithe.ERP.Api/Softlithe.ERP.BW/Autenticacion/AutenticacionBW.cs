using Softlithe.ERP.Abstracciones.BW.Autenticacion;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;
using Softlithe.ERP.Abstracciones.DA.Autenticacion;
using Softlithe.ERP.Abstracciones.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Autenticacion
{
	public class AutenticacionBW : IAutenticacionBW
	{
		private readonly IAutenticacionDA _autenticacionDA;
		private readonly ITokenService _tokenService;

		public AutenticacionBW(IAutenticacionDA autenticacionDA, ITokenService tokenService)
		{
			_autenticacionDA = autenticacionDA;
			_tokenService = tokenService;
		}

		public async Task<LoginResponseDto> Login(LoginDto credenciales)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(credenciales.nombreUsuario) || string.IsNullOrWhiteSpace(credenciales.contraseña))
				{
					return new LoginResponseDto
					{
						esCorrecto = false,
						mensaje = "Usuario y contraseña son requeridos."
					};
				}

				var (esValido, noUsuario, nombreUsuario, correo) = await _autenticacionDA.ValidarCredenciales(
					credenciales.nombreUsuario, 
					credenciales.contraseña
				);

				if (!esValido)
				{
					return new LoginResponseDto
					{
						esCorrecto = false,
						mensaje = "Usuario o contraseña incorrectos."
					};
				}

				var token = _tokenService.GenerarToken(noUsuario, nombreUsuario, correo);

				return new LoginResponseDto
				{
					esCorrecto = true,
					mensaje = "Autenticación exitosa.",
					data = new LoginDataDto
					{
						token = token,
						noUsuario = noUsuario,
						nombreUsuario = nombreUsuario,
						correo = correo
					}
				};
			}
			catch (Exception ex)
			{
				return new LoginResponseDto
				{
					esCorrecto = false,
					mensaje = $"Error en autenticación: {ex.Message}"
				};
			}
		}
	}
}
