document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =====================================================
    // PROTEGER EL DASHBOARD
    // =====================================================

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // =====================================================
    // ICONOS LUCIDE
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
    // ELEMENTOS GENERALES
    // =====================================================

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const openSidebarButton =
        document.getElementById("openSidebar");

    const closeSidebarButton =
        document.getElementById("closeSidebar");

    const learnMoreButton =
        document.getElementById("learnMoreButton");

    const platformSection =
        document.getElementById("platformSection");

    const logoutButton =
        document.getElementById("logoutButton");

    const employeeName =
        document.getElementById("employeeName");

    const employeeInitials =
        document.getElementById("employeeInitials");

    const activeCampaignsElement =
        document.getElementById("activeCampaigns");

    // =====================================================
    // FUNCIONES AUXILIARES
    // =====================================================

    function getInitials(name) {
        return (
            String(name || "")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(word => word.charAt(0).toUpperCase())
                .join("") || "EM"
        );
    }

    function decodeTokenPayload(jwtToken) {
        try {
            const payloadPart =
                jwtToken.split(".")[1];

            if (!payloadPart) {
                return null;
            }

            const normalizedPayload = payloadPart
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedPayload =
                normalizedPayload.padEnd(
                    Math.ceil(
                        normalizedPayload.length / 4
                    ) * 4,
                    "="
                );

            const decodedPayload =
                decodeURIComponent(
                    window
                        .atob(paddedPayload)
                        .split("")
                        .map(character => {
                            return `%${character
                                .charCodeAt(0)
                                .toString(16)
                                .padStart(2, "0")}`;
                        })
                        .join("")
                );

            return JSON.parse(decodedPayload);
        } catch (error) {
            console.warn(
                "No se pudo leer la información del token.",
                error
            );

            return null;
        }
    }

    function syncBodyScroll() {
        const sidebarOpen =
            sidebar?.classList.contains("open");

        document.body.style.overflow =
            sidebarOpen ? "hidden" : "";
    }

    // =====================================================
    // SIDEBAR RESPONSIVO
    // =====================================================

    function openSidebar() {
        sidebar?.classList.add("open");
        sidebarOverlay?.classList.add("show");

        syncBodyScroll();
    }

    function closeSidebar() {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove("show");

        syncBodyScroll();
    }

    openSidebarButton?.addEventListener(
        "click",
        openSidebar
    );

    closeSidebarButton?.addEventListener(
        "click",
        closeSidebar
    );

    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );

    // =====================================================
    // INFORMACIÓN DEL EMPLEADO
    // =====================================================

    const tokenPayload =
        decodeTokenPayload(token);

    const tokenName =
        tokenPayload?.[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] ||
        tokenPayload?.name ||
        tokenPayload?.unique_name ||
        tokenPayload?.given_name;

    const savedName =
        localStorage.getItem("nombre") ||
        localStorage.getItem("userName") ||
        tokenName ||
        "Empleado";

    if (employeeName) {
        employeeName.textContent = savedName;
    }

    if (employeeInitials) {
        employeeInitials.textContent =
            getInitials(savedName);
    }

    // =====================================================
    // ESTADÍSTICA DE CAMPAÑAS
    // =====================================================

    const defaultCampaigns = [
        {
            id: "1",
            status: "activa"
        },
        {
            id: "2",
            status: "pausada"
        },
        {
            id: "3",
            status: "finalizada"
        }
    ];

    function loadDashboardCampaigns() {
        const savedCampaigns =
            localStorage.getItem(
                "tecnosulaCampaignsDemo"
            );

        if (!savedCampaigns) {
            return defaultCampaigns;
        }

        try {
            const parsedCampaigns =
                JSON.parse(savedCampaigns);

            return Array.isArray(parsedCampaigns)
                ? parsedCampaigns
                : defaultCampaigns;
        } catch (error) {
            console.error(
                "No se pudieron leer las campañas.",
                error
            );

            return defaultCampaigns;
        }
    }

    function updateActiveCampaigns() {
        if (!activeCampaignsElement) {
            return;
        }

        const campaigns =
            loadDashboardCampaigns();

        const activeCount =
            campaigns.filter(campaign => {
                return String(campaign.status)
                    .toLowerCase() === "activa";
            }).length;

        activeCampaignsElement.textContent =
            String(activeCount).padStart(2, "0");
    }

    updateActiveCampaigns();

    // =====================================================
    // BOTÓN CONOCER TECNOSULA
    // =====================================================

    learnMoreButton?.addEventListener(
        "click",
        () => {
            platformSection?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
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

            window.location.href = "index.html";
        }
    );

    // =====================================================
    // EVENTOS GENERALES
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeSidebar();
            }
        }
    );

    window.addEventListener(
        "focus",
        () => {
            updateActiveCampaigns();
        }
    );

    window.addEventListener(
        "storage",
        event => {
            if (
                event.key ===
                "tecnosulaCampaignsDemo"
            ) {
                updateActiveCampaigns();
            }
        }
    );
});