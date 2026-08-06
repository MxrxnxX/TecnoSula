using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PublicacionesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

    public PublicacionesController(
        
    AppDbContext context,
    IWebHostEnvironment environment
    )
    {
    _context = context;
    _environment = environment;
    }

        // =====================================================
        // CONSULTAR TODAS LAS PUBLICACIONES
        //
        // GET: api/Publicaciones
        //
        // Filtros opcionales:
        // api/Publicaciones?idCampana=1
        // api/Publicaciones?estado=Programada
        // api/Publicaciones?idRedSocial=1
        // api/Publicaciones?buscar=descuento
        // api/Publicaciones?fechaDesde=2026-08-01
        // api/Publicaciones?fechaHasta=2026-08-31
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetPublicaciones(
            [FromQuery] int? idCampana,
            [FromQuery] string? estado,
            [FromQuery] int? idRedSocial,
            [FromQuery] string? buscar,
            [FromQuery] DateTime? fechaDesde,
            [FromQuery] DateTime? fechaHasta
        )
        {
            IQueryable<Publicacion> consulta =
                _context.Publicaciones
                    .AsNoTracking()
                    .Include(p => p.Campana)
                    .Include(p => p.Usuario)
                    .Include(
                        p => p.PublicacionRedesSociales
                    )
                    .ThenInclude(
                        pr => pr.RedSocial
                    );

            // Filtrar por campaña

            if (
                idCampana.HasValue &&
                idCampana.Value > 0
            )
            {
                consulta = consulta.Where(
                    p => p.IdCampana == idCampana.Value
                );
            }

            // Filtrar por estado

            if (!string.IsNullOrWhiteSpace(estado))
            {
                string estadoNormalizado =
                    estado.Trim();

                consulta = consulta.Where(
                    p => p.Estado == estadoNormalizado
                );
            }

            // Filtrar por red social

            if (
                idRedSocial.HasValue &&
                idRedSocial.Value > 0
            )
            {
                consulta = consulta.Where(
                    p => p.PublicacionRedesSociales
                        .Any(
                            pr =>
                                pr.IdRedSocial ==
                                idRedSocial.Value
                        )
                );
            }

            // Buscar por título, descripción o campaña

            if (!string.IsNullOrWhiteSpace(buscar))
            {
                string texto =
                    buscar.Trim();

                consulta = consulta.Where(
                    p =>
                        p.Titulo.Contains(texto) ||
                        p.Descripcion.Contains(texto) ||
                        (
                            p.Campana != null &&
                            p.Campana.Nombre.Contains(texto)
                        )
                );
            }

            // Filtrar desde una fecha

            if (fechaDesde.HasValue)
            {
                DateTime fechaInicial =
                    fechaDesde.Value.Date;

                consulta = consulta.Where(
                    p =>
                        p.FechaProgramacion.HasValue &&
                        p.FechaProgramacion.Value >=
                        fechaInicial
                );
            }

            // Filtrar hasta una fecha inclusiva

            if (fechaHasta.HasValue)
            {
                DateTime fechaFinalExclusiva =
                    fechaHasta.Value.Date.AddDays(1);

                consulta = consulta.Where(
                    p =>
                        p.FechaProgramacion.HasValue &&
                        p.FechaProgramacion.Value <
                        fechaFinalExclusiva
                );
            }

            List<Publicacion> publicaciones =
                await consulta
                    .OrderByDescending(
                        p => p.FechaCreacion
                    )
                    .ToListAsync();

            List<PublicacionResponse> respuesta =
                publicaciones
                    .Select(MapearPublicacion)
                    .ToList();

            return Ok(respuesta);
        }

        // =====================================================
        // CONSULTAR UNA PUBLICACIÓN POR ID
        //
        // GET: api/Publicaciones/5
        // =====================================================

        [HttpGet("{id:int}")]
        public async Task<IActionResult>
            GetPublicacionPorId(int id)
        {
            Publicacion? publicacion =
                await ObtenerPublicacionCompleta(id);

            if (publicacion == null)
            {
                return NotFound(new
                {
                    mensaje =
                        "La publicación no existe."
                });
            }

            return Ok(
                MapearPublicacion(publicacion)
            );
        }

        // =====================================================
        // CONSULTAR REDES SOCIALES ACTIVAS
        //
        // GET: api/Publicaciones/redes-sociales
        // =====================================================

        [HttpGet("redes-sociales")]
        public async Task<IActionResult>
            GetRedesSociales()
        {
            var redesSociales =
                await _context.RedesSociales
                    .AsNoTracking()
                    .Where(r => r.Estado)
                    .OrderBy(r => r.Nombre)
                    .Select(r => new
                    {
                        idRedSocial =
                            r.IdRedSocial,

                        nombre =
                            r.Nombre
                    })
                    .ToListAsync();

            return Ok(redesSociales);
        }

        // =====================================================
        // CREAR PUBLICACIÓN
        //
        // POST: api/Publicaciones
        // =====================================================

        [HttpPost]
        public async Task<IActionResult>
            CrearPublicacion(
                [FromBody]
                CreatePublicacionRequest request
            )
        {
            int? idUsuario =
                ObtenerIdUsuarioActual();

            if (!idUsuario.HasValue)
            {
                return Unauthorized(new
                {
                    mensaje =
                        "No fue posible identificar al usuario autenticado."
                });
            }

            // Limpiar campos de texto

            string titulo =
                request.Titulo.Trim();

            string descripcion =
                request.Descripcion.Trim();

            if (string.IsNullOrWhiteSpace(titulo))
            {
                return BadRequest(new
                {
                    mensaje =
                        "El título es obligatorio."
                });
            }

            if (
                string.IsNullOrWhiteSpace(
                    descripcion
                )
            )
            {
                return BadRequest(new
                {
                    mensaje =
                        "La descripción es obligatoria."
                });
            }

            // Validar campaña

            bool campanaExiste =
                await _context.Campanas
                    .AnyAsync(
                        c =>
                            c.IdCampana ==
                            request.IdCampana
                    );

            if (!campanaExiste)
            {
                return BadRequest(new
                {
                    mensaje =
                        "La campaña seleccionada no existe."
                });
            }

            // Validar estado

            string? estado =
                NormalizarEstado(request.Estado);

            if (
                estado != "Borrador" &&
                estado != "Programada"
            )
            {
                return BadRequest(new
                {
                    mensaje =
                        "Una publicación nueva solamente puede crearse como Borrador o Programada."
                });
            }

            // Validar fecha si se está programando

            DateTime? fechaProgramacion = null;

            if (estado == "Programada")
            {
                if (
                    !request.FechaProgramacion
                        .HasValue
                )
                {
                    return BadRequest(new
                    {
                        mensaje =
                            "Las publicaciones programadas deben tener una fecha y una hora."
                    });
                }

                if (
                    request.FechaProgramacion.Value <=
                    DateTime.Now
                )
                {
                    return BadRequest(new
                    {
                        mensaje =
                            "La fecha de programación debe ser futura."
                    });
                }

                fechaProgramacion =
                    request.FechaProgramacion.Value;
            }

            // Eliminar IDs repetidos

            List<int> idsRedesSociales =
                request.IdsRedesSociales?
                    .Where(id => id > 0)
                    .Distinct()
                    .ToList()
                ?? new List<int>();

            if (idsRedesSociales.Count == 0)
            {
                return BadRequest(new
                {
                    mensaje =
                        "Debes seleccionar al menos una red social."
                });
            }

            // Consultar redes válidas y activas

            List<RedSocial> redesSociales =
                await _context.RedesSociales
                    .Where(
                        r =>
                            idsRedesSociales.Contains(
                                r.IdRedSocial
                            ) &&
                            r.Estado
                    )
                    .ToListAsync();

            if (
                redesSociales.Count !=
                idsRedesSociales.Count
            )
            {
                return BadRequest(new
                {
                    mensaje =
                        "Una o varias redes sociales no existen o están inactivas."
                });
            }

            // Crear publicación

            Publicacion publicacion = new()
            {
                Titulo = titulo,

                Descripcion = descripcion,

                TipoMultimedia =
                    string.IsNullOrWhiteSpace(
                        request.TipoMultimedia
                    )
                        ? null
                        : request.TipoMultimedia.Trim(),

                UrlMultimedia =
                    string.IsNullOrWhiteSpace(
                        request.UrlMultimedia
                    )
                        ? null
                        : request.UrlMultimedia.Trim(),

                FechaProgramacion =
                    fechaProgramacion,

                Estado = estado,

                IdCampana =
                    request.IdCampana,

                IdUsuario =
                    idUsuario.Value,

                FechaCreacion =
                    DateTime.Now
            };

            foreach (
                RedSocial redSocial
                in redesSociales
            )
            {
                publicacion
                    .PublicacionRedesSociales
                    .Add(
                        new PublicacionRedSocial
                        {
                            IdRedSocial =
                                redSocial.IdRedSocial
                        }
                    );
            }

            _context.Publicaciones.Add(
                publicacion
            );

            await _context.SaveChangesAsync();

            // Volver a cargar con sus relaciones

            Publicacion? publicacionCreada =
                await ObtenerPublicacionCompleta(
                    publicacion.IdPublicacion
                );

            if (publicacionCreada == null)
            {
                return StatusCode(
                    StatusCodes
                        .Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "La publicación fue creada, pero no pudo recuperarse su información."
                    }
                );
            }

            return CreatedAtAction(
                nameof(GetPublicacionPorId),
                new
                {
                    id =
                        publicacionCreada
                            .IdPublicacion
                },
                new
                {
                    mensaje =
                        estado == "Programada"
                            ? "Publicación programada correctamente."
                            : "Publicación guardada como borrador correctamente.",

                    publicacion =
                        MapearPublicacion(
                            publicacionCreada
                        )
                }
            );
        }
