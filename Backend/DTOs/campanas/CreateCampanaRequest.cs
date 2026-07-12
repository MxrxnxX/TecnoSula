using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CreateCampanaRequest
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [MaxLength(255)]
        public string? Descripcion { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaFin { get; set; }

        [Required]
        public int IdUsuario { get; set; }
    }
}