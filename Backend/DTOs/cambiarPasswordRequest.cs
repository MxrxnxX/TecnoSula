namespace Backend.DTOs
{
    public class CambiarPasswordRequest
    {
        public string Token { get; set; } = string.Empty;

        public string NuevaContrasena { get; set; } = string.Empty;
    }
}