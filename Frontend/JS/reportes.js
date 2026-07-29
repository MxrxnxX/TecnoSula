document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =====================================================
    // PROTEGER LA PÁGINA
    // =====================================================

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // =====================================================
    // ELEMENTOS DEL HTML
    // =====================================================

    const totalCampanasElement =
        document.getElementById("totalCampanas");

    const totalPublicacionesElement =
        document.getElementById("totalPublicaciones");

    const publicacionesProgramadasElement =
        document.getElementById("publicacionesProgramadas");

    const presupuestoTotalElement =
        document.getElementById("presupuestoTotal");

    const progresoPromedioElement =
        document.getElementById("progresoPromedio");

    const campanasPorEstadoElement =
        document.getElementById("campanasPorEstado");

    const publicacionesPorRedElement =
        document.getElementById("publicacionesPorRed");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const openSidebarButton =
        document.getElementById("openSidebar");

    const closeSidebarButton =
        document.getElementById("closeSidebar");

    const logoutButton =
        document.getElementById("logoutButton");
        const fechaInicioElement =
     document.getElementById("fechaInicio");

    const fechaFinElement =
     document.getElementById("fechaFin");

    const estadoCampanaElement =
     document.getElementById("estadoCampana");

    const aplicarFiltrosButton =
     document.getElementById("aplicarFiltros");

    const limpiarFiltrosButton =
     document.getElementById("limpiarFiltros");
     const exportarExcelButton =
    document.getElementById("exportarExcel");
    const exportarPdfButton =
    document.getElementById("exportarPdf");

    // =====================================================
    // ICONOS
    // =====================================================

    function renderIcons() {
        if (
            typeof lucide !== "undefined" &&
            typeof lucide.createIcons === "function"
        ) {
            lucide.createIcons();
        }
    }

    renderIcons();

    // =====================================================
    // MENÚ LATERAL
    // =====================================================

    function abrirSidebar() {
        sidebar?.classList.add("open");
        sidebarOverlay?.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function cerrarSidebar() {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove("show");
        document.body.style.overflow = "";
    }

    openSidebarButton?.addEventListener(
        "click",
        abrirSidebar
    );

    closeSidebarButton?.addEventListener(
        "click",
        cerrarSidebar
    );

    sidebarOverlay?.addEventListener(
        "click",
        cerrarSidebar
    );

    // =====================================================
    // FORMATO DE MONEDA
    // =====================================================

    function formatearColones(valor) {
        return new Intl.NumberFormat(
            "es-CR",
            {
                style: "currency",
                currency: "CRC",
                minimumFractionDigits: 2
            }
        ).format(valor ?? 0);
    }

    // =====================================================
    // CARGAR RESUMEN
    // =====================================================

    async function cargarResumen() {
        try {
            const respuesta = await fetch(
                "http://localhost:5208/api/Dashboard/resumen",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    `Error al cargar resumen: ${respuesta.status}`
                );
            }

            const resumen = await respuesta.json();

            totalCampanasElement.textContent =
                resumen.totalCampanas ?? 0;

            totalPublicacionesElement.textContent =
                resumen.totalPublicaciones ?? 0;

            publicacionesProgramadasElement.textContent =
                resumen.publicacionesProgramadas ?? 0;

            presupuestoTotalElement.textContent =
                formatearColones(
                    resumen.presupuestoTotal
                );

            progresoPromedioElement.textContent =
                `${resumen.progresoPromedio ?? 0}%`;

        } catch (error) {
            console.error(
                "No se pudo cargar el resumen:",
                error
            );
        }
    }
    async function cargarResumenFiltrado() {
    try {
        const parametros =
            new URLSearchParams();

        const fechaInicio =
            fechaInicioElement?.value;

        const fechaFin =
            fechaFinElement?.value;

        const estadoCampana =
            estadoCampanaElement?.value;

        if (fechaInicio) {
            parametros.append(
                "fechaInicio",
                fechaInicio
            );
        }

        if (fechaFin) {
            parametros.append(
                "fechaFin",
                fechaFin
            );
        }

        if (estadoCampana) {
            parametros.append(
                "estadoCampana",
                estadoCampana
            );
        }

        const url =
            "http://localhost:5208/api/Dashboard/resumen-filtrado" +
            (
                parametros.toString()
                    ? `?${parametros.toString()}`
                    : ""
            );

        const respuesta = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {
            const mensaje =
                await respuesta.text();

            throw new Error(
                mensaje ||
                `Error al aplicar filtros: ${respuesta.status}`
            );
        }

        const resumen =
            await respuesta.json();

        totalCampanasElement.textContent =
            resumen.totalCampanas ?? 0;

        totalPublicacionesElement.textContent =
            resumen.totalPublicaciones ?? 0;

        publicacionesProgramadasElement.textContent =
            resumen.publicacionesProgramadas ?? 0;

        presupuestoTotalElement.textContent =
            formatearColones(
                resumen.presupuestoTotal
            );

        progresoPromedioElement.textContent =
            `${resumen.progresoPromedio ?? 0}%`;

    } catch (error) {
        console.error(
            "No se pudieron aplicar los filtros:",
            error
        );

        alert(
            "No se pudieron aplicar los filtros. Revisa las fechas seleccionadas."
        );
    }
}

    // =====================================================
    // CAMPAÑAS POR ESTADO
    // =====================================================

    async function cargarCampanasPorEstado() {
        try {
            const respuesta = await fetch(
                "http://localhost:5208/api/Dashboard/campanas-por-estado",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    `Error al cargar campañas: ${respuesta.status}`
                );
            }

            const datos = await respuesta.json();

            if (!datos.length) {
                campanasPorEstadoElement.innerHTML =
                    "<p>No hay campañas registradas.</p>";

                return;
            }

            campanasPorEstadoElement.innerHTML =
                datos
                    .map(item => {
                        return `
                            <div class="chart-item">
                                <div class="chart-item-info">
                                    <span>${item.estado}</span>
                                    <strong>${item.cantidad}</strong>
                                </div>

                                <div class="chart-bar">
                                    <div
                                        class="chart-bar-fill"
                                        style="width: ${Math.min(
                                            item.cantidad * 20,
                                            100
                                        )}%"
                                    ></div>
                                </div>
                            </div>
                        `;
                    })
                    .join("");

        } catch (error) {
            console.error(
                "No se pudieron cargar las campañas por estado:",
                error
            );

            campanasPorEstadoElement.innerHTML =
                "<p>No se pudo cargar la información.</p>";
        }
    }

    // =====================================================
    // PUBLICACIONES POR RED SOCIAL
    // =====================================================

    async function cargarPublicacionesPorRed() {
        try {
            const respuesta = await fetch(
                "http://localhost:5208/api/Dashboard/publicaciones-por-red",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    `Error al cargar publicaciones: ${respuesta.status}`
                );
            }

            const datos = await respuesta.json();

            if (!datos.length) {
                publicacionesPorRedElement.innerHTML =
                    "<p>No hay publicaciones registradas.</p>";

                return;
            }

            publicacionesPorRedElement.innerHTML =
                datos
                    .map(item => {
                        return `
                            <div class="chart-item">
                                <div class="chart-item-info">
                                    <span>${item.nombreRedSocial}</span>
                                    <strong>${item.cantidadPublicaciones}</strong>
                                </div>

                                <div class="chart-bar">
                                    <div
                                        class="chart-bar-fill"
                                        style="width: ${Math.min(
                                            item.cantidadPublicaciones * 20,
                                            100
                                        )}%"
                                    ></div>
                                </div>
                            </div>
                        `;
                    })
                    .join("");

        } catch (error) {
            console.error(
                "No se pudieron cargar las publicaciones por red:",
                error
            );

            publicacionesPorRedElement.innerHTML =
                "<p>No se pudo cargar la información.</p>";
        }
    }
