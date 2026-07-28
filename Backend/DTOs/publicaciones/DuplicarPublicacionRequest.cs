using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class DuplicarPublicacionRequest
    {
        [MaxLength(
            150,
            ErrorMessage = "El título no puede superar los 150 caracteres."
        )]
        public string? Titulo { get; set; }
    }
}