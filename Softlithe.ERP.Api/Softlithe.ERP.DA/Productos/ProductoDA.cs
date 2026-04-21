using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;
using Softlithe.ERP.DA.Modelos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Productos
{
    public class ProductoDA : IProductoDA
    {
        private readonly ContextoBasedeDatos _contexto;
        public ProductoDA(ContextoBasedeDatos contexto)
        {
            _contexto = contexto;
        }

        public async Task<List<ProductoDto>> ObtenerTodos()
        {
            return await _contexto.Productos.Select(p => new ProductoDto
            {
                noProducto = p.noProducto,
                noEmpresa = p.noEmpresa,
                tipoArticulo = p.tipoArticulo,
                codigoInterno = p.codigoInterno,
                codigoBarras = p.codigoBarras,
                codigoAuxiliar = p.codigoAuxiliar,
                nombre = p.nombre,
                codigoCabys = p.codigoCabys,
                unidadMedida = p.unidadMedida,
                tipoImpuesto = p.tipoImpuesto,
                porcentajeImpuesto = p.porcentajeImpuesto,
                existencia = p.existencia,
                activo = p.activo,
                fechaCreacion = p.fechaCreacion,
                fechaModificacion = p.fechaModificacion
            }).ToListAsync();
        }

        public async Task<ProductoDto?> ObtenerPorId(int id)
        {
            var p = await _contexto.Productos.FindAsync(id);
            if (p == null) return null;
            return new ProductoDto
            {
                noProducto = p.noProducto,
                noEmpresa = p.noEmpresa,
                tipoArticulo = p.tipoArticulo,
                codigoInterno = p.codigoInterno,
                codigoBarras = p.codigoBarras,
                codigoAuxiliar = p.codigoAuxiliar,
                nombre = p.nombre,
                codigoCabys = p.codigoCabys,
                unidadMedida = p.unidadMedida,
                tipoImpuesto = p.tipoImpuesto,
                porcentajeImpuesto = p.porcentajeImpuesto,
                existencia = p.existencia,
                activo = p.activo,
                fechaCreacion = p.fechaCreacion,
                fechaModificacion = p.fechaModificacion
            };
        }

        public async Task<int> Crear(ProductoDto dto)
        {
            var p = new Producto
            {
                noEmpresa = dto.noEmpresa,
                tipoArticulo = dto.tipoArticulo,
                codigoInterno = dto.codigoInterno,
                codigoBarras = dto.codigoBarras,
                codigoAuxiliar = dto.codigoAuxiliar,
                nombre = dto.nombre,
                codigoCabys = dto.codigoCabys,
                unidadMedida = dto.unidadMedida,
                tipoImpuesto = dto.tipoImpuesto,
                porcentajeImpuesto = dto.porcentajeImpuesto,
                existencia = dto.existencia,
                activo = dto.activo,
                fechaCreacion = dto.fechaCreacion == default ? DateTime.Now : dto.fechaCreacion,
                fechaModificacion = dto.fechaModificacion
            };
            _contexto.Productos.Add(p);
            await _contexto.SaveChangesAsync();
            return p.noProducto;
        }

        public async Task<bool> Actualizar(ProductoDto dto)
        {
            var p = await _contexto.Productos.FindAsync(dto.noProducto);
            if (p == null) return false;
            p.noEmpresa = dto.noEmpresa;
            p.tipoArticulo = dto.tipoArticulo;
            p.codigoInterno = dto.codigoInterno;
            p.codigoBarras = dto.codigoBarras;
            p.codigoAuxiliar = dto.codigoAuxiliar;
            p.nombre = dto.nombre;
            p.codigoCabys = dto.codigoCabys;
            p.unidadMedida = dto.unidadMedida;
            p.tipoImpuesto = dto.tipoImpuesto;
            p.porcentajeImpuesto = dto.porcentajeImpuesto;
            p.existencia = dto.existencia;
            p.activo = dto.activo;
            p.fechaCreacion = dto.fechaCreacion == default ? DateTime.Now : dto.fechaCreacion;
            p.fechaModificacion = dto.fechaModificacion == null || dto.fechaModificacion == default ? DateTime.Now : dto.fechaModificacion;
            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var p = await _contexto.Productos.FindAsync(id);
            if (p == null) return false;
            _contexto.Productos.Remove(p);
            await _contexto.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CambiarEstado(int id, bool activo)
        {
            var p = await _contexto.Productos.FindAsync(id);
            if (p == null) return false;
            p.activo = activo;
            p.fechaModificacion = DateTime.Now;
            await _contexto.SaveChangesAsync();
            return true;
        }
    }
}
