namespace Backend.Services
{
    public interface IEmailService
    {
        Task EnviarCorreoAsync(
            string destino,
            string asunto,
            string cuerpoHtml);
    }
}