namespace Backend.DTOs.dashboard
{
    public class DashboardResumenResponse
    {
        public int TotalCampanas { get; set; }

        public int CampanasActivas { get; set; }

        public int CampanasFinalizadas { get; set; }

        public int TotalPublicaciones { get; set; }

        public int PublicacionesBorrador { get; set; }

        public int PublicacionesProgramadas { get; set; }

        public int PublicacionesPublicadas { get; set; }

        public decimal PresupuestoTotal { get; set; }

        public double ProgresoPromedio { get; set; }
    }
}