// =====================================================
// EDITAR PUBLICACIÓN
//
// PUT: api/Publicaciones/5
// =====================================================

[HttpPut("{id:int}")]
public async Task<IActionResult> ActualizarPublicacion(
    int id,
    [FromBody] UpdatePublicacionRequest request
)
{
    Publicacion? publicacion =
        await _context.Publicaciones
            .Include(p => p.PublicacionRedesSociales)
            .FirstOrDefaultAsync(
                p => p.IdPublicacion == id
            );

    if (publicacion == null)
    {
        return NotFound(new
        {
            mensaje = "La publicación no existe."
        });
    }

    string titulo = request.Titulo.Trim();
    string descripcion = request.Descripcion.Trim();

    if (string.IsNullOrWhiteSpace(titulo))
    {
        return BadRequest(new
        {
            mensaje = "El título es obligatorio."
        });
    }

    if (string.IsNullOrWhiteSpace(descripcion))
    {
        return BadRequest(new
        {
            mensaje = "La descripción es obligatoria."
        });
    }

    bool campanaExiste =
        await _context.Campanas.AnyAsync(
            c => c.IdCampana == request.IdCampana
        );

    if (!campanaExiste)
    {
        return BadRequest(new
        {
            mensaje =
                "La campaña seleccionada no existe."
        });
    }

    string? estado =
        NormalizarEstado(request.Estado);

    if (
        estado != "Borrador" &&
        estado != "Programada"
    )
    {
        return BadRequest(new
        {
            mensaje =
                "Desde la edición solamente puedes guardar la publicación como Borrador o Programada."
        });
    }

    DateTime? fechaProgramacion = null;

    if (estado == "Programada")
    {
        if (!request.FechaProgramacion.HasValue)
        {
            return BadRequest(new
            {
                mensaje =
                    "Las publicaciones programadas deben tener una fecha y una hora."
            });
        }

        if (
            request.FechaProgramacion.Value <=
            DateTime.Now
        )
        {
            return BadRequest(new
            {
                mensaje =
                    "La fecha de programación debe ser futura."
            });
        }

        fechaProgramacion =
            request.FechaProgramacion.Value;
    }

    var resultadoRedes =
        await ValidarRedesSocialesAsync(
            request.IdsRedesSociales
        );

    if (resultadoRedes.Error != null)
    {
        return BadRequest(new
        {
            mensaje = resultadoRedes.Error
        });
    }

    publicacion.Titulo = titulo;
    publicacion.Descripcion = descripcion;

    publicacion.TipoMultimedia =
        string.IsNullOrWhiteSpace(
            request.TipoMultimedia
        )
            ? null
            : request.TipoMultimedia.Trim();

    publicacion.UrlMultimedia =
        string.IsNullOrWhiteSpace(
            request.UrlMultimedia
        )
            ? null
            : request.UrlMultimedia.Trim();

    publicacion.IdCampana =
        request.IdCampana;

    publicacion.Estado = estado;

    publicacion.FechaProgramacion =
        fechaProgramacion;

    publicacion.FechaActualizacion =
        DateTime.Now;

    SincronizarRedesSociales(
        publicacion,
        resultadoRedes.Redes
    );

    await _context.SaveChangesAsync();

    Publicacion? publicacionActualizada =
        await ObtenerPublicacionCompleta(id);

    return Ok(new
    {
        mensaje =
            "Publicación actualizada correctamente.",

        publicacion =
            publicacionActualizada == null
                ? null
                : MapearPublicacion(
                    publicacionActualizada
                )
    });
}


