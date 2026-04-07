using System.ComponentModel;
using System.Runtime.Serialization;

namespace Softlithe.FE.Abstracciones.Contenedores.Utilidades.Constantes
{
    public enum ConstanteHacienda
    {
        [EnumMember(Value = "AutenticacionInvalidaToken"), Description("Autenticación con hacienda inválida. Detalle técnico: Existió un inconveniente al realizar la conexión con hacienda, usuario o contraseña inválida.")]
        AutenticacionInvalidaToken = 1,
        [EnumMember(Value = "TokenBlancoVacio"), Description("Existió un inconveniente al cargar los datos del token, Detalle técnico: token en blanco o vació.")]
        TokenBlancoVacio = 2,
        [EnumMember(Value = "UsuarioCertificadoBlancoVacio"), Description("Parametro de usuario de certificado de hacienda vacio o en blanco.")]
        UsuarioCertificadoBlancoVacio = 3,
        [EnumMember(Value = "ContrasennaCertificadoBlancoVacio"), Description("Parametro de contraseña de certificado de hacienda vacio o en blanco.")]
        ContrasennaCertificadoBlancoVacio = 4,
        [EnumMember(Value = "AmbienteBlancoVacio"), Description("Parametro de ambiente url se encuentra vacio o en blanco.")]
        AmbienteBlancoVacio = 5,
        [EnumMember(Value = "ValorJsonBlancoVacio"), Description("Existió un inconveniente al cargar los datos.")]
        ValorJsonBlancoVacio = 6,
        [EnumMember(Value = "ValorPeticioBlancoVacio"), Description("No hay buena comunicación con el Ministerio de Hacienda para consultar el documento. Detalle técnico: incidente al cargar la petición del servicio y convertir a xml del documento.")]
        ValorPeticioBlancoVacio = 7,
        [EnumMember(Value = "ValorDocumentoAceptado"), Description("El documento fue aceptado correctamente por el Ministerio de Hacienda.")]
        ValorDocumentoAceptado = 8,
        [EnumMember(Value = "ValorDocumentoRechazado"), Description("El documento fue rechazado por el Ministerio de Hacienda. ")]
        ValorDocumentoRechazado = 9,
        [EnumMember(Value = "ValorCodigoClaveBlancoVacio"), Description("La número de clave del documento es requerida.")]
        ValorCodigoClaveBlancoVacio = 10,
        [EnumMember(Value = "ValorIncorrectoConsultaComprobante"), Description("Existió un inconveniente al cargar los datos del comprobante electrónico. Detalle técnico: autenticación incorrecta.")]
        ValorIncorrectoConsultaComprobante = 11
    }
}
