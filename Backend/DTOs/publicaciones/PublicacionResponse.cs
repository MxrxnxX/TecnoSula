namespace Backend.DTOs
{
    public class PublicacionResponse
    {
        public int IdPublicacion { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public string? TipoMultimedia { get; set; }

        public string? UrlMultimedia { get; set; }

        public DateTime? FechaProgramacion { get; set; }

        public string Estado { get; set; } = string.Empty;

        public int IdCampana { get; set; }

        public string NombreCampana { get; set; } = string.Empty;

        public int IdUsuario { get; set; }

        public string NombreUsuario { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; }

        public DateTime? FechaActualizacion { get; set; }

        public List<RedSocialPublicacionResponse>
            RedesSociales { get; set; } = new();
    }
}