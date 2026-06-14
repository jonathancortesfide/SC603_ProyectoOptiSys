using Softlithe.ERP.Abstracciones.BC.Proveedores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;

namespace Softlithe.ERP.BC.Proveedores
{
    public class ProveedorBC : IProveedorBC
    {
        public Task<ModeloValidacion> ValidarProveedorParaInsertar(ProveedorDto proveedorDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (proveedorDto == null)
            {
                validacion.Mensaje = "El proveedor no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (proveedorDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(proveedorDto.Nombre))
            {
                validacion.Mensaje = MensajeDeProveedorDto.NombreProveedorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(proveedorDto.Cedula))
            {
                validacion.Mensaje = MensajeDeProveedorDto.CedulaProveedorRequerida;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(proveedorDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }

        public Task<ModeloValidacion> ValidarProveedorParaActualizar(ProveedorDto proveedorDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (proveedorDto == null)
            {
                validacion.Mensaje = "El proveedor no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (proveedorDto.NoProveedor <= 0)
            {
                validacion.Mensaje = MensajeDeProveedorDto.CodigoProveedorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (proveedorDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(proveedorDto.Nombre))
            {
                validacion.Mensaje = MensajeDeProveedorDto.NombreProveedorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(proveedorDto.Cedula))
            {
                validacion.Mensaje = MensajeDeProveedorDto.CedulaProveedorRequerida;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(proveedorDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }

        public Task<ModeloValidacion> ValidarProveedorParaCambiarEstado(ProveedorInActivaDto proveedorInActivaDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (proveedorInActivaDto == null)
            {
                validacion.Mensaje = "El proveedor no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (proveedorInActivaDto.NoProveedor <= 0)
            {
                validacion.Mensaje = MensajeDeProveedorDto.CodigoProveedorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (proveedorInActivaDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(proveedorInActivaDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }
    }
}
