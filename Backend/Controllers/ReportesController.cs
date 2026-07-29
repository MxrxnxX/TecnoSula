using Backend.DTOs.reportes;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportesController : ControllerBase
    {
        private readonly IReporteService _reporteService;

        public ReportesController(
            IReporteService reporteService
        )
        {
            _reporteService = reporteService;
        }

        [HttpGet("campanas")]
        public async Task<IActionResult> ObtenerReporteCampanas(
            [FromQuery] ReporteFiltroRequest filtro
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
                await _reporteService
                    .ObtenerReporteCampanasAsync(filtro);

            return Ok(resultado);
        }

        [HttpGet("excel")]
        public async Task<IActionResult> ExportarExcel(
            [FromQuery] ReporteFiltroRequest filtro
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

            var archivo =
                await _reporteService
                    .GenerarExcelAsync(filtro);

            var nombreArchivo =
                $"Reporte_Campanas_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

            return File(
                archivo,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                nombreArchivo
            );
        }
        [HttpGet("pdf")]
public async Task<IActionResult> ExportarPdf(
    [FromQuery] ReporteFiltroRequest filtro
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

    var archivo =
        await _reporteService
            .GenerarPdfAsync(filtro);

    var nombreArchivo =
        $"Reporte_Campanas_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

    return File(
        archivo,
        "application/pdf",
        nombreArchivo
    );
}
    }
}