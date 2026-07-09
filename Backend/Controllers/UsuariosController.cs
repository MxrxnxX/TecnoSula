using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
public async Task<IActionResult> GetUsuarios()
{
    var usuarios = await _context.Usuarios
        .Include(u => u.Rol)
        .Select(u => new
        {
            u.IdUsuario,
            u.Nombre,
            u.Apellido,
            u.Correo,
            u.Telefono,
            u.Estado,
            Rol = u.Rol.Nombre
        })
        .ToListAsync();

    return Ok(usuarios);
}
[HttpGet("{id}")]
public async Task<IActionResult> GetUsuario(int id)
{
    var usuario = await _context.Usuarios
        .Include(u => u.Rol)
        .Where(u => u.IdUsuario == id)
        .Select(u => new
        {
            u.IdUsuario,
            u.Nombre,
            u.Apellido,
            u.Correo,
            u.Telefono,
            u.Estado,
            Rol = u.Rol.Nombre
        })
        .FirstOrDefaultAsync();

    if (usuario == null)
    {
        return NotFound(new
        {
            mensaje = "Usuario no encontrado."
        });
    }

    return Ok(usuario);
}
[HttpPut("{id}")]
public async Task<IActionResult> UpdateUsuario(int id, UpdateUsuarioRequest request)
{
    var usuario = await _context.Usuarios.FindAsync(id);

    if (usuario == null)
    {
        return NotFound(new
        {
            mensaje = "Usuario no encontrado."
        });
    }

    usuario.Nombre = request.Nombre;
    usuario.Apellido = request.Apellido;
    usuario.Telefono = request.Telefono;
    usuario.Estado = request.Estado;
    usuario.IdRol = request.IdRol;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        mensaje = "Usuario actualizado correctamente."
    });
}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteUsuario(int id)
{
    var usuario = await _context.Usuarios.FindAsync(id);

    if (usuario == null)
    {
        return NotFound(new
        {
            mensaje = "Usuario no encontrado."
        });
    }

    usuario.Estado = "Inactivo";

    await _context.SaveChangesAsync();

    return Ok(new
    {
        mensaje = "Usuario desactivado correctamente."
    });
}
    }
}