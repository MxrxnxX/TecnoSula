using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("Roles")]
    public class Rol
    {
        [Key]
        [Column("id_rol")]
        public int IdRol { get; set; }

        [Column("nombre")]
        public string Nombre { get; set; }


      [JsonIgnore]
public ICollection<Usuario> Usuarios { get; set; }
    }
}