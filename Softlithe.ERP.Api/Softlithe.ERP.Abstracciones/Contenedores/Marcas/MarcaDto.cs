using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Marcas
{
    public class MarcaDto
    {
        [Required(ErrorMessage = MensajeDeMarcaDto.CodigoMarcaRequerida)]
        public int NoMarca { get; set; }
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida)]
        public int NoEmpresa { get; set; }
        [Required(ErrorMessage = MensajeDeMarcaDto.NombreMarcaRequerida)]
        public string Descripcion { get; set; } = string.Empty;
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
        public bool EsActivo { get; set; }
    }
    public class MarcaConModeloDeValidacion : ModeloValidacion
    {
        public List<MarcaDto> LaListaDeMarcas { get; set; } = new List<MarcaDto>();
    }
}
