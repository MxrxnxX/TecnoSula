using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Publicaciones")]
    public class Publicacion
    {
        [Key]
        [Column("id_publicacion")]
        public int IdPublicacion { get; set; }

        [Required]
        [MaxLength(150)]
        [Column("titulo")]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        [Column("descripcion")]
        public string Descripcion { get; set; } = string.Empty;

        [MaxLength(30)]
        [Column("tipo_multimedia")]
        public string? TipoMultimedia { get; set; }

        [MaxLength(500)]
        [Column("url_multimedia")]
        public string? UrlMultimedia { get; set; }

        [Column("fecha_programacion")]
        public DateTime? FechaProgramacion { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("estado")]
        public string Estado { get; set; } = "Borrador";

        [Column("id_campana")]
        public int IdCampana { get; set; }

        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; }

        [Column("fecha_actualizacion")]
        public DateTime? FechaActualizacion { get; set; }

        // Relaciones

        [ForeignKey(nameof(IdCampana))]
        public Campana? Campana { get; set; }

        [ForeignKey(nameof(IdUsuario))]
        public Usuario? Usuario { get; set; }

        public ICollection<PublicacionRedSocial>
            PublicacionRedesSociales { get; set; }
                = new List<PublicacionRedSocial>();
    }
}