using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class UpdateCampanaRequest
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Descripcion { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaFin { get; set; }

        [Range(
            0.01,
            double.MaxValue,
            ErrorMessage = "El presupuesto debe ser mayor que cero."
        )]
        public decimal Presupuesto { get; set; }

        [Range(
            0,
            100,
            ErrorMessage = "El progreso debe estar entre 0 y 100."
        )]
        public int Progreso { get; set; }

        [Required]
        [MaxLength(20)]
        public string Estado { get; set; } = "Activa";
    }
}