// =====================================================
// EVENTOS DE FILTROS
// =====================================================
exportarExcelButton?.addEventListener(
    "click",
    exportarExcel
);

aplicarFiltrosButton?.addEventListener(
    "click",
    () => {
        const fechaInicio =
            fechaInicioElement?.value;

        const fechaFin =
            fechaFinElement?.value;

        if (
            fechaInicio &&
            fechaFin &&
            fechaInicio > fechaFin
        ) {
            alert(
                "La fecha inicial no puede ser mayor que la fecha final."
            );

            return;
        }

        cargarResumenFiltrado();
    }
);

limpiarFiltrosButton?.addEventListener(
    "click",
    () => {
        if (fechaInicioElement) {
            fechaInicioElement.value = "";
        }

        if (fechaFinElement) {
            fechaFinElement.value = "";
        }

        if (estadoCampanaElement) {
            estadoCampanaElement.value = "";
        }

        cargarResumen();
    }
);
    // =====================================================
    // CERRAR SESIÓN
    // =====================================================
    async function exportarExcel() {
        async function exportarPdf() {
    try {
        const parametros =
            new URLSearchParams();

        const fechaInicio =
            fechaInicioElement?.value;

        const fechaFin =
            fechaFinElement?.value;

        const estadoCampana =
            estadoCampanaElement?.value;

        if (
            fechaInicio &&
            fechaFin &&
            fechaInicio > fechaFin
        ) {
            alert(
                "La fecha inicial no puede ser mayor que la fecha final."
            );

            return;
        }

        if (fechaInicio) {
            parametros.append(
                "fechaInicio",
                fechaInicio
            );
        }

        if (fechaFin) {
            parametros.append(
                "fechaFin",
                fechaFin
            );
        }

        if (estadoCampana) {
            parametros.append(
                "estadoCampana",
                estadoCampana
            );
        }

        const url =
            "http://localhost:5208/api/Reportes/pdf" +
            (
                parametros.toString()
                    ? `?${parametros.toString()}`
                    : ""
            );

        exportarPdfButton.disabled = true;

        exportarPdfButton.textContent =
            "Generando...";

        const respuesta = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {
            const mensaje =
                await respuesta.text();

            throw new Error(
                mensaje ||
                `Error al generar PDF: ${respuesta.status}`
            );
        }

        const archivo =
            await respuesta.blob();

        const urlArchivo =
            window.URL.createObjectURL(archivo);

        const enlace =
            document.createElement("a");

        enlace.href = urlArchivo;

        enlace.download =
            `Reporte_Campanas_${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`;

        document.body.appendChild(enlace);

        enlace.click();

        enlace.remove();

        window.URL.revokeObjectURL(
            urlArchivo
        );

    } catch (error) {
        console.error(
            "No se pudo exportar el PDF:",
            error
        );

        alert(
            "No se pudo generar el archivo PDF."
        );

    } finally {
        exportarPdfButton.disabled = false;

        exportarPdfButton.innerHTML = `
            <i data-lucide="file-text"></i>
            Exportar PDF
        `;

        renderIcons();
    }
}
    try {
        const parametros =
            new URLSearchParams();

        const fechaInicio =
            fechaInicioElement?.value;

        const fechaFin =
            fechaFinElement?.value;

        const estadoCampana =
            estadoCampanaElement?.value;

        if (
            fechaInicio &&
            fechaFin &&
            fechaInicio > fechaFin
        ) {
            alert(
                "La fecha inicial no puede ser mayor que la fecha final."
            );

            return;
        }

        if (fechaInicio) {
            parametros.append(
                "fechaInicio",
                fechaInicio
            );
        }

        if (fechaFin) {
            parametros.append(
                "fechaFin",
                fechaFin
            );
        }

        if (estadoCampana) {
            parametros.append(
                "estadoCampana",
                estadoCampana
            );
        }

        const url =
            "http://localhost:5208/api/Reportes/excel" +
            (
                parametros.toString()
                    ? `?${parametros.toString()}`
                    : ""
            );

        exportarExcelButton.disabled = true;
        exportarExcelButton.textContent =
            "Generando...";
        exportarPdfButton?.addEventListener(
            "click",
            exportarPdf
);  

        const respuesta = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {
            const mensaje =
                await respuesta.text();

            throw new Error(
                mensaje ||
                `Error al generar Excel: ${respuesta.status}`
            );
        }

        const archivo =
            await respuesta.blob();

        const urlArchivo =
            window.URL.createObjectURL(archivo);

        const enlace =
            document.createElement("a");

        enlace.href = urlArchivo;

        enlace.download =
            `Reporte_Campanas_${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;

        document.body.appendChild(enlace);

        enlace.click();

        enlace.remove();

        window.URL.revokeObjectURL(
            urlArchivo
        );

    } catch (error) {
        console.error(
            "No se pudo exportar el Excel:",
            error
        );

        alert(
            "No se pudo generar el archivo Excel."
        );

    } finally {
        exportarExcelButton.disabled = false;

        exportarExcelButton.innerHTML = `
            <i data-lucide="file-spreadsheet"></i>
            Exportar Excel
        `;

        renderIcons();
    }
}

    logoutButton?.addEventListener(
        "click",
        () => {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            localStorage.removeItem("nombre");
            localStorage.removeItem("userName");

            window.location.href = "index.html";
        }
    );

    // =====================================================
    // CARGAR TODO
    // =====================================================

    Promise.all([
        cargarResumen(),
        cargarCampanasPorEstado(),
        cargarPublicacionesPorRed()
    ]);
});