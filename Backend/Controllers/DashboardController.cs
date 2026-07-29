using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs.dashboard;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(
            IDashboardService dashboardService
        )
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> ObtenerResumen()
        
        {
            var resultado =
                await _dashboardService.ObtenerResumenAsync();

            return Ok(resultado);
        }
        [HttpGet("resumen-filtrado")]
public async Task<IActionResult> ObtenerResumenFiltrado(
    [FromQuery] DashboardFiltroRequest filtro
)
{
    if (
        filtro.FechaInicio.HasValue &&
        filtro.FechaFin.HasValue &&
        filtro.FechaInicio.Value.Date >
        filtro.FechaFin.Value.Date
    )
    {
        return BadRequest(
            "La fecha de inicio no puede ser mayor que la fecha final."
        );
    }

    var resultado =
        await _dashboardService
            .ObtenerResumenFiltradoAsync(filtro);

    return Ok(resultado);
}

        [HttpGet("publicaciones-por-red")]
        public async Task<IActionResult>
            ObtenerPublicacionesPorRed()
        {
            var resultado =
                await _dashboardService
                    .ObtenerPublicacionesPorRedAsync();

            return Ok(resultado);
        }

        [HttpGet("campanas-por-estado")]
        public async Task<IActionResult>
            ObtenerCampanasPorEstado()
        {
            var resultado =
                await _dashboardService
                    .ObtenerCampanasPorEstadoAsync();

            return Ok(resultado);
        }
    }
}