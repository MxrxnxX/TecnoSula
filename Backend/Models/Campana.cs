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

        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Column("fecha_inicio")]
        public DateTime FechaInicio { get; set; }

        [Column("fecha_fin")]
        public DateTime FechaFin { get; set; }

        [Column("presupuesto")]
        public decimal? Presupuesto { get; set; }

        [Column("estado")]
        public string Estado { get; set; }

        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [JsonIgnore]
        public Usuario Usuario { get; set; }
    }
}