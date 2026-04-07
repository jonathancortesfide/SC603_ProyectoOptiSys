using System.ComponentModel;
using System.Reflection;

namespace Bccr.Sugef.AutorizacionUsuario.Abstracciones.Contenedores.Utilitarios
{
    public class DescripcionEnum
    {
        public static string ObtenerDescripcion(Enum valor)
        {
            string descripcion = "";
            FieldInfo? informacion = default;
            DescriptionAttribute[]? attributos = null;

            informacion = valor.GetType().GetField(valor.ToString());
            if (informacion != null)
            {
                attributos = (DescriptionAttribute[])informacion.GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (attributos.Length > 0)
                {
                    descripcion = attributos[0].Description;
                }
                else
                {
                    descripcion = valor.ToString();
                }
            }
            else
            {
                descripcion = string.Format("Valor desconocido: {0}", valor.ToString());
            }


            return descripcion;
        }

        public static string GetEnumDescription(Enum value)
        {
            FieldInfo? fi = value.GetType().GetField(value.ToString());

            DescriptionAttribute[]? attributes =
                fi.GetCustomAttributes(
                typeof(DescriptionAttribute),
                false) as DescriptionAttribute[];

            if (attributes != null &&
                attributes.Length > 0)
                return attributes[0].Description;
            else
                return value.ToString();
        }

        public static string GetEnumDescriptionInt<TEnum>(int value)
        {
            return GetEnumDescription((Enum)(object)(TEnum)(object)value);  // ugly, but works
        }
    }
}