// =====================================================
// ELIMINAR PUBLICACIÓN
//
// DELETE: api/Publicaciones/5
// =====================================================

[HttpDelete("{id:int}")]
public async Task<IActionResult> EliminarPublicacion(
    int id
)
{
    Publicacion? publicacion =
        await _context.Publicaciones
            .FirstOrDefaultAsync(
                p => p.IdPublicacion == id
            );

    if (publicacion == null)
    {
        return NotFound(new
        {
            mensaje = "La publicación no existe."
        });
    }

    _context.Publicaciones.Remove(publicacion);

    await _context.SaveChangesAsync();

    return Ok(new
    {
        mensaje =
            "Publicación eliminada correctamente."
    });
}


// =====================================================
// PROGRAMAR PUBLICACIÓN
//
// PATCH: api/Publicaciones/5/programar
// =====================================================

[HttpPatch("{id:int}/programar")]
public async Task<IActionResult> ProgramarPublicacion(
    int id,
    [FromBody] ProgramarPublicacionRequest request
)
{
    Publicacion? publicacion =
        await _context.Publicaciones
            .FirstOrDefaultAsync(
                p => p.IdPublicacion == id
            );

    if (publicacion == null)
    {
        return NotFound(new
        {
            mensaje = "La publicación no existe."
        });
    }

    if (
        request.FechaProgramacion <=
        DateTime.Now
    )
    {
        return BadRequest(new
        {
            mensaje =
                "La fecha de programación debe ser futura."
        });
    }

    if (publicacion.Estado == "Publicada")
    {
        return BadRequest(new
        {
            mensaje =
                "Una publicación ya publicada no puede programarse nuevamente."
        });
    }

    publicacion.FechaProgramacion =
        request.FechaProgramacion;

    publicacion.Estado =
        "Programada";

    publicacion.FechaActualizacion =
        DateTime.Now;

    await _context.SaveChangesAsync();

    Publicacion? publicacionProgramada =
        await ObtenerPublicacionCompleta(id);

    return Ok(new
    {
        mensaje =
            "Publicación programada correctamente.",

        publicacion =
            publicacionProgramada == null
                ? null
                : MapearPublicacion(
                    publicacionProgramada
                )
    });
}


