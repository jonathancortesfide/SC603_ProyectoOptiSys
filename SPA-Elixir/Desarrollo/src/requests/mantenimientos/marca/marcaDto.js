/**
 * Cuerpo JSON alineado a MarcaDto del API Softlithe (propiedades en PascalCase).
 */

export const construirMarcaDto = ({
    noMarca = 0,
    noEmpresa,
    identificador,
    descripcion,
    esActivo = true,
    usuario,
}) => ({
    NoMarca: Number.parseInt(String(noMarca), 10) || 0,
    NoEmpresa: Number.parseInt(String(noEmpresa), 10) || 0,
    Descripcion: descripcion != null ? String(descripcion) : '',
    Identificador: Number.parseInt(String(identificador), 10) || 0,
    EsActivo: !!esActivo,
    Usuario: usuario ?? '',
});
