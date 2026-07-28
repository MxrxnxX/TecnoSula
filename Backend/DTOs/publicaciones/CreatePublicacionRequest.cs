using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CreatePublicacionRequest
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(
            150,
            ErrorMessage = "El título no puede superar los 150 caracteres."
        )]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "La descripción es obligatoria.")]
        [MaxLength(
            1000,
            ErrorMessage = "La descripción no puede superar los 1000 caracteres."
        )]
        public string Descripcion { get; set; } = string.Empty;

        [MaxLength(
            30,
            ErrorMessage = "El tipo de multimedia no puede superar los 30 caracteres."
        )]
        public string? TipoMultimedia { get; set; }

        [MaxLength(
            500,
            ErrorMessage = "La URL del archivo no puede superar los 500 caracteres."
        )]
        public string? UrlMultimedia { get; set; }

        [Range(
            1,
            int.MaxValue,
            ErrorMessage = "Debes seleccionar una campaña válida."
        )]
        public int IdCampana { get; set; }

        [Required(
            ErrorMessage = "Debes seleccionar al menos una red social."
        )]
        [MinLength(
            1,
            ErrorMessage = "Debes seleccionar al menos una red social."
        )]
        public List<int> IdsRedesSociales { get; set; } = new();

        public DateTime? FechaProgramacion { get; set; }

        [MaxLength(
            20,
            ErrorMessage = "El estado no puede superar los 20 caracteres."
        )]
        public string Estado { get; set; } = "Borrador";
    }
}