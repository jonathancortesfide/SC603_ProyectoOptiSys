using System;

namespace Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema
{
    public class MensajeDeListaPreciosDto
    {
        public const string ListaPrecioCreada = "La lista de precios fue creada correctamente.";
        public const string ListaPrecioActualizada = "La lista de precios fue actualizada correctamente.";
        public const string ListaPrecioEliminada = "La lista de precios fue eliminada correctamente.";
        public const string ListaPrecioNoEncontrada = "No se encontró la lista de precios solicitada.";
        public const string ErrorAlCrearListaPrecio = "Ocurrió un error al crear la lista de precios.";
        public const string ErrorAlActualizarListaPrecio = "Ocurrió un error al actualizar la lista de precios.";
        public const string ErrorAlEliminarListaPrecio = "Ocurrió un error al eliminar la lista de precios.";
    }
}
