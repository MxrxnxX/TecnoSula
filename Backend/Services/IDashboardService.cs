using Backend.DTOs.dashboard;

namespace Backend.Services
{
    public interface IDashboardService
    {
        Task<DashboardResumenResponse> ObtenerResumenAsync();

        Task<DashboardResumenResponse> ObtenerResumenFiltradoAsync(
            DashboardFiltroRequest filtro
        );

        Task<List<PublicacionesPorRedResponse>>
            ObtenerPublicacionesPorRedAsync();

        Task<List<CampanasPorEstadoResponse>>
            ObtenerCampanasPorEstadoAsync();
    }
}