// =====================================================
// CANCELAR PUBLICACIÓN PROGRAMADA
//
// PATCH: api/Publicaciones/5/cancelar
// =====================================================

[HttpPatch("{id:int}/cancelar")]
public async Task<IActionResult>
    CancelarPublicacionProgramada(int id)
{
    Publicacion? publicacion =
        await _context.Publicaciones
            .FirstOrDefaultAsync(
                p => p.IdPublicacion == id
            );

    if (publicacion == null)
    {
        return NotFound(new
        {
            mensaje = "La publicación no existe."
        });
    }

    if (publicacion.Estado != "Programada")
    {
        return BadRequest(new
        {
            mensaje =
                "Solamente puedes cancelar una publicación que se encuentre programada."
        });
    }

    publicacion.Estado =
        "Cancelada";

    /*
        Conservamos la fecha anterior para disponer
        de un historial visual de la programación.
    */
    publicacion.FechaActualizacion =
        DateTime.Now;

    await _context.SaveChangesAsync();

    Publicacion? publicacionCancelada =
        await ObtenerPublicacionCompleta(id);

    return Ok(new
    {
        mensaje =
            "Programación cancelada correctamente.",

        publicacion =
            publicacionCancelada == null
                ? null
                : MapearPublicacion(
                    publicacionCancelada
                )
    });
}


// =====================================================
// REAGENDAR PUBLICACIÓN
//
// PATCH: api/Publicaciones/5/reagendar
// =====================================================

