using Backend.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }


        public async Task EnviarCorreoAsync(
            string destino,
            string asunto,
            string cuerpoHtml)
        {
            try
            {
                var mensaje = new MimeMessage();


                mensaje.From.Add(
                    new MailboxAddress(
                        _emailSettings.SenderName,
                        _emailSettings.SenderEmail));


                mensaje.To.Add(
                    MailboxAddress.Parse(destino));


                mensaje.Subject = asunto;


                mensaje.Body = new BodyBuilder
                {
                    HtmlBody = cuerpoHtml
                }.ToMessageBody();



                using var smtp = new SmtpClient();


                Console.WriteLine("Conectando con Gmail SMTP...");


                await smtp.ConnectAsync(
                    _emailSettings.SmtpServer,
                    _emailSettings.Port,
                    SecureSocketOptions.StartTls);



                Console.WriteLine("Conectado al servidor SMTP");


                await smtp.AuthenticateAsync(
                    _emailSettings.Username,
                    _emailSettings.Password);



                Console.WriteLine("Autenticación SMTP correcta");


                await smtp.SendAsync(mensaje);



                Console.WriteLine("Correo enviado correctamente");


                await smtp.DisconnectAsync(true);
            }
            catch(Exception ex)
            {
                Console.WriteLine("ERROR EN ENVIO DE CORREO:");
                Console.WriteLine(ex.Message);

                throw;
            }
        }
    }
}