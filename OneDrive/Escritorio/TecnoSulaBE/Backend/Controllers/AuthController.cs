using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
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


    return Ok(new
    {
        mensaje = "Usuario encontrado",
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
    }
}