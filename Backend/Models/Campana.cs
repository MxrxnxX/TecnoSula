using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("Campanas")]
    public class Campana
    {
        [Key]
        [Column("id_campana")]
        public int IdCampana { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(255)]
        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Column("fecha_inicio")]
        public DateTime FechaInicio { get; set; }

        [Column("fecha_fin")]
        public DateTime FechaFin { get; set; }

        [Column("presupuesto", TypeName = "decimal(18,2)")]
        public decimal? Presupuesto { get; set; }

        [Range(0, 100)]
        [Column("progreso")]
        public int Progreso { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("estado")]
        public string Estado { get; set; } = "Activa";

        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [ForeignKey(nameof(IdUsuario))]
        [JsonIgnore]
        public Usuario Usuario { get; set; } = null!;
    }
}