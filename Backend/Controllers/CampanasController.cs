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

        // =====================================================
        // OBTENER TODAS LAS CAMPAÑAS
        // GET: api/Campanas
        // GET: api/Campanas?estado=Activa
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetCampanas(
            [FromQuery] string? estado)
        {
            var query = _context.Campanas
                .AsNoTracking()
                .Include(c => c.Usuario)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(estado))
            {
                var estadoNormalizado = NormalizarEstado(
                    estado,
                    permitirCancelada: true
                );

                if (estadoNormalizado == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "El estado utilizado para filtrar no es válido."
                    });
                }

                query = query.Where(
                    c => c.Estado == estadoNormalizado
                );
            }

            var campanas = await query
                .OrderByDescending(c => c.IdCampana)
                .Select(c => new
                {
                    c.IdCampana,
                    c.Nombre,
                    c.Descripcion,
                    c.FechaInicio,
                    c.FechaFin,
                    c.Presupuesto,
                    c.Progreso,
                    c.Estado,

                    Responsable =
                        c.Usuario.Nombre + " " +
                        c.Usuario.Apellido
                })
                .ToListAsync();

            return Ok(campanas);
        }

        // =====================================================
        // OBTENER UNA CAMPAÑA
        // GET: api/Campanas/1
        // =====================================================

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCampana(int id)
        {
            var campana = await _context.Campanas
                .AsNoTracking()
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
                    c.Progreso,
                    c.Estado,

                    Responsable =
                        c.Usuario.Nombre + " " +
                        c.Usuario.Apellido
                })
                .FirstOrDefaultAsync();

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "La campaña solicitada no existe."
                });
            }

            return Ok(campana);
        }

        // =====================================================
        // CREAR CAMPAÑA
        // POST: api/Campanas
        // =====================================================

        [HttpPost]
        public async Task<IActionResult> CreateCampana(
            [FromBody] CreateCampanaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                return BadRequest(new
                {
                    mensaje = "El nombre de la campaña es obligatorio."
                });
            }

            if (request.FechaFin < request.FechaInicio)
            {
                return BadRequest(new
                {
                    mensaje = "La fecha final no puede ser anterior a la fecha de inicio."
                });
            }

            if (request.Presupuesto <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El presupuesto debe ser mayor que cero."
                });
            }

            if (request.Progreso < 0 || request.Progreso > 100)
            {
                return BadRequest(new
                {
                    mensaje = "El progreso debe estar entre 0 y 100."
                });
            }

            var estadoNormalizado = NormalizarEstado(
                request.Estado
            );

            if (estadoNormalizado == null)
            {
                return BadRequest(new
                {
                    mensaje = "El estado seleccionado no es válido."
                });
            }

            var usuarioExiste = await _context.Usuarios
                .AnyAsync(
                    u => u.IdUsuario == request.IdUsuario
                );

            if (!usuarioExiste)
            {
                return BadRequest(new
                {
                    mensaje = "El usuario responsable seleccionado no existe."
                });
            }

            var campana = new Campana
            {
                Nombre = request.Nombre.Trim(),

                Descripcion =
                    string.IsNullOrWhiteSpace(request.Descripcion)
                        ? null
                        : request.Descripcion.Trim(),

                FechaInicio = request.FechaInicio,
                FechaFin = request.FechaFin,
                Presupuesto = request.Presupuesto,
                Progreso = request.Progreso,
                Estado = estadoNormalizado,
                IdUsuario = request.IdUsuario
            };

            _context.Campanas.Add(campana);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCampana),
                new
                {
                    id = campana.IdCampana
                },
                new
                {
                    mensaje = "Campaña creada correctamente.",
                    idCampana = campana.IdCampana
                }
            );
        }

        // =====================================================
        // EDITAR CAMPAÑA
        // PUT: api/Campanas/1
        // =====================================================

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCampana(
            int id,
            [FromBody] UpdateCampanaRequest request)
        {
            var campana = await _context.Campanas
                .FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "La campaña que intentas editar no existe."
                });
            }

            if (campana.Estado == "Cancelada")
            {
                return Conflict(new
                {
                    mensaje = "Una campaña cancelada no puede modificarse."
                });
            }

            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                return BadRequest(new
                {
                    mensaje = "El nombre de la campaña es obligatorio."
                });
            }

            if (request.FechaFin < request.FechaInicio)
            {
                return BadRequest(new
                {
                    mensaje = "La fecha final no puede ser anterior a la fecha de inicio."
                });
            }

            if (request.Presupuesto <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El presupuesto debe ser mayor que cero."
                });
            }

            if (request.Progreso < 0 || request.Progreso > 100)
            {
                return BadRequest(new
                {
                    mensaje = "El progreso debe estar entre 0 y 100."
                });
            }

            var estadoNormalizado = NormalizarEstado(
                request.Estado
            );

            if (estadoNormalizado == null)
            {
                return BadRequest(new
                {
                    mensaje = "El estado seleccionado no es válido."
                });
            }

            campana.Nombre =
                request.Nombre.Trim();

            campana.Descripcion =
                string.IsNullOrWhiteSpace(request.Descripcion)
                    ? null
                    : request.Descripcion.Trim();

            campana.FechaInicio =
                request.FechaInicio;

            campana.FechaFin =
                request.FechaFin;

            campana.Presupuesto =
                request.Presupuesto;

            campana.Progreso =
                request.Progreso;

            campana.Estado =
                estadoNormalizado;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Los cambios de la campaña fueron guardados correctamente."
            });
        }

        // =====================================================
        // ASIGNAR PRESUPUESTO
        // POST: api/Campanas/1/presupuesto
        // =====================================================

        [HttpPost("{id:int}/presupuesto")]
        public async Task<IActionResult> AsignarPresupuesto(
            int id,
            [FromBody] AsignarPresupuestoRequest request)
        {
            var campana = await _context.Campanas
                .FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "La campaña seleccionada no existe."
                });
            }

            if (campana.Estado == "Cancelada")
            {
                return Conflict(new
                {
                    mensaje = "No se puede asignar presupuesto a una campaña cancelada."
                });
            }

            if (campana.Presupuesto != null)
            {
                return Conflict(new
                {
                    mensaje = "La campaña ya cuenta con un presupuesto asignado."
                });
            }

            if (request.Presupuesto <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El presupuesto debe ser mayor que cero."
                });
            }

            campana.Presupuesto =
                request.Presupuesto;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "El presupuesto fue asignado correctamente."
            });
        }

        // =====================================================
        // ACTUALIZAR PRESUPUESTO
        // PUT: api/Campanas/1/presupuesto
        // =====================================================

        [HttpPut("{id:int}/presupuesto")]
        public async Task<IActionResult> ActualizarPresupuesto(
            int id,
            [FromBody] AsignarPresupuestoRequest request)
        {
            var campana = await _context.Campanas
                .FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "La campaña seleccionada no existe."
                });
            }

            if (campana.Estado == "Cancelada")
            {
                return Conflict(new
                {
                    mensaje = "No se puede modificar el presupuesto de una campaña cancelada."
                });
            }

            if (campana.Presupuesto == null)
            {
                return Conflict(new
                {
                    mensaje = "La campaña todavía no cuenta con un presupuesto asignado."
                });
            }

            if (request.Presupuesto <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El presupuesto debe ser mayor que cero."
                });
            }

            campana.Presupuesto =
                request.Presupuesto;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "El presupuesto fue actualizado correctamente."
            });
        }

        // =====================================================
        // CANCELAR CAMPAÑA
        // PATCH: api/Campanas/1/cancelar
        // =====================================================

        [HttpPatch("{id:int}/cancelar")]
        public async Task<IActionResult> CancelarCampana(int id)
        {
            var campana = await _context.Campanas
                .FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "La campaña seleccionada no existe."
                });
            }

            if (campana.Estado == "Finalizada")
            {
                return Conflict(new
                {
                    mensaje = "No se puede cancelar una campaña finalizada."
                });
            }

            if (campana.Estado == "Cancelada")
            {
                return Conflict(new
                {
                    mensaje = "La campaña ya se encuentra cancelada."
                });
            }

            campana.Estado = "Cancelada";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "La campaña fue cancelada correctamente."
            });
        }

        // =====================================================
        // ELIMINAR CAMPAÑA
        // DELETE: api/Campanas/1
        // =====================================================

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCampana(int id)
        {
            var campana = await _context.Campanas
                .FindAsync(id);

            if (campana == null)
            {
                return NotFound(new
                {
                    mensaje = "La campaña que intentas eliminar no existe."
                });
            }

            if (campana.Estado != "Cancelada")
            {
                return Conflict(new
                {
                    mensaje = "Antes de eliminar una campaña, debes cancelarla."
                });
            }

            _context.Campanas.Remove(campana);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "La campaña fue eliminada correctamente."
            });
        }

        // =====================================================
        // NORMALIZAR ESTADOS
        // =====================================================

        private static string? NormalizarEstado(
            string? estado,
            bool permitirCancelada = false)
        {
            if (string.IsNullOrWhiteSpace(estado))
            {
                return null;
            }

            var estadoLimpio = estado
                .Trim()
                .ToLowerInvariant();

            return estadoLimpio switch
            {
                "activa" => "Activa",
                "pausada" => "Pausada",
                "finalizada" => "Finalizada",

                "cancelada" when permitirCancelada =>
                    "Cancelada",

                _ => null
            };
        }
    }
}