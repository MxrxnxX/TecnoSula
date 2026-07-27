using Backend.Data;
using Backend.DTOs;
using Backend.Models;
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
// CREAR USUARIO DESDE ADMINISTRACIÓN
// POST: api/Usuarios
// =====================================================

[HttpPost]
public async Task<IActionResult> CreateUsuario(
    [FromBody] CreateUsuarioRequest request
)
{
    if (request == null)
    {
        return BadRequest(new
        {
            mensaje = "Los datos del usuario son obligatorios."
        });
    }

    var correoNormalizado =
        request.Correo
            .Trim()
            .ToLower();

    var correoRegistrado =
        await _context.Usuarios.AnyAsync(u =>
            u.Correo.ToLower() == correoNormalizado
        );

    if (correoRegistrado)
    {
        return Conflict(new
        {
            mensaje =
                "Ya existe un usuario registrado con ese correo."
        });
    }

    var rol = await _context.Roles
        .FirstOrDefaultAsync(r =>
            r.IdRol == request.IdRol
        );

    if (rol == null)
    {
        return BadRequest(new
        {
            mensaje = "El rol seleccionado no existe."
        });
    }

    var estadoNormalizado =
        request.Estado.Trim();

    if (
        estadoNormalizado != "Activo" &&
        estadoNormalizado != "Inactivo"
    )
    {
        return BadRequest(new
        {
            mensaje =
                "El estado debe ser Activo o Inactivo."
        });
    }

    var nuevoUsuario = new Usuario
    {
        Nombre =
            request.Nombre.Trim(),

        Apellido =
            request.Apellido.Trim(),

        Correo =
            correoNormalizado,

        Contrasena =
            BCrypt.Net.BCrypt.HashPassword(
                request.Contrasena
            ),

        Telefono =
            request.Telefono?.Trim(),

        Estado =
            estadoNormalizado,

        IdRol =
            request.IdRol
    };

    _context.Usuarios.Add(nuevoUsuario);

    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(GetUsuario),
        new
        {
            id = nuevoUsuario.IdUsuario
        },
        new
        {
            mensaje =
                "Usuario creado correctamente.",

            usuario = new
            {
                nuevoUsuario.IdUsuario,
                nuevoUsuario.Nombre,
                nuevoUsuario.Apellido,
                nuevoUsuario.Correo,
                nuevoUsuario.Telefono,
                nuevoUsuario.Estado,
                nuevoUsuario.IdRol,
                Rol = rol.Nombre
            }
        }
    );
}

        // =====================================================
        // EDITAR USUARIO
        // PUT: api/Usuarios/1
        // =====================================================
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
    if (request == null)
    {
        return BadRequest(new
        {
            mensaje = "Los datos del usuario son obligatorios."
        });
    }

    var usuario = await _context.Usuarios
        .FirstOrDefaultAsync(u => u.IdUsuario == id);

    if (usuario == null)
    {
        return NotFound(new
        {
            mensaje = "Usuario no encontrado."
        });
    }

    if (string.IsNullOrWhiteSpace(request.Nombre))
    {
        return BadRequest(new
        {
            mensaje = "El nombre es obligatorio."
        });
    }

    if (string.IsNullOrWhiteSpace(request.Apellido))
    {
        return BadRequest(new
        {
            mensaje = "El apellido es obligatorio."
        });
    }

    if (string.IsNullOrWhiteSpace(request.Correo))
    {
        return BadRequest(new
        {
            mensaje = "El correo es obligatorio."
        });
    }

    var correoNormalizado = request.Correo.Trim().ToLower();

    var correoOcupado = await _context.Usuarios.AnyAsync(u =>
        u.Correo.ToLower() == correoNormalizado &&
        u.IdUsuario != id
    );

    if (correoOcupado)
    {
        return Conflict(new
        {
            mensaje = "Ya existe otro usuario registrado con ese correo."
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

    var estadoValido =
        request.Estado == "Activo" ||
        request.Estado == "Inactivo";

    if (!estadoValido)
    {
        return BadRequest(new
        {
            mensaje = "El estado debe ser Activo o Inactivo."
        });
    }

    usuario.Nombre = request.Nombre.Trim();
    usuario.Apellido = request.Apellido.Trim();
    usuario.Correo = correoNormalizado;
    usuario.Telefono = request.Telefono?.Trim();
    usuario.Estado = request.Estado;
    usuario.IdRol = request.IdRol;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        mensaje = "Usuario actualizado correctamente.",
        usuario = new
        {
            usuario.IdUsuario,
            usuario.Nombre,
            usuario.Apellido,
            usuario.Correo,
            usuario.Telefono,
            usuario.Estado,
            usuario.IdRol
        }
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