[HttpPatch("{id:int}/reagendar")]
public async Task<IActionResult> ReagendarPublicacion(
    int id,
    [FromBody] ProgramarPublicacionRequest request
)
{
    Publicacion? publicacion =
        await _context.Publicaciones
            .FirstOrDefaultAsync(
                p => p.IdPublicacion == id
            );

    if (publicacion == null)
    {
        return NotFound(new
        {
            mensaje = "La publicación no existe."
        });
    }

    if (
        request.FechaProgramacion <=
        DateTime.Now
    )
    {
        return BadRequest(new
        {
            mensaje =
                "La nueva fecha de programación debe ser futura."
        });
    }

    if (publicacion.Estado == "Publicada")
    {
        return BadRequest(new
        {
            mensaje =
                "Una publicación ya publicada no puede reagendarse."
        });
    }

    publicacion.FechaProgramacion =
        request.FechaProgramacion;

    publicacion.Estado =
        "Programada";

    publicacion.FechaActualizacion =
        DateTime.Now;

    await _context.SaveChangesAsync();

    Publicacion? publicacionReagendada =
        await ObtenerPublicacionCompleta(id);

    return Ok(new
    {
        mensaje =
            "Publicación reagendada correctamente.",

        publicacion =
            publicacionReagendada == null
                ? null
                : MapearPublicacion(
                    publicacionReagendada
                )
    });
}


// =====================================================
// DUPLICAR PUBLICACIÓN
//
// POST: api/Publicaciones/5/duplicar
// =====================================================

[HttpPost("{id:int}/duplicar")]
public async Task<IActionResult> DuplicarPublicacion(
    int id,
    [FromBody]
    DuplicarPublicacionRequest? request
)
{
    int? idUsuario =
        ObtenerIdUsuarioActual();

    if (!idUsuario.HasValue)
    {
        return Unauthorized(new
        {
            mensaje =
                "No fue posible identificar al usuario autenticado."
        });
    }

    Publicacion? publicacionOriginal =
        await _context.Publicaciones
            .AsNoTracking()
            .Include(
                p => p.PublicacionRedesSociales
            )
            .FirstOrDefaultAsync(
                p => p.IdPublicacion == id
            );

    if (publicacionOriginal == null)
    {
        return NotFound(new
        {
            mensaje = "La publicación no existe."
        });
    }

    string tituloDuplicado =
        string.IsNullOrWhiteSpace(
            request?.Titulo
        )
            ? $"Copia de {publicacionOriginal.Titulo}"
            : request!.Titulo!.Trim();

    if (tituloDuplicado.Length > 150)
    {
        return BadRequest(new
        {
            mensaje =
                "El título de la publicación duplicada no puede superar los 150 caracteres."
        });
    }

    Publicacion nuevaPublicacion = new()
    {
        Titulo = tituloDuplicado,

        Descripcion =
            publicacionOriginal.Descripcion,

        TipoMultimedia =
            publicacionOriginal.TipoMultimedia,

        UrlMultimedia =
            publicacionOriginal.UrlMultimedia,

        FechaProgramacion = null,

        Estado = "Borrador",

        IdCampana =
            publicacionOriginal.IdCampana,

        IdUsuario =
            idUsuario.Value,

        FechaCreacion =
            DateTime.Now
    };

    foreach (
        PublicacionRedSocial relacion
        in publicacionOriginal
            .PublicacionRedesSociales
    )
    {
        nuevaPublicacion
            .PublicacionRedesSociales
            .Add(
                new PublicacionRedSocial
                {
                    IdRedSocial =
                        relacion.IdRedSocial
                }
            );
    }

    _context.Publicaciones.Add(
        nuevaPublicacion
    );

    await _context.SaveChangesAsync();

    Publicacion? publicacionDuplicada =
        await ObtenerPublicacionCompleta(
            nuevaPublicacion.IdPublicacion
        );

    return CreatedAtAction(
        nameof(GetPublicacionPorId),
        new
        {
            id =
                nuevaPublicacion.IdPublicacion
        },
        new
        {
            mensaje =
                "Publicación duplicada correctamente. La copia fue guardada como borrador.",

            publicacion =
                publicacionDuplicada == null
                    ? null
                    : MapearPublicacion(
                        publicacionDuplicada
                    )
        }
    );
}

