using System.Security.Claims;
using Backend.Data;
using Backend.DTOs.configuracion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ConfiguracionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConfiguracionController(
            AppDbContext context
        )
        {
            _context = context;
        }

        // =====================================================
        // OBTENER ID DEL USUARIO AUTENTICADO
        // =====================================================

        private int? ObtenerIdUsuarioAutenticado()
        {
            var idClaim = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (
                string.IsNullOrWhiteSpace(idClaim) ||
                !int.TryParse(idClaim, out var idUsuario)
            )
            {
                return null;
            }

            return idUsuario;
        }

        // =====================================================
        // OBTENER PERFIL
        // GET: api/Configuracion/perfil
        // =====================================================

        [HttpGet("perfil")]
        public async Task<IActionResult> ObtenerPerfil()
        {
            var idUsuario =
                ObtenerIdUsuarioAutenticado();

            if (!idUsuario.HasValue)
            {
                return Unauthorized(
                    "No se pudo identificar al usuario autenticado."
                );
            }

            var usuario = await _context.Usuarios
                .AsNoTracking()
                .Include(u => u.Rol)
                .Where(
                    u => u.IdUsuario ==
                         idUsuario.Value
                )
                .Select(u => new
                {
                    u.IdUsuario,
                    u.Nombre,
                    u.Apellido,
                    u.Correo,
                    u.Telefono,
                    u.Estado,

                    Rol = u.Rol != null
                        ? u.Rol.Nombre
                        : "Sin rol"
                })
                .FirstOrDefaultAsync();

            if (usuario == null)
            {
                return NotFound(
                    "No se encontró el usuario autenticado."
                );
            }

            return Ok(usuario);
        }

        // =====================================================
        // ACTUALIZAR PERFIL
        // PUT: api/Configuracion/perfil
        // =====================================================

        [HttpPut("perfil")]
        public async Task<IActionResult> ActualizarPerfil(
            [FromBody] ActualizarPerfilRequest request
        )
        {
            var idUsuario =
                ObtenerIdUsuarioAutenticado();

            if (!idUsuario.HasValue)
            {
                return Unauthorized(
                    "No se pudo identificar al usuario autenticado."
                );
            }

            var nombre =
                request.Nombre?.Trim();

            var apellido =
                request.Apellido?.Trim();

            var telefono =
                request.Telefono?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(nombre))
            {
                return BadRequest(
                    "El nombre es obligatorio."
                );
            }

            if (string.IsNullOrWhiteSpace(apellido))
            {
                return BadRequest(
                    "El apellido es obligatorio."
                );
            }

            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(
                    u => u.IdUsuario ==
                         idUsuario.Value
                );

            if (usuario == null)
            {
                return NotFound(
                    "No se encontró el usuario autenticado."
                );
            }

            usuario.Nombre = nombre;
            usuario.Apellido = apellido;
            usuario.Telefono = telefono;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje =
                    "Perfil actualizado correctamente.",

                usuario = new
                {
                    usuario.IdUsuario,
                    usuario.Nombre,
                    usuario.Apellido,
                    usuario.Correo,
                    usuario.Telefono,
                    usuario.Estado,

                    Rol = usuario.Rol != null
                        ? usuario.Rol.Nombre
                        : "Sin rol"
                }
            });
        }
    }
}