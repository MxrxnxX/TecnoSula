using Backend.Data;
using Backend.DTOs.dashboard;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardResumenResponse> ObtenerResumenAsync()
        {
            var totalCampanas = await _context.Campanas.CountAsync();

            var campanasActivas = await _context.Campanas
                .CountAsync(c => c.Estado == "Activa");

            var campanasFinalizadas = await _context.Campanas
                .CountAsync(c => c.Estado == "Finalizada");

            var totalPublicaciones = await _context.Publicaciones.CountAsync();

            var publicacionesBorrador = await _context.Publicaciones
                .CountAsync(p => p.Estado == "Borrador");

            var publicacionesProgramadas = await _context.Publicaciones
                .CountAsync(p => p.Estado == "Programada");

            var publicacionesPublicadas = await _context.Publicaciones
                .CountAsync(p => p.Estado == "Publicada");

            var presupuestoTotal = await _context.Campanas
                .Where(c => c.Presupuesto.HasValue)
                .SumAsync(c => c.Presupuesto ?? 0);

            var progresoPromedio = totalCampanas > 0
                ? await _context.Campanas.AverageAsync(c => c.Progreso)
                : 0;

            return new DashboardResumenResponse
            {
                TotalCampanas = totalCampanas,
                CampanasActivas = campanasActivas,
                CampanasFinalizadas = campanasFinalizadas,
                TotalPublicaciones = totalPublicaciones,
                PublicacionesBorrador = publicacionesBorrador,
                PublicacionesProgramadas = publicacionesProgramadas,
                PublicacionesPublicadas = publicacionesPublicadas,
                PresupuestoTotal = presupuestoTotal,
                ProgresoPromedio = progresoPromedio
            };
        }
public async Task<DashboardResumenResponse>
    ObtenerResumenFiltradoAsync(DashboardFiltroRequest filtro)
{
    var campanasQuery =
        _context.Campanas.AsQueryable();

    // Filtrar campañas que comienzan desde la fecha seleccionada
    if (filtro.FechaInicio.HasValue)
    {
        campanasQuery = campanasQuery.Where(
            c => c.FechaInicio >= filtro.FechaInicio.Value.Date
        );
    }

    // Incluye todo el día de la fecha final
    if (filtro.FechaFin.HasValue)
    {
        var fechaLimite =
            filtro.FechaFin.Value.Date.AddDays(1);

        campanasQuery = campanasQuery.Where(
            c => c.FechaInicio < fechaLimite
        );
    }

    // Filtrar por estado
    if (!string.IsNullOrWhiteSpace(filtro.EstadoCampana))
    {
        var estado = filtro.EstadoCampana.Trim();

        campanasQuery = campanasQuery.Where(
            c => c.Estado == estado
        );
    }

    var idsCampanasFiltradas =
        campanasQuery.Select(c => c.IdCampana);

    var publicacionesQuery =
        _context.Publicaciones.Where(
            p => idsCampanasFiltradas.Contains(p.IdCampana)
        );

    var totalCampanas =
        await campanasQuery.CountAsync();

    var campanasActivas =
        await campanasQuery.CountAsync(
            c => c.Estado == "Activa"
        );

    var campanasFinalizadas =
        await campanasQuery.CountAsync(
            c => c.Estado == "Finalizada"
        );

    var totalPublicaciones =
        await publicacionesQuery.CountAsync();

    var publicacionesBorrador =
        await publicacionesQuery.CountAsync(
            p => p.Estado == "Borrador"
        );

    var publicacionesProgramadas =
        await publicacionesQuery.CountAsync(
            p => p.Estado == "Programada"
        );

    var publicacionesPublicadas =
        await publicacionesQuery.CountAsync(
            p => p.Estado == "Publicada"
        );

    var presupuestoTotal =
        await campanasQuery.SumAsync(
            c => c.Presupuesto ?? 0
        );

    var progresoPromedio =
        totalCampanas > 0
            ? await campanasQuery.AverageAsync(
                c => c.Progreso
            )
            : 0;

    return new DashboardResumenResponse
    {
        TotalCampanas = totalCampanas,
        CampanasActivas = campanasActivas,
        CampanasFinalizadas = campanasFinalizadas,
        TotalPublicaciones = totalPublicaciones,
        PublicacionesBorrador = publicacionesBorrador,
        PublicacionesProgramadas = publicacionesProgramadas,
        PublicacionesPublicadas = publicacionesPublicadas,
        PresupuestoTotal = presupuestoTotal,
        ProgresoPromedio = progresoPromedio
    };
}
        public async Task<List<PublicacionesPorRedResponse>>
            ObtenerPublicacionesPorRedAsync()
        {
            return await _context.RedesSociales
                .Select(r => new PublicacionesPorRedResponse
                {
                    IdRedSocial = r.IdRedSocial,
                    NombreRedSocial = r.Nombre,
                    CantidadPublicaciones =
                        r.PublicacionRedesSociales.Count()
                })
                .OrderByDescending(r => r.CantidadPublicaciones)
                .ToListAsync();
        }

        public async Task<List<CampanasPorEstadoResponse>>
            ObtenerCampanasPorEstadoAsync()
        {
            return await _context.Campanas
                .GroupBy(c => c.Estado)
                .Select(grupo => new CampanasPorEstadoResponse
                {
                    Estado = grupo.Key,
                    Cantidad = grupo.Count()
                })
                .OrderByDescending(c => c.Cantidad)
                .ToListAsync();
        }
    }
}