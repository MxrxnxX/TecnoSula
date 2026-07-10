namespace Backend.Models
{
    public class RecuperacionPassword
    {
        public int IdRecuperacion { get; set; }

        public int IdUsuario { get; set; }

        public string Token { get; set; } = string.Empty;

        public DateTime FechaExpiracion { get; set; }

        public bool Usado { get; set; }

        public Usuario Usuario { get; set; } = null!;
    }
}