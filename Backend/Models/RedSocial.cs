using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("RedesSociales")]
    public class RedSocial
    {
        [Key]
        [Column("id_red_social")]
        public int IdRedSocial { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("estado")]
        public bool Estado { get; set; } = true;

        public ICollection<PublicacionRedSocial>
            PublicacionRedesSociales { get; set; }
                = new List<PublicacionRedSocial>();
    }
}