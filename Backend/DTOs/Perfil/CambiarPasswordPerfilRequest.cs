using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CambiarPasswordPerfilRequest
    {
        [Required(ErrorMessage = "La contraseña actual es obligatoria")]
        public string ContrasenaActual { get; set; } = string.Empty;

        [Required(ErrorMessage = "La nueva contraseña es obligatoria")]
        [MinLength(
            8,
            ErrorMessage = "La nueva contraseña debe tener al menos 8 caracteres"
        )]
        public string NuevaContrasena { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debes confirmar la nueva contraseña")]
        public string ConfirmarContrasena { get; set; } = string.Empty;
    }
}