using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Backend.Services;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
       
     private readonly AppDbContext _context;
private readonly IConfiguration _configuration;
private readonly IEmailService _emailService;

public AuthController(
    AppDbContext context,
    IConfiguration configuration,
    IEmailService emailService)
{
    _context = context;
    _configuration = configuration;
    _emailService = emailService;
}


        [HttpGet("testdb")]
        public async Task<IActionResult> TestDB()
        {
           var usuarios = await _context.Usuarios
    .Include(u => u.Rol)
    .ToListAsync();

            return Ok(usuarios);
        }
        
 [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
    var usuario = await _context.Usuarios
        .Include(u => u.Rol)
        .FirstOrDefaultAsync(u => u.Correo == request.Correo);

    if (usuario == null)
    {
        return Unauthorized(new
        {
            mensaje = "Usuario no encontrado"
        });
    }

    // Verificar contraseña
    if (!BCrypt.Net.BCrypt.Verify(request.Contrasena, usuario.Contrasena))
    {
        return Unauthorized(new
        {
            mensaje = "Contraseña incorrecta"
        });
    }

    // Crear los datos que llevará el token
   var claims = new List<Claim>
{
    new Claim(
        ClaimTypes.NameIdentifier,
        usuario.IdUsuario.ToString()
    ),
    new Claim(
        ClaimTypes.Name,
        usuario.Nombre
    ),
    new Claim(
        ClaimTypes.Email,
        usuario.Correo
    ),
    new Claim(
        ClaimTypes.Role,
        usuario.Rol.Nombre
    )
};

    var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
        System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

    var credenciales = new Microsoft.IdentityModel.Tokens.SigningCredentials(
        key,
        Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

    var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddHours(2),
        signingCredentials: credenciales
    );

    var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler()
        .WriteToken(token);

 return Ok(new
{
    token = jwt,
    idUsuario = usuario.IdUsuario,
    nombre = usuario.Nombre,
    correo = usuario.Correo,
    rol = usuario.Rol.Nombre
});
}
 [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
    // Verificar si el correo ya existe
    var usuarioExiste = await _context.Usuarios
        .FirstOrDefaultAsync(u => u.Correo == request.Correo);

    if (usuarioExiste != null)
    {
        return BadRequest(new
        {
            mensaje = "El correo ya está registrado"
        });
    }


    // Buscar rol Cliente
    var rolCliente = await _context.Roles
        .FirstOrDefaultAsync(r => r.Nombre == "Cliente");


    if (rolCliente == null)
    {
        return BadRequest(new
        {
            mensaje = "No existe el rol Cliente"
        });
    }


    // Crear usuario
    var nuevoUsuario = new Usuario
    {
        Nombre = request.Nombre,
        Apellido = request.Apellido,
        Correo = request.Correo,

        // Encriptar contraseña
        Contrasena = BCrypt.Net.BCrypt.HashPassword(request.Contrasena),

        Telefono = request.Telefono,
        Estado = "Activo",

        IdRol = rolCliente.IdRol
    };


    _context.Usuarios.Add(nuevoUsuario);

    await _context.SaveChangesAsync();


    return Ok(new
    {
        mensaje = "Usuario registrado correctamente",
        usuario = nuevoUsuario.Correo
    });
}
[Authorize]
[HttpGet("perfil")]
public IActionResult Perfil()
{
    var nombre = User.Identity?.Name;

    var correo = User.FindFirst(
        System.Security.Claims.ClaimTypes.Email
    )?.Value;

    var rol = User.FindFirst(
        System.Security.Claims.ClaimTypes.Role
    )?.Value;

    return Ok(new
    {
        mensaje = "Acceso permitido con JWT",
        usuario = nombre,
        correo = correo,
        rol = rol
    });
}
[HttpPost("recuperar")]
public async Task<IActionResult> Recuperar(
    [FromBody] RecuperarPasswordRequest request)
{
    var usuario = await _context.Usuarios
        .FirstOrDefaultAsync(u => u.Correo == request.Correo);


    if (usuario == null)
    {
        return Ok(new
        {
            mensaje = "Si el correo existe, recibirás instrucciones."
        });
    }


    var token = Guid.NewGuid().ToString();


    var recuperacion = new RecuperacionPassword
    {
        IdUsuario = usuario.IdUsuario,

        Token = token,

        FechaExpiracion = DateTime.Now.AddMinutes(30),

        Usado = false
    };


    _context.RecuperacionesPassword.Add(recuperacion);


    await _context.SaveChangesAsync();


    var enlace =
        $"http://localhost:5500/nueva-contrasena.html?token={token}";


    var cuerpo = $@"
    <html>
    <body>

    <h2>TecnoSula</h2>

    <p>Recibimos una solicitud para cambiar tu contraseña.</p>

    <p>Haz clic en el siguiente enlace para recuperar tu cuenta:</p>

    <a href='{enlace}'>
        Recuperar contraseña
    </a>

    <p>Este enlace expirará en 30 minutos.</p>

    <br>

    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>

    </body>
    </html>
    ";


    Console.WriteLine("Preparando envío de correo...");


    await _emailService.EnviarCorreoAsync(
        usuario.Correo,
        "Recuperación de contraseña - TecnoSula",
        cuerpo
    );


    Console.WriteLine("Terminó el envío de correo...");


    return Ok(new
    {
        mensaje = "Si el correo existe, recibirás instrucciones."
    });
}
[HttpPost("cambiar-password")]
public async Task<IActionResult> CambiarPassword(
    [FromBody] CambiarPasswordRequest request)
{
    var recuperacion = await _context.RecuperacionesPassword
        .Include(r => r.Usuario)
        .FirstOrDefaultAsync(r => r.Token == request.Token);


    if (recuperacion == null)
    {
        return BadRequest(new
        {
            mensaje = "Token inválido"
        });
    }


    if (recuperacion.Usado)
    {
        return BadRequest(new
        {
            mensaje = "Este enlace ya fue utilizado"
        });
    }


    if (recuperacion.FechaExpiracion < DateTime.Now)
    {
        return BadRequest(new
        {
            mensaje = "El enlace ha expirado"
        });
    }


    recuperacion.Usuario.Contrasena =
        BCrypt.Net.BCrypt.HashPassword(
            request.NuevaContrasena);


    recuperacion.Usado = true;


    await _context.SaveChangesAsync();


    return Ok(new
    {
        mensaje = "Contraseña actualizada correctamente"
    });
}

    }
}