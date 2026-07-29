namespace Backend.DTOs.reportes
{
    public class ReporteFiltroRequest
    {
        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public string? EstadoCampana { get; set; }
    }
}