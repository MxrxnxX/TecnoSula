using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Usuarios")]
    public class Usuario
    {
        [Key]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("apellido")]
        public string Apellido { get; set; }

        [Column("correo")]
        public string Correo { get; set; }

        [Column("contrasena")]
        public string Contrasena { get; set; }

        [Column("telefono")]
        public string Telefono { get; set; }

        [Column("estado")]
        public string Estado { get; set; }

        [Column("id_rol")]
        public int IdRol { get; set; }


        public Rol Rol { get; set; }
    }
}