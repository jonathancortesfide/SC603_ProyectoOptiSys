using Softlithe.ERP.Abstracciones.BC.Productos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.BC.Productos
{
    public class ProductoBC : IProductoBC
    {
        public Task<ModeloValidacion> ValidarProductoParaInsertar(ProductoDto productoDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (productoDto == null)
            {
                validacion.Mensaje = "El producto no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (productoDto.NoEmpresa <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(productoDto.Codigo))
            {
                validacion.Mensaje = MensajeDeProductoDto.CodigoInternoRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(productoDto.Descripcion))
            {
                validacion.Mensaje = MensajeDeProductoDto.DescripcionProductoRequerida;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (productoDto.NoGrupo <= 0)
            {
                validacion.Mensaje = "El grupo del producto es requerido.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(productoDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }

        public Task<ModeloValidacion> ValidarProductoParaActualizar(ProductoDto productoDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (productoDto == null)
            {
                validacion.Mensaje = "El producto no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (productoDto.IdProducto <= 0)
            {
                validacion.Mensaje = MensajeDeProductoDto.CodigoProductoRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (productoDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(productoDto.Codigo))
            {
                validacion.Mensaje = MensajeDeProductoDto.CodigoInternoRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(productoDto.Descripcion))
            {
                validacion.Mensaje = MensajeDeProductoDto.DescripcionProductoRequerida;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (productoDto.NoGrupo <= 0)
            {
                validacion.Mensaje = "El grupo del producto es requerido.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(productoDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }

        public Task<ModeloValidacion> ValidarProductoParaCambiarEstado(ProductoInActivaDto productoInActivaDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (productoInActivaDto == null)
            {
                validacion.Mensaje = "El producto no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (productoInActivaDto.IdProducto <= 0)
            {
                validacion.Mensaje = MensajeDeProductoDto.CodigoProductoRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (productoInActivaDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(productoInActivaDto.Usuario))
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
