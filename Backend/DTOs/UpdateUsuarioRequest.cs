namespace Backend.DTOs
{
    public class UpdateUsuarioRequest
    {
        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public int IdRol { get; set; }
    }
}