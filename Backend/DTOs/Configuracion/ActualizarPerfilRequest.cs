using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.configuracion
{
    public class ActualizarPerfilRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(50)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [MaxLength(70)]
        public string Apellido { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefono { get; set; }
    }
}