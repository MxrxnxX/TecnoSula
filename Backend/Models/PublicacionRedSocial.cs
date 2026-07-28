using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("PublicacionRedSocial")]
    public class PublicacionRedSocial
    {
        [Column("id_publicacion")]
        public int IdPublicacion { get; set; }

        [Column("id_red_social")]
        public int IdRedSocial { get; set; }

        // Relaciones

        [ForeignKey(nameof(IdPublicacion))]
        public Publicacion? Publicacion { get; set; }

        [ForeignKey(nameof(IdRedSocial))]
        public RedSocial? RedSocial { get; set; }
    }
}