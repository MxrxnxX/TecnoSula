using Backend.Data;
using Backend.DTOs.reportes;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Backend.Services
{
    public class ReporteService : IReporteService
    {
        private readonly AppDbContext _context;

        public ReporteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReporteCampanaResponse>>
            ObtenerReporteCampanasAsync(
                ReporteFiltroRequest filtro
            )
        {
            var consulta =
                _context.Campanas.AsQueryable();

            if (filtro.FechaInicio.HasValue)
            {
                consulta = consulta.Where(
                    c => c.FechaInicio >=
                         filtro.FechaInicio.Value.Date
                );
            }

            if (filtro.FechaFin.HasValue)
            {
                var fechaLimite =
                    filtro.FechaFin.Value.Date.AddDays(1);

                consulta = consulta.Where(
                    c => c.FechaInicio < fechaLimite
                );
            }

            if (!string.IsNullOrWhiteSpace(
                filtro.EstadoCampana
            ))
            {
                var estado =
                    filtro.EstadoCampana.Trim();

                consulta = consulta.Where(
                    c => c.Estado == estado
                );
            }

            return await consulta
                .OrderByDescending(c => c.FechaInicio)
                .Select(c => new ReporteCampanaResponse
                {
                    IdCampana = c.IdCampana,
                    Nombre = c.Nombre,
                    Descripcion = c.Descripcion,
                    FechaInicio = c.FechaInicio,
                    FechaFin = c.FechaFin,
                    Presupuesto = c.Presupuesto ?? 0,
                    Progreso = c.Progreso,
                    Estado = c.Estado,

                    TotalPublicaciones =
                        _context.Publicaciones.Count(
                            p => p.IdCampana == c.IdCampana
                        )
                })
                .ToListAsync();
        }

        public async Task<byte[]> GenerarExcelAsync(
            ReporteFiltroRequest filtro
        )
        {
            var datos =
                await ObtenerReporteCampanasAsync(filtro);

            using var libro = new XLWorkbook();

            var hoja =
                libro.Worksheets.Add(
                    "Reporte de campañas"
                );

            hoja.Cell("A1").Value =
                "TECNOSULA - REPORTE DE CAMPAÑAS";

            hoja.Range("A1:I1").Merge();

            hoja.Cell("A1").Style.Font.Bold = true;
            hoja.Cell("A1").Style.Font.FontSize = 16;
            hoja.Cell("A1").Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Center;

            hoja.Cell("A2").Value =
                $"Generado: {DateTime.Now:dd/MM/yyyy HH:mm}";

            hoja.Range("A2:I2").Merge();

            hoja.Cell("A4").Value = "ID";
            hoja.Cell("B4").Value = "Nombre";
            hoja.Cell("C4").Value = "Descripción";
            hoja.Cell("D4").Value = "Fecha inicio";
            hoja.Cell("E4").Value = "Fecha final";
            hoja.Cell("F4").Value = "Presupuesto";
            hoja.Cell("G4").Value = "Progreso";
            hoja.Cell("H4").Value = "Estado";
            hoja.Cell("I4").Value = "Publicaciones";

            var encabezados =
                hoja.Range("A4:I4");

            encabezados.Style.Font.Bold = true;
            encabezados.Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Center;

            var fila = 5;

            foreach (var campana in datos)
            {
                hoja.Cell(fila, 1).Value =
                    campana.IdCampana;

                hoja.Cell(fila, 2).Value =
                    campana.Nombre;

                hoja.Cell(fila, 3).Value =
                    campana.Descripcion ?? "";

                hoja.Cell(fila, 4).Value =
                    campana.FechaInicio;

                hoja.Cell(fila, 5).Value =
                    campana.FechaFin;

                hoja.Cell(fila, 6).Value =
                    campana.Presupuesto;

                hoja.Cell(fila, 7).Value =
                    campana.Progreso / 100.0;

                hoja.Cell(fila, 8).Value =
                    campana.Estado;

                hoja.Cell(fila, 9).Value =
                    campana.TotalPublicaciones;

                fila++;
            }

            if (datos.Count > 0)
            {
                hoja.Range(
                    5,
                    4,
                    fila - 1,
                    5
                ).Style.DateFormat.Format =
                    "dd/MM/yyyy";

                hoja.Range(
                    5,
                    6,
                    fila - 1,
                    6
                ).Style.NumberFormat.Format =
                    "₡ #,##0.00";

                hoja.Range(
                    5,
                    7,
                    fila - 1,
                    7
                ).Style.NumberFormat.Format =
                    "0%";
            }

            hoja.Columns().AdjustToContents();

            if (hoja.Column(3).Width > 45)
            {
                hoja.Column(3).Width = 45;
            }

            hoja.Column(3).Style.Alignment.WrapText = true;

            hoja.SheetView.FreezeRows(4);

            using var memoria =
                new MemoryStream();

            libro.SaveAs(memoria);

            return memoria.ToArray();
        }

        public async Task<byte[]> GenerarPdfAsync(
    ReporteFiltroRequest filtro
)
{
    var datos =
        await ObtenerReporteCampanasAsync(filtro);

    var documento = Document.Create(contenedor =>
    {
        contenedor.Page(pagina =>
        {
            pagina.Size(PageSizes.A4.Landscape());

            pagina.Margin(25);

            pagina.PageColor(Colors.White);

            pagina.DefaultTextStyle(
                estilo => estilo
                    .FontSize(9)
                    .FontColor(Colors.Grey.Darken3)
            );

            // =============================================
            // ENCABEZADO
            // =============================================

            pagina.Header()
                .Column(columna =>
                {
                    columna.Spacing(5);

                    columna.Item()
                        .Text("TECNOSULA")
                        .Bold()
                        .FontSize(20)
                        .FontColor(Colors.Blue.Darken2);

                    columna.Item()
                        .Text("Reporte de campañas")
                        .SemiBold()
                        .FontSize(14);

                    columna.Item()
                        .Text(
                            $"Generado: {DateTime.Now:dd/MM/yyyy HH:mm}"
                        )
                        .FontSize(9)
                        .FontColor(Colors.Grey.Darken1);

                    columna.Item()
                        .PaddingTop(5)
                        .LineHorizontal(1)
                        .LineColor(Colors.Grey.Lighten2);
                });

            // =============================================
            // CONTENIDO
            // =============================================

            pagina.Content()
                .PaddingVertical(15)
                .Column(columna =>
                {
                    columna.Spacing(12);

                    columna.Item()
                        .Row(fila =>
                        {
                            fila.RelativeItem()
                                .Text(
                                    $"Total de campañas: {datos.Count}"
                                )
                                .SemiBold();

                            fila.RelativeItem()
                                .AlignRight()
                                .Text(
                                    $"Presupuesto total: ₡{datos.Sum(c => c.Presupuesto):N2}"
                                )
                                .SemiBold();
                        });

                    if (datos.Count == 0)
                    {
                        columna.Item()
                            .PaddingTop(30)
                            .AlignCenter()
                            .Text(
                                "No se encontraron campañas con los filtros seleccionados."
                            )
                            .FontSize(12)
                            .FontColor(Colors.Grey.Darken1);

                        return;
                    }

                    columna.Item()
                        .Table(tabla =>
                        {
                            tabla.ColumnsDefinition(columnas =>
                            {
                                columnas.ConstantColumn(35);
                                columnas.RelativeColumn(1.4f);
                                columnas.RelativeColumn(2.2f);
                                columnas.ConstantColumn(65);
                                columnas.ConstantColumn(65);
                                columnas.ConstantColumn(85);
                                columnas.ConstantColumn(60);
                                columnas.ConstantColumn(65);
                                columnas.ConstantColumn(65);
                            });

                            tabla.Header(encabezado =>
                            {
                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("ID");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Nombre");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Descripción");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Inicio");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Final");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Presupuesto");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Progreso");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Estado");

                                encabezado.Cell()
                                    .Element(EstiloEncabezado)
                                    .Text("Publicaciones");
                            });

                            foreach (var campana in datos)
                            {
                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(
                                        campana.IdCampana.ToString()
                                    );

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(campana.Nombre);

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(
                                        campana.Descripcion ??
                                        "Sin descripción"
                                    );

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(
                                        campana.FechaInicio
                                            .ToString("dd/MM/yyyy")
                                    );

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(
                                        campana.FechaFin
                                            .ToString("dd/MM/yyyy")
                                    );

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(
                                        $"₡{campana.Presupuesto:N2}"
                                    );

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(
                                        $"{campana.Progreso}%"
                                    );

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(campana.Estado);

                                tabla.Cell()
                                    .Element(EstiloCelda)
                                    .Text(
                                        campana.TotalPublicaciones
                                            .ToString()
                                    );
                            }
                        });
                });

            // =============================================
            // PIE DE PÁGINA
            // =============================================

            pagina.Footer()
                .AlignCenter()
                .Text(texto =>
                {
                    texto.Span("Página ");

                    texto.CurrentPageNumber();

                    texto.Span(" de ");

                    texto.TotalPages();
                });
        });
    });

    return documento.GeneratePdf();
}
private static IContainer EstiloEncabezado(
    IContainer contenedor
)
{
    return contenedor
        .Background(Colors.Blue.Darken2)
        .Border(0.5f)
        .BorderColor(Colors.Grey.Lighten1)
        .PaddingVertical(7)
        .PaddingHorizontal(4)
        .AlignCenter()
        .AlignMiddle()
        .DefaultTextStyle(
            estilo => estilo
                .Bold()
                .FontSize(8)
                .FontColor(Colors.White)
        );
}

private static IContainer EstiloCelda(
    IContainer contenedor
)
{
    return contenedor
        .BorderBottom(0.5f)
        .BorderColor(Colors.Grey.Lighten2)
        .PaddingVertical(6)
        .PaddingHorizontal(4)
        .AlignMiddle();
}
    }
}