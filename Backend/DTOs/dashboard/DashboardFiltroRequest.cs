namespace Backend.DTOs.dashboard
{
    public class DashboardFiltroRequest
    {
        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public string? EstadoCampana { get; set; }
    }
}