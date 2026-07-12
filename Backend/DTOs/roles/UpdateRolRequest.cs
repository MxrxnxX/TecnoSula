using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class UpdateRolRequest
    {
        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; }
    }
}