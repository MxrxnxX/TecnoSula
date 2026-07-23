using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize(Roles = "Administrador")]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // CONSULTAR TODOS LOS USUARIOS
        // GET: api/Usuarios
        // =====================================================
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

        // =====================================================
        // CONSULTAR UN USUARIO
        // GET: api/Usuarios/1
        // =====================================================
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
                    u.IdRol,
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

        // =====================================================
        // EDITAR USUARIO
        // PUT: api/Usuarios/1
        // =====================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(
            int id,
            [FromBody] UpdateUsuarioRequest request
        )
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound(new
                {
                    mensaje = "Usuario no encontrado."
                });
            }

            var rolExiste = await _context.Roles
                .AnyAsync(r => r.IdRol == request.IdRol);

            if (!rolExiste)
            {
                return BadRequest(new
                {
                    mensaje = "El rol seleccionado no existe."
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

        // =====================================================
        // DESACTIVAR USUARIO
        // DELETE: api/Usuarios/1
        // =====================================================
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