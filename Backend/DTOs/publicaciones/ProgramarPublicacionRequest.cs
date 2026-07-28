using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ProgramarPublicacionRequest
    {
        [Required(
            ErrorMessage = "La fecha de programación es obligatoria."
        )]
        public DateTime FechaProgramacion { get; set; }
    }
}