// =====================================================
// SUBIR IMAGEN O VIDEO DE UNA PUBLICACIÓN
//
// POST: api/Publicaciones/subir-multimedia
// =====================================================

[HttpPost("subir-multimedia")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> SubirMultimedia(
    [FromForm] IFormFile archivo
)
{
    if (archivo == null || archivo.Length == 0)
    {
        return BadRequest(new
        {
            mensaje = "Debes seleccionar una imagen o video."
        });
    }

    string extension = Path
        .GetExtension(archivo.FileName)
        .ToLowerInvariant();

    string[] extensionesImagen =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    };

    string[] extensionesVideo =
    {
        ".mp4",
        ".webm",
        ".mov"
    };

    bool esImagen =
        extensionesImagen.Contains(extension);

    bool esVideo =
        extensionesVideo.Contains(extension);

    if (!esImagen && !esVideo)
    {
        return BadRequest(new
        {
            mensaje =
                "El formato del archivo no es válido. " +
                "Se permiten imágenes JPG, JPEG, PNG, WEBP y GIF, " +
                "o videos MP4, WEBM y MOV."
        });
    }

    const long tamanoMaximoImagen =
        10 * 1024 * 1024;

    const long tamanoMaximoVideo =
        50 * 1024 * 1024;

    if (
        esImagen &&
        archivo.Length > tamanoMaximoImagen
    )
    {
        return BadRequest(new
        {
            mensaje =
                "La imagen no puede superar los 10 MB."
        });
    }

    if (
        esVideo &&
        archivo.Length > tamanoMaximoVideo
    )
    {
        return BadRequest(new
        {
            mensaje =
                "El video no puede superar los 50 MB."
        });
    }

    string tipoMultimedia =
        esVideo ? "Video" : "Imagen";

    string carpetaUploads = Path.Combine(
        _environment.WebRootPath ??
        Path.Combine(
            _environment.ContentRootPath,
            "wwwroot"
        ),
        "uploads",
        "publicaciones"
    );

    Directory.CreateDirectory(carpetaUploads);

    string nombreArchivo =
        $"{Guid.NewGuid()}{extension}";

    string rutaArchivo = Path.Combine(
        carpetaUploads,
        nombreArchivo
    );

    await using (
        FileStream stream = new(
            rutaArchivo,
            FileMode.Create
        )
    )
    {
        await archivo.CopyToAsync(stream);
    }

    string urlRelativa =
        $"/uploads/publicaciones/{nombreArchivo}";

    string urlCompleta =
        $"{Request.Scheme}://{Request.Host}{urlRelativa}";

    return Ok(new
    {
        mensaje =
            $"{tipoMultimedia} subido correctamente.",

        urlMultimedia =
            urlCompleta,

        tipoMultimedia
    });
}

        // =====================================================
        // OBTENER ID DEL USUARIO DESDE EL JWT
        // =====================================================

        private int? ObtenerIdUsuarioActual()
        {
            string? valorId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            if (
                int.TryParse(
                    valorId,
                    out int idUsuario
                )
            )
            {
                return idUsuario;
            }

            return null;
        }

        // =====================================================
        // CONSULTAR PUBLICACIÓN CON TODAS SUS RELACIONES
        // =====================================================

        private async Task<Publicacion?>
            ObtenerPublicacionCompleta(int id)
        {
            return await _context.Publicaciones
                .AsNoTracking()
                .Include(p => p.Campana)
                .Include(p => p.Usuario)
                .Include(
                    p =>
                        p.PublicacionRedesSociales
                )
                .ThenInclude(
                    pr => pr.RedSocial
                )
                .FirstOrDefaultAsync(
                    p => p.IdPublicacion == id
                );
        }

        // =====================================================
        // MAPEAR ENTIDAD A DTO DE RESPUESTA
        // =====================================================

        private static PublicacionResponse
            MapearPublicacion(
                Publicacion publicacion
            )
        {
           string nombreUsuario =
    publicacion.Usuario == null
        ? string.Empty
        : (
            $"{publicacion.Usuario.Nombre} " +
            $"{publicacion.Usuario.Apellido}"
        ).Trim();

            return new PublicacionResponse
            {
                IdPublicacion =
                    publicacion.IdPublicacion,

                Titulo =
                    publicacion.Titulo,

                Descripcion =
                    publicacion.Descripcion,

                TipoMultimedia =
                    publicacion.TipoMultimedia,

                UrlMultimedia =
                    publicacion.UrlMultimedia,

                FechaProgramacion =
                    publicacion.FechaProgramacion,

                Estado =
                    publicacion.Estado,

                IdCampana =
                    publicacion.IdCampana,

                NombreCampana =
                    publicacion.Campana?.Nombre
                    ?? string.Empty,

                IdUsuario =
                    publicacion.IdUsuario,

                NombreUsuario =
                    nombreUsuario,

                FechaCreacion =
                    publicacion.FechaCreacion,

                FechaActualizacion =
                    publicacion.FechaActualizacion,

                RedesSociales =
                    publicacion
                        .PublicacionRedesSociales
                        .Where(
                            pr =>
                                pr.RedSocial != null
                        )
                        .Select(
                            pr =>
                                new
                                RedSocialPublicacionResponse
                                {
                                    IdRedSocial =
                                        pr.IdRedSocial,

                                    Nombre =
                                        pr.RedSocial!.Nombre
                                }
                        )
                        .OrderBy(
                            r => r.Nombre
                        )
                        .ToList()
            };
        }

        // =====================================================
        // NORMALIZAR ESTADOS
        // =====================================================
