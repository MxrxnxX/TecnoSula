using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        // DBA-Consultar Roles: listar todos los roles
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles
                .Select(r => new
                {
                    r.IdRol,
                    r.Nombre,
                    CantidadUsuarios = r.Usuarios.Count
                })
                .ToListAsync();

            return Ok(roles);
        }

        // DBA-Consultar Roles: obtener un rol por id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRol(int id)
        {
            var rol = await _context.Roles
                .Where(r => r.IdRol == id)
                .Select(r => new
                {
                    r.IdRol,
                    r.Nombre,
                    CantidadUsuarios = r.Usuarios.Count
                })
                .FirstOrDefaultAsync();

            if (rol == null)
            {
                return NotFound(new
                {
                    mensaje = "Rol no encontrado."
                });
            }

            return Ok(rol);
        }

        // BE-Registrar Rol
        [HttpPost]
        public async Task<IActionResult> CreateRol(CreateRolRequest request)
        {
            var existe = await _context.Roles
                .AnyAsync(r => r.Nombre == request.Nombre);

            if (existe)
            {
                return Conflict(new
                {
                    mensaje = "Ya existe un rol con ese nombre."
                });
            }

            var rol = new Rol
            {
                Nombre = request.Nombre
            };

            _context.Roles.Add(rol);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Rol registrado correctamente.",
                idRol = rol.IdRol
            });
        }

        // BE-Editar Rol
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRol(int id, UpdateRolRequest request)
        {
            var rol = await _context.Roles.FindAsync(id);

            if (rol == null)
            {
                return NotFound(new
                {
                    mensaje = "Rol no encontrado."
                });
            }

            var existe = await _context.Roles
                .AnyAsync(r => r.Nombre == request.Nombre && r.IdRol != id);

            if (existe)
            {
                return Conflict(new
                {
                    mensaje = "Ya existe otro rol con ese nombre."
                });
            }

            rol.Nombre = request.Nombre;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Rol actualizado correctamente."
            });
        }

        // BE-Eliminar Rol
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRol(int id)
        {
            var rol = await _context.Roles
                .Include(r => r.Usuarios)
                .FirstOrDefaultAsync(r => r.IdRol == id);

            if (rol == null)
            {
                return NotFound(new
                {
                    mensaje = "Rol no encontrado."
                });
            }

            if (rol.Usuarios != null && rol.Usuarios.Any())
            {
                return Conflict(new
                {
                    mensaje = "No se puede eliminar el rol porque tiene usuarios asignados."
                });
            }

            _context.Roles.Remove(rol);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Rol eliminado correctamente."
            });
        }
    }
}