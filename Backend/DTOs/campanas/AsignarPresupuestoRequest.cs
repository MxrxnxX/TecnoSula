using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class AsignarPresupuestoRequest
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El presupuesto debe ser mayor a 0.")]
        public decimal Presupuesto { get; set; }
    }
}