// =====================================================
// VALIDAR REDES SOCIALES
// =====================================================

private async Task<(
    List<RedSocial> Redes,
    string? Error
)> ValidarRedesSocialesAsync(
    IEnumerable<int>? idsRedesSociales
)
{
    List<int> idsLimpios =
        idsRedesSociales?
            .Where(id => id > 0)
            .Distinct()
            .ToList()
        ?? new List<int>();

    if (idsLimpios.Count == 0)
    {
        return (
            new List<RedSocial>(),
            "Debes seleccionar al menos una red social."
        );
    }

    List<RedSocial> redesSociales =
        await _context.RedesSociales
            .Where(
                red =>
                    idsLimpios.Contains(
                        red.IdRedSocial
                    ) &&
                    red.Estado
            )
            .ToListAsync();

    if (
        redesSociales.Count !=
        idsLimpios.Count
    )
    {
        return (
            new List<RedSocial>(),
            "Una o varias redes sociales no existen o están inactivas."
        );
    }

    return (
        redesSociales,
        null
    );
}


// =====================================================
// ACTUALIZAR RELACIONES CON REDES SOCIALES
// =====================================================

private void SincronizarRedesSociales(
    Publicacion publicacion,
    IEnumerable<RedSocial> redesSociales
)
{
    HashSet<int> idsSolicitados =
        redesSociales
            .Select(
                red => red.IdRedSocial
            )
            .ToHashSet();

    List<PublicacionRedSocial>
        relacionesAEliminar =
            publicacion
                .PublicacionRedesSociales
                .Where(
                    relacion =>
                        !idsSolicitados.Contains(
                            relacion.IdRedSocial
                        )
                )
                .ToList();

    _context.PublicacionRedesSociales
        .RemoveRange(relacionesAEliminar);

    HashSet<int> idsActuales =
        publicacion
            .PublicacionRedesSociales
            .Where(
                relacion =>
                    idsSolicitados.Contains(
                        relacion.IdRedSocial
                    )
            )
            .Select(
                relacion =>
                    relacion.IdRedSocial
            )
            .ToHashSet();

    foreach (
        int idRedSocial
        in idsSolicitados
    )
    {
        if (idsActuales.Contains(idRedSocial))
        {
            continue;
        }

        publicacion
            .PublicacionRedesSociales
            .Add(
                new PublicacionRedSocial
                {
                    IdPublicacion =
                        publicacion.IdPublicacion,

                    IdRedSocial =
                        idRedSocial
                }
            );
    }
}
        private static string?
            NormalizarEstado(string? estado)
        {
            string valor =
                estado?
                    .Trim()
                    .ToLowerInvariant()
                ?? string.Empty;

            return valor switch
            {
                "borrador" =>
                    "Borrador",

                "programada" =>
                    "Programada",

                "publicada" =>
                    "Publicada",

                "cancelada" =>
                    "Cancelada",

                _ => null
            };
        }
    }
}