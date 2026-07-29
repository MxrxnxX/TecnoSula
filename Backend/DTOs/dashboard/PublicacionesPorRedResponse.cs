namespace Backend.DTOs.dashboard
{
    public class PublicacionesPorRedResponse
    {
        public int IdRedSocial { get; set; }

        public string NombreRedSocial { get; set; } = string.Empty;

        public int CantidadPublicaciones { get; set; }
    }
}