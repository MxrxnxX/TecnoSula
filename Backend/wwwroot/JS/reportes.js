document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const API_BASE_URL = "http://localhost:5208/api";
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

    const fechaInicioElement =
        document.getElementById("fechaInicio");

    const fechaFinElement =
        document.getElementById("fechaFin");

    const limpiarFechaInicioButton =
    document.getElementById("limpiarFechaInicio");

const limpiarFechaFinButton =
    document.getElementById("limpiarFechaFin");

const estadoCampanaButtons =
    document.querySelectorAll(
        ".state-filter-button"
    );

let estadoCampanaSeleccionado = "";

let fechaInicioPicker = null;
let fechaFinPicker = null;
let temporizadorFiltros = null;

    const exportarExcelButton =
        document.getElementById("exportarExcel");

    const exportarPdfButton =
        document.getElementById("exportarPdf");

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

    const employeeNameElement =
        document.getElementById("employeeName");

    const employeeInitialsElement =
        document.getElementById("employeeInitials");

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
    // INFORMACIÓN DEL USUARIO
    // =====================================================

    function cargarInformacionUsuario() {
        const nombre =
            localStorage.getItem("nombre") ||
            localStorage.getItem("userName") ||
            "Empleado";

        if (employeeNameElement) {
            employeeNameElement.textContent = nombre;
        }

        if (employeeInitialsElement) {
            const iniciales = nombre
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(parte => parte.charAt(0).toUpperCase())
                .join("");

            employeeInitialsElement.textContent =
                iniciales || "EM";
        }
    }

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
        return new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
            minimumFractionDigits: 2
        }).format(Number(valor) || 0);
    }

    // =====================================================
    // FILTROS
    // =====================================================

    function validarFechas() {
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

            return false;
        }

        return true;
    }

    function obtenerParametrosFiltros() {
    const parametros =
        new URLSearchParams();

    const fechaInicio =
        fechaInicioElement?.value;

    const fechaFin =
        fechaFinElement?.value;

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

    if (estadoCampanaSeleccionado) {
        parametros.append(
            "estadoCampana",
            estadoCampanaSeleccionado
        );
    }

    return parametros;
}
// =====================================================
// APLICACIÓN AUTOMÁTICA DE FILTROS
// =====================================================

function programarAplicacionAutomatica() {
    clearTimeout(temporizadorFiltros);

    temporizadorFiltros = setTimeout(
        () => {
            cargarResumenFiltrado();
        },
        250
    );
}
// =====================================================
// CALENDARIOS PERSONALIZADOS
// =====================================================

function inicializarCalendarios() {
    if (typeof flatpickr !== "function") {
        console.error(
            "Flatpickr no está disponible."
        );

        return;
    }

    const localeEspanol =
        window.flatpickr?.l10ns?.es ||
        "default";

    const configuracionBase = {
        locale: localeEspanol,
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        allowInput: false,
        disableMobile: true,
        monthSelectorType: "static",
        animate: true
    };

    fechaInicioPicker = flatpickr(
        fechaInicioElement,
        {
            ...configuracionBase,

            onChange(fechasSeleccionadas) {
                const fecha =
                    fechasSeleccionadas[0] || null;

                fechaFinPicker?.set(
                    "minDate",
                    fecha
                );

                actualizarBotonesLimpiarFecha();
                programarAplicacionAutomatica();
            }
        }
    );

    fechaFinPicker = flatpickr(
        fechaFinElement,
        {
            ...configuracionBase,

            onChange(fechasSeleccionadas) {
                const fecha =
                    fechasSeleccionadas[0] || null;

                fechaInicioPicker?.set(
                    "maxDate",
                    fecha
                );

                actualizarBotonesLimpiarFecha();
                programarAplicacionAutomatica();
            }
        }
    );
}
function actualizarBotonesLimpiarFecha() {
    limpiarFechaInicioButton?.classList.toggle(
        "visible",
        Boolean(fechaInicioElement?.value)
    );

    limpiarFechaFinButton?.classList.toggle(
        "visible",
        Boolean(fechaFinElement?.value)
    );
}

limpiarFechaInicioButton?.addEventListener(
    "click",
    () => {
        fechaInicioPicker?.clear();

        fechaFinPicker?.set(
            "minDate",
            null
        );

        actualizarBotonesLimpiarFecha();
        programarAplicacionAutomatica();
    }
);

