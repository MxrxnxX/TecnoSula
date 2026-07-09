using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
       
     private readonly AppDbContext _context;
private readonly IConfiguration _configuration;

public AuthController(AppDbContext context, IConfiguration configuration)
{
    _context = context;
    _configuration = configuration;
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
    var claims = new[]
    {
        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, usuario.Nombre),
        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, usuario.Correo),
        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, usuario.Rol.Nombre)
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
        nombre = usuario.Nombre,
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
    return Ok(new
    {
        mensaje = "Acceso permitido con JWT",
        usuario = User.Identity?.Name,
        rol = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
    });
}

    }
}