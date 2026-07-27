using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CreateUsuarioRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [MaxLength(100)]
        public string Apellido { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "El correo no es válido.")]
        [MaxLength(150)]
        public string Correo { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(
            6,
            ErrorMessage = "La contraseña debe tener al menos 6 caracteres."
        )]
        public string Contrasena { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public string Estado { get; set; } = "Activo";

        [Range(
            1,
            int.MaxValue,
            ErrorMessage = "Debes seleccionar un rol."
        )]
        public int IdRol { get; set; }
    }
}