limpiarFechaFinButton?.addEventListener(
    "click",
    () => {
        fechaFinPicker?.clear();

        fechaInicioPicker?.set(
            "maxDate",
            null
        );

        actualizarBotonesLimpiarFecha();
        programarAplicacionAutomatica();
    }
);

// =====================================================
// ESTADOS DE CAMPAÑA
// =====================================================

estadoCampanaButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            estadoCampanaButtons.forEach(
                item => {
                    item.classList.remove("active");
                }
            );

            button.classList.add("active");

            estadoCampanaSeleccionado =
                button.dataset.estado || "";

            programarAplicacionAutomatica();
        }
    );
});
    // =====================================================
    // PETICIONES
    // =====================================================

    async function realizarPeticionJson(url) {
        const respuesta = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) {
            const mensaje =
                await respuesta.text();

            throw new Error(
                mensaje ||
                `Error HTTP ${respuesta.status}`
            );
        }

        return respuesta.json();
    }

    // =====================================================
    // ACTUALIZAR TARJETAS
    // =====================================================

    function actualizarResumen(resumen) {
        if (totalCampanasElement) {
            totalCampanasElement.textContent =
                resumen.totalCampanas ?? 0;
        }

        if (totalPublicacionesElement) {
            totalPublicacionesElement.textContent =
                resumen.totalPublicaciones ?? 0;
        }

        if (publicacionesProgramadasElement) {
            publicacionesProgramadasElement.textContent =
                resumen.publicacionesProgramadas ?? 0;
        }

        if (presupuestoTotalElement) {
            presupuestoTotalElement.textContent =
                formatearColones(
                    resumen.presupuestoTotal
                );
        }

        if (progresoPromedioElement) {
            const progreso =
                Number(resumen.progresoPromedio) || 0;

            progresoPromedioElement.textContent =
                `${progreso.toFixed(0)}%`;
        }
    }

    // =====================================================
    // CARGAR RESUMEN GENERAL
    // =====================================================

    async function cargarResumen() {
        try {
            const resumen =
                await realizarPeticionJson(
                    `${API_BASE_URL}/Dashboard/resumen`
                );

            actualizarResumen(resumen);

        } catch (error) {
            console.error(
                "No se pudo cargar el resumen:",
                error
            );
        }
    }

    // =====================================================
    // CARGAR RESUMEN FILTRADO
    // =====================================================

    async function cargarResumenFiltrado() {
        if (!validarFechas()) {
            return;
        }

        try {
            const parametros =
                obtenerParametrosFiltros();

            const url =
                `${API_BASE_URL}/Dashboard/resumen-filtrado` +
                (
                    parametros.toString()
                        ? `?${parametros.toString()}`
                        : ""
                );

            const resumen =
                await realizarPeticionJson(url);

            actualizarResumen(resumen);

        } catch (error) {
            console.error(
                "No se pudieron aplicar los filtros:",
                error
            );

            alert(
                error.message ||
                "No se pudieron aplicar los filtros."
            );
        }
    }

    // =====================================================
    // CAMPAÑAS POR ESTADO
    // =====================================================

    async function cargarCampanasPorEstado() {
        try {
            const datos =
                await realizarPeticionJson(
                    `${API_BASE_URL}/Dashboard/campanas-por-estado`
                );

            if (
                !Array.isArray(datos) ||
                datos.length === 0
            ) {
                campanasPorEstadoElement.innerHTML =
                    "<p>No hay campañas registradas.</p>";

                return;
            }

            const cantidadMaxima = Math.max(
                ...datos.map(
                    item => Number(item.cantidad) || 0
                ),
                1
            );

            campanasPorEstadoElement.innerHTML =
                datos
                    .map(item => {
                        const cantidad =
                            Number(item.cantidad) || 0;

                        const porcentaje =
                            Math.max(
                                (cantidad / cantidadMaxima) * 100,
                                cantidad > 0 ? 4 : 0
                            );

                        return `
                            <div class="chart-item">
                                <div class="chart-item-info">
                                    <span>${item.estado}</span>
                                    <strong>${cantidad}</strong>
                                </div>

                                <div class="chart-bar">
                                    <div
                                        class="chart-bar-fill"
                                        style="width: ${porcentaje}%"
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

            if (campanasPorEstadoElement) {
                campanasPorEstadoElement.innerHTML =
                    "<p>No se pudo cargar la información.</p>";
            }
        }
    }

    // =====================================================
    // PUBLICACIONES POR RED SOCIAL
    // =====================================================

    async function cargarPublicacionesPorRed() {
        try {
            const datos =
                await realizarPeticionJson(
                    `${API_BASE_URL}/Dashboard/publicaciones-por-red`
                );

            if (
                !Array.isArray(datos) ||
                datos.length === 0
            ) {
                publicacionesPorRedElement.innerHTML =
                    "<p>No hay publicaciones registradas.</p>";

                return;
            }

            const cantidadMaxima = Math.max(
                ...datos.map(
                    item =>
                        Number(
                            item.cantidadPublicaciones
                        ) || 0
                ),
                1
            );

            publicacionesPorRedElement.innerHTML =
                datos
                    .map(item => {
                        const cantidad =
                            Number(
                                item.cantidadPublicaciones
                            ) || 0;

                        const porcentaje =
                            Math.max(
                                (cantidad / cantidadMaxima) * 100,
                                cantidad > 0 ? 4 : 0
                            );

                        return `
                            <div class="chart-item">
                                <div class="chart-item-info">
                                    <span>${item.nombreRedSocial}</span>
                                    <strong>${cantidad}</strong>
                                </div>

                                <div class="chart-bar">
                                    <div
                                        class="chart-bar-fill"
                                        style="width: ${porcentaje}%"
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

            if (publicacionesPorRedElement) {
                publicacionesPorRedElement.innerHTML =
                    "<p>No se pudo cargar la información.</p>";
            }
        }
    }

    // =====================================================
    // DESCARGAR ARCHIVOS
    // =====================================================

    async function descargarReporte({
        tipo,
        boton,
        textoGenerando,
        icono,
        textoBoton
    }) {
        if (!validarFechas()) {
            return;
        }

        const parametros =
            obtenerParametrosFiltros();

        const url =
            `${API_BASE_URL}/Reportes/${tipo}` +
            (
                parametros.toString()
                    ? `?${parametros.toString()}`
                    : ""
            );

        try {
            boton.disabled = true;
            boton.textContent = textoGenerando;

            const respuesta = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                const mensaje =
                    await respuesta.text();

                throw new Error(
                    mensaje ||
                    `No se pudo generar el archivo ${tipo.toUpperCase()}.`
                );
            }

            const archivo =
                await respuesta.blob();

            const urlArchivo =
                window.URL.createObjectURL(archivo);

            const enlace =
                document.createElement("a");

            const fecha =
                new Date()
                    .toISOString()
                    .slice(0, 10);

            enlace.href = urlArchivo;
            enlace.download =
                `Reporte_Campanas_${fecha}.${tipo}`;

            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();

            window.URL.revokeObjectURL(
                urlArchivo
            );

        } catch (error) {
            console.error(
                `No se pudo exportar el ${tipo.toUpperCase()}:`,
                error
            );

            alert(
                error.message ||
                `No se pudo generar el archivo ${tipo.toUpperCase()}.`
            );

        } finally {
            boton.disabled = false;

            boton.innerHTML = `
                <i data-lucide="${icono}"></i>
                ${textoBoton}
            `;

            renderIcons();
        }
    }

    // =====================================================
    // EXPORTAR EXCEL
    // =====================================================

    async function exportarExcel() {
        await descargarReporte({
            tipo: "excel",
            boton: exportarExcelButton,
            textoGenerando: "Generando Excel...",
            icono: "file-spreadsheet",
            textoBoton: "Exportar Excel"
        });
    }

    // =====================================================
    // EXPORTAR PDF
    // =====================================================

    async function exportarPdf() {
        await descargarReporte({
            tipo: "pdf",
            boton: exportarPdfButton,
            textoGenerando: "Generando PDF...",
            icono: "file-text",
            textoBoton: "Exportar PDF"
        });
    }

    // =====================================================
    // EVENTOS DE LOS FILTROS
    // =====================================================


    exportarExcelButton?.addEventListener(
        "click",
        exportarExcel
    );

    exportarPdfButton?.addEventListener(
        "click",
        exportarPdf
    );

    // =====================================================
    // CERRAR SESIÓN
    // =====================================================

    logoutButton?.addEventListener(
        "click",
        () => {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            localStorage.removeItem("nombre");
            localStorage.removeItem("userName");
            localStorage.removeItem("idUsuario");
            localStorage.removeItem("correo");

            window.location.href = "index.html";
        }
    );

    // =====================================================
    // CARGAR EL MÓDULO
    // =====================================================

cargarInformacionUsuario();
inicializarCalendarios();
actualizarBotonesLimpiarFecha();

Promise.all([
    cargarResumen(),
    cargarCampanasPorEstado(),
    cargarPublicacionesPorRed()
]);
});