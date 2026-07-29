using Backend.DTOs.reportes;

namespace Backend.Services
{
    public interface IReporteService
    {
        Task<List<ReporteCampanaResponse>>
            ObtenerReporteCampanasAsync(
                ReporteFiltroRequest filtro
            );

        Task<byte[]> GenerarExcelAsync(
            ReporteFiltroRequest filtro
        );
        Task<byte[]> GenerarPdfAsync(
          ReporteFiltroRequest filtro
);
    }
}