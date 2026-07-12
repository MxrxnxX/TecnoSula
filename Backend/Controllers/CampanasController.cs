using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CampanasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CampanasController(AppDbContext context)
        {
            _context = context;
        }

        // DBA-Consultar campañas activas (y también sirve para listar todas)
        [HttpGet]
        public async Task<IActionResult> GetCampanas([FromQuery] string? estado)
        {
            var query = _context.Campanas
                .Include(c => c.Usuario)
                .AsQueryable();

            if (!string.IsNullOrEmpty(estado))
            {
                query = query.Where(c => c.Estado == estado);
            }

            var campanas = await query
                .Select(c => new
                {
                    c.IdCampana,
                    c.Nombre,
                    c.Descripcion,
                    c.FechaInicio,
                    c.FechaFin,
                    c.Presupuesto,
                    c.Estado,
                    Responsable = c.Usuario.Nombre + " " + c.Usuario.Apellido
                })
                .ToListAsync();

            return Ok(campanas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCampana(int id)
        {
            var campana = await _context.Campanas
                .Include(c => c.Usuario)
                .Where(c => c.IdCampana == id)
                .Select(c => new
                {
                    c.IdCampana,
                    c.Nombre,
                    c.Descripcion,
                    c.FechaInicio,
                    c.FechaFin,
                    c.Presupuesto,
                    c.Estado,
                    Responsable = c.Usuario.Nombre + " " + c.Usuario.Apellido
                })
                .FirstOrDefaultAsync();

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "Campaña no encontrada."
                });
            }

            return Ok(campana);
        }

        // FE-Crear campañas
        [HttpPost]
        public async Task<IActionResult> CreateCampana(CreateCampanaRequest request)
        {
            if (request.FechaFin < request.FechaInicio)
            {
                return BadRequest(new
                {
                    mensaje = "La fecha de fin no puede ser anterior a la fecha de inicio."
                });
            }

            var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.IdUsuario == request.IdUsuario);

            if (!usuarioExiste)
            {
                return BadRequest(new
                {
                    mensaje = "El usuario responsable no existe."
                });
            }

            var campana = new Campana
            {
                Nombre = request.Nombre,
                Descripcion = request.Descripcion,
                FechaInicio = request.FechaInicio,
                FechaFin = request.FechaFin,
                IdUsuario = request.IdUsuario,
                Estado = "Activa",
                Presupuesto = null
            };

            _context.Campanas.Add(campana);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Campaña creada correctamente.",
                idCampana = campana.IdCampana
            });
            
        }
        // FE-Editar campañas
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCampana(int id, UpdateCampanaRequest request)
        {
            var campana = await _context.Campanas.FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "Campaña no encontrada."
                });
            }

            if (campana.Estado != "Activa")
            {
                return Conflict(new
                {
                    mensaje = "Solo se pueden editar campañas activas."
                });
            }

            if (request.FechaFin < request.FechaInicio)
            {
                return BadRequest(new
                {
                    mensaje = "La fecha de fin no puede ser anterior a la fecha de inicio."
                });
            }

            campana.Nombre = request.Nombre;
            campana.Descripcion = request.Descripcion;
            campana.FechaInicio = request.FechaInicio;
            campana.FechaFin = request.FechaFin;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Campaña actualizada correctamente."
            });
        }

        // BE-Asignar presupuesto a una campaña
        [HttpPost("{id}/presupuesto")]
        public async Task<IActionResult> AsignarPresupuesto(int id, AsignarPresupuestoRequest request)
        {
            var campana = await _context.Campanas.FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "Campaña no encontrada."
                });
            }

            if (campana.Presupuesto != null)
            {
                return Conflict(new
                {
                    mensaje = "Esta campaña ya tiene un presupuesto asignado. Usa el endpoint de actualizar."
                });
            }

            campana.Presupuesto = request.Presupuesto;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Presupuesto asignado correctamente."
            });
        }

        // BE-Actualizar presupuesto
        [HttpPut("{id}/presupuesto")]
        public async Task<IActionResult> ActualizarPresupuesto(int id, AsignarPresupuestoRequest request)
        {
            var campana = await _context.Campanas.FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "Campaña no encontrada."
                });
            }

            if (campana.Presupuesto == null)
            {
                return Conflict(new
                {
                    mensaje = "Esta campaña no tiene presupuesto asignado todavía. Usa el endpoint de asignar."
                });
            }

            campana.Presupuesto = request.Presupuesto;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Presupuesto actualizado correctamente."
            });
        }

        // BE-Eliminar campañas canceladas
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCampana(int id)
        {
            var campana = await _context.Campanas.FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "Campaña no encontrada."
                });
            }

            if (campana.Estado != "Cancelada")
            {
                return Conflict(new
                {
                    mensaje = "Solo se pueden eliminar campañas canceladas."
                });
            }

            _context.Campanas.Remove(campana);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Campaña eliminada correctamente."
            });
        }
        // BE-Cancelar campaña (necesario para que BE-Eliminar tenga sentido)
        [HttpPatch("{id}/cancelar")]
        public async Task<IActionResult> CancelarCampana(int id)
        {
            var campana = await _context.Campanas.FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "Campaña no encontrada."
                });
            }

            if (campana.Estado == "Finalizada")
            {
                return Conflict(new
                {
                    mensaje = "No se puede cancelar una campaña ya finalizada."
                });
            }

            if (campana.Estado == "Cancelada")
            {
                return Conflict(new
                {
                    mensaje = "La campaña ya está cancelada."
                });
            }

            campana.Estado = "Cancelada";
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Campaña cancelada correctamente."
            });
        }
    }
}