namespace Backend.DTOs.reportes
{
    public class ReporteCampanaResponse
    {
        public int IdCampana { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }

        public decimal Presupuesto { get; set; }

        public int Progreso { get; set; }

        public string Estado { get; set; } = string.Empty;

        public int TotalPublicaciones { get; set; }
    }
}