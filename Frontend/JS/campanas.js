document.addEventListener("DOMContentLoaded", () => {
    // =====================================================
    // PROTEGER LA PÁGINA
    // =====================================================

    const token = localStorage.getItem("token");

    const idUsuario = Number(
        localStorage.getItem("idUsuario")
    );

    const CAMPANAS_API_URL =
        "http://localhost:5208/api/Campanas";

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        console.warn(
            "No se encontró un idUsuario válido en la sesión."
        );
    }

    // EL RESTO DE TU CÓDIGO CONTINÚA AQUÍ

    // =====================================================
    // ICONOS LUCIDE
    // =====================================================

    function renderIcons() {
        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        } else {
            console.error(
                "Lucide no se cargó. Revisa la conexión a Internet o el enlace CDN."
            );
        }
    }

    renderIcons();

    // =====================================================
    // ELEMENTOS GENERALES
    // =====================================================

    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const openSidebarButton = document.getElementById("openSidebar");
    const closeSidebarButton = document.getElementById("closeSidebar");

    const logoutButton = document.getElementById("logoutButton");
    const employeeName = document.getElementById("employeeName");
    const employeeInitials = document.getElementById("employeeInitials");

    const campaignSearch = document.getElementById("campaignSearch");
    const statusFilter = document.getElementById("statusFilter");
    const customStatusFilter =
    document.getElementById("customStatusFilter");

const statusFilterTrigger =
    document.getElementById("statusFilterTrigger");

const statusFilterMenu =
    document.getElementById("statusFilterMenu");

const statusFilterLabel =
    document.getElementById("statusFilterLabel");

const statusFilterOptions = Array.from(
    document.querySelectorAll(".status-filter-option")
);
    const refreshCampaigns = document.getElementById("refreshCampaigns");
    const clearFilters = document.getElementById("clearFilters");

    const campaignTableBody =
        document.getElementById("campaignTableBody");

    const tableContainer =
        document.querySelector(".table-container");

    const emptyState = document.getElementById("emptyState");

    const totalCampaigns =
        document.getElementById("totalCampaigns");

    const activeCampaigns =
        document.getElementById("activeCampaigns");

    const pausedCampaigns =
        document.getElementById("pausedCampaigns");

    const visibleCampaigns =
        document.getElementById("visibleCampaigns");

    const campaignCount =
        document.getElementById("campaignCount");

    // =====================================================
    // MODAL DE CAMPAÑAS
    // =====================================================

    const statusPillGroup =
    document.getElementById("statusPillGroup");

const statusPills = Array.from(
    document.querySelectorAll(".status-pill")
);
    const campaignModal = document.getElementById("campaignModal");

    const openCreateModal =
        document.getElementById("openCreateModal");

    const secondaryCreateButton =
        document.getElementById("secondaryCreateButton");

    const closeCampaignModalButton =
        document.getElementById("closeCampaignModal");

    const cancelCampaignModal =
        document.getElementById("cancelCampaignModal");

    const campaignForm =
        document.getElementById("campaignForm");

    const modalEyebrow =
        document.getElementById("modalEyebrow");

    const modalTitle =
        document.getElementById("modalTitle");

    const campaignId =
        document.getElementById("campaignId");

    const campaignName =
        document.getElementById("campaignName");

    const campaignStatus =
        document.getElementById("campaignStatus");

    const campaignResponsible =
        document.getElementById("campaignResponsible");

    const campaignStart =
        document.getElementById("campaignStart");

    const campaignEnd =
        document.getElementById("campaignEnd");

    const campaignDescription =
        document.getElementById("campaignDescription");

    const campaignBudget =
        document.getElementById("campaignBudget");

    const campaignProgress =
        document.getElementById("campaignProgress");

    const progressValue =
        document.getElementById("progressValue");

   const submitCampaignButton =
    campaignForm?.querySelector('button[type="submit"]');

    // =====================================================
    // MODAL DE ELIMINACIÓN
    // =====================================================

    const deleteModal = document.getElementById("deleteModal");

    const closeDeleteModalButton =
        document.getElementById("closeDeleteModal");

    const cancelDelete =
        document.getElementById("cancelDelete");

    const confirmDelete =
        document.getElementById("confirmDelete");

        const successModal =
    document.getElementById("successModal");

const successModalMessage =
    document.getElementById("successModalMessage");

const closeSuccessModal =
    document.getElementById("closeSuccessModal");

    // =====================================================
    // CAMPAÑAS DE DEMOSTRACIÓN
    // Luego se reemplazan por los endpoints del backend.
    // =====================================================

   let campaigns = [];
let selectedCampaignId = null;
let modalMode = "create";

// =====================================================
// CONEXIÓN CON EL BACKEND
// =====================================================

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        let validationMessage = "";

        if (data.errors) {
            validationMessage = Object.values(data.errors)
                .flat()
                .join("\n");
        }

        throw new Error(
            data.mensaje ||
            data.message ||
            validationMessage ||
            `Error del servidor: ${response.status}`
        );
    }

    return data;
}

function mapCampaignFromBackend(campaign) {
    const rawProgress =
        campaign.progreso ??
        campaign.Progreso ??
        0;

    const progress = clampProgress(
        Number(rawProgress)
    );

    console.log(
        "Campaña recibida:",
        campaign.nombre ?? campaign.Nombre,
        "Progreso original:",
        rawProgress,
        "Progreso convertido:",
        progress
    );

    return {
        id: String(
            campaign.idCampana ??
            campaign.IdCampana
        ),

        name:
            campaign.nombre ??
            campaign.Nombre ??
            "",

        status: normalizeText(
            campaign.estado ??
            campaign.Estado ??
            "Activa"
        ),

        responsible:
            campaign.responsable ??
            campaign.Responsable ??
            "Sin responsable",

        start:
            (
                campaign.fechaInicio ??
                campaign.FechaInicio ??
                ""
            ).substring(0, 10),

        end:
            (
                campaign.fechaFin ??
                campaign.FechaFin ??
                ""
            ).substring(0, 10),

        description:
            campaign.descripcion ??
            campaign.Descripcion ??
            "",

        presupuesto:
            campaign.presupuesto ??
            campaign.Presupuesto ??
            "",

        progress: progress
    };
}
async function loadCampaignsFromDatabase() {
    try {
        if (refreshCampaigns) {
            refreshCampaigns.disabled = true;
        }

        const data = await apiRequest(
            CAMPANAS_API_URL,
            {
                method: "GET"
            }
        );

        campaigns = Array.isArray(data)
            ? data.map(mapCampaignFromBackend)
            : [];
            console.table(
    campaigns.map(campaign => ({
        nombre: campaign.name,
        progreso: campaign.progress,
        presupuesto: campaign.presupuesto
    }))
);

        renderCampaigns();
    } catch (error) {
        console.error(
            "Error al cargar campañas:",
            error
        );

        campaigns = [];
        renderCampaigns();

        alert(
            error.message ||
            "No se pudieron cargar las campañas."
        );
    } finally {
        if (refreshCampaigns) {
            refreshCampaigns.disabled = false;
        }
    }
}

async function createCampaignInDatabase() {
    if (
        !Number.isInteger(idUsuario) ||
        idUsuario <= 0
    ) {
        throw new Error(
            "No se encontró el usuario de la sesión. Cierra sesión e inicia nuevamente."
        );
    }

    const presupuesto = Number(
        campaignBudget.value
    );

    const progreso = Number(
        campaignProgress.value
    );

    if (
        !Number.isFinite(presupuesto) ||
        presupuesto <= 0
    ) {
        throw new Error(
            "Debes ingresar un presupuesto mayor que cero."
        );
    }

    if (
        !Number.isInteger(progreso) ||
        progreso < 0 ||
        progreso > 100
    ) {
        throw new Error(
            "El progreso debe estar entre 0 y 100."
        );
    }

    const request = {
        nombre: campaignName.value.trim(),

        descripcion:
            campaignDescription.value.trim() ||
            null,

        fechaInicio:
            campaignStart.value,

        fechaFin:
            campaignEnd.value,

        presupuesto:
            presupuesto,

        progreso:
            progreso,

        idUsuario:
            idUsuario,

        estado:
            campaignStatus.value
    };

    console.log(
        "Datos enviados al crear:",
        request
    );

    return await apiRequest(
        CAMPANAS_API_URL,
        {
            method: "POST",
            body: JSON.stringify(request)
        }
    );
}

async function updateCampaignInDatabase(id) {
    const presupuesto = Number(
        campaignBudget.value
    );

    const progreso = Number(
        campaignProgress.value
    );

    if (
        !Number.isFinite(presupuesto) ||
        presupuesto <= 0
    ) {
        throw new Error(
            "Debes ingresar un presupuesto mayor que cero."
        );
    }

    if (
        !Number.isInteger(progreso) ||
        progreso < 0 ||
        progreso > 100
    ) {
        throw new Error(
            "El progreso debe estar entre 0 y 100."
        );
    }

    const request = {
        nombre: campaignName.value.trim(),

        descripcion:
            campaignDescription.value.trim() ||
            null,

        fechaInicio:
            campaignStart.value,

        fechaFin:
            campaignEnd.value,

        presupuesto:
            presupuesto,

        progreso:
            progreso,

        estado:
            campaignStatus.value
    };

    console.log(
        "Datos enviados al editar:",
        request
    );

    return await apiRequest(
        `${CAMPANAS_API_URL}/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(request)
        }
    );
}

async function cancelCampaignInDatabase(id) {
    return await apiRequest(
        `${CAMPANAS_API_URL}/${id}/cancelar`,
        {
            method: "PATCH"
        }
    );
}

async function deleteCampaignFromDatabase(id) {
    return await apiRequest(
        `${CAMPANAS_API_URL}/${id}`,
        {
            method: "DELETE"
        }
    );
}

    // =====================================================
    // FUNCIONES AUXILIARES
    // =====================================================

    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }
    function selectCampaignIcon(name, description = "") {
    const text = normalizeText(`${name} ${description}`);

    const iconRules = [
        {
            keywords: [
                "lanzamiento",
                "estreno",
                "nuevo producto",
                "innovacion"
            ],
            icon: "rocket"
        },
        {
            keywords: [
                "cliente",
                "clientes",
                "fidelizacion",
                "usuarios",
                "comunidad"
            ],
            icon: "users-round"
        },
        {
            keywords: [
                "empresa",
                "empresarial",
                "corporativo",
                "negocio",
                "comercial"
            ],
            icon: "briefcase-business"
        },
        {
            keywords: [
                "redes sociales",
                "instagram",
                "facebook",
                "tiktok",
                "contenido",
                "social"
            ],
            icon: "share-2"
        },
        {
            keywords: [
                "correo",
                "email",
                "newsletter",
                "boletin"
            ],
            icon: "mail"
        },
        {
            keywords: [
                "evento",
                "feria",
                "conferencia",
                "webinar",
                "actividad"
            ],
            icon: "calendar-days"
        },
        {
            keywords: [
                "tienda",
                "comercio",
                "ecommerce",
                "venta",
                "ventas"
            ],
            icon: "store"
        },
        {
            keywords: [
                "curso",
                "educacion",
                "capacitacion",
                "academia"
            ],
            icon: "graduation-cap"
        },
        {
            keywords: [
                "seguridad",
                "proteccion",
                "ciberseguridad"
            ],
            icon: "shield-check"
        },
        {
            keywords: [
                "digital",
                "tecnologia",
                "software",
                "pagina web",
                "aplicacion"
            ],
            icon: "monitor"
        },
        {
            keywords: [
                "objetivo",
                "alcance",
                "posicionamiento",
                "publicidad"
            ],
            icon: "target"
        }
    ];

    const matchingRule = iconRules.find(rule =>
        rule.keywords.some(keyword => text.includes(keyword))
    );

    return matchingRule?.icon || "megaphone";
}

    function escapeHtml(text) {
        const element = document.createElement("div");

        element.textContent = String(text || "");

        return element.innerHTML;
    }

    function getInitials(name) {
        return String(name || "")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("") || "TS";
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return "Sin fecha";
        }

        const date = new Date(`${dateValue}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return new Intl.DateTimeFormat("es-CR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(date);
    }

   function getStatusData(status) {
    const statuses = {
        activa: {
            label: "Activa",
            className: "active-status"
        },

        pausada: {
            label: "Pausada",
            className: "paused-status"
        },

        finalizada: {
            label: "Finalizada",
            className: "finished-status"
        },

        cancelada: {
            label: "Cancelada",
            className: "paused-status"
        }
    };

    return statuses[status] || {
        label: status || "Sin estado",
        className: "paused-status"
    };
}
statusPillGroup?.addEventListener("click", event => {
    const button = event.target.closest(".status-pill");

    if (!button) {
        return;
    }

    setCampaignStatus(button.dataset.status);
});

    function createIdentifier() {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random()}`;
    }

    function clampProgress(value) {
        const number = Number(value);

        if (Number.isNaN(number)) {
            return 0;
        }

        return Math.min(100, Math.max(0, number));
    }
    function setCampaignStatus(value) {
    campaignStatus.value = value;

    statusPills.forEach(button => {
        const isActive =
            button.dataset.status === value;

        button.classList.toggle("active", isActive);
    });
}

    // =====================================================
    // RENDERIZAR TABLA
    // =====================================================

    function renderCampaigns() {
        const searchValue = normalizeText(
            campaignSearch.value.trim()
        );

        const selectedStatus = statusFilter.value;

        const filteredCampaigns = campaigns.filter(campaign => {
            const matchesSearch =
                normalizeText(campaign.name).includes(searchValue) ||
                normalizeText(campaign.responsible).includes(searchValue) ||
                normalizeText(campaign.description).includes(searchValue);

            const matchesStatus =
                selectedStatus === "todos" ||
                campaign.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        campaignTableBody.innerHTML = filteredCampaigns
            .map(campaign => {
                const statusData =
                    getStatusData(campaign.status);

              const progress = clampProgress(
    Number(
        campaign.progress ??
        campaign.progreso ??
        campaign.Progreso ??
        0
    )
);

                return `
                    <tr
                        class="campaign-row"
                        data-id="${escapeHtml(campaign.id)}"
                    >
                        <td>
                            <div class="campaign-identity">

                                <div class="campaign-icon">
                                   <i data-lucide="${selectCampaignIcon(
    campaign.name,
    campaign.description
)}"></i>
                                </div>

                                <div>
                                    <strong>
                                        ${escapeHtml(campaign.name)}
                                    </strong>

                                    <span>
                                        ${escapeHtml(
                                            campaign.description
                                        )}
                                    </span>
                                </div>

                            </div>
                        </td>

                        <td>
                            <span class="status-badge ${statusData.className}">
                                <span></span>
                                ${statusData.label}
                            </span>
                        </td>

                        <td>
                            <div class="responsible-information">

                                <div class="responsible-avatar">
                                    ${escapeHtml(
                                        getInitials(
                                            campaign.responsible
                                        )
                                    )}
                                </div>

                                <div>
                                    <strong>
                                        ${escapeHtml(
                                            campaign.responsible
                                        )}
                                    </strong>

                                    <span>
                                        Responsable principal
                                    </span>
                                </div>

                            </div>
                        </td>

                        <td>
                            <div class="campaign-period">

                                <strong>
                                    ${formatDate(campaign.start)}
                                </strong>

                                <span>
                                    ${formatDate(campaign.end)}
                                </span>

                            </div>
                        </td>

                        <td>
                            <div class="progress-information">

                                <div>
                                    <span>Progreso</span>
                                    <strong>${progress}%</strong>
                                </div>

                                <div class="progress-track">
                                    <div
                                        class="progress-value"
                                        style="width: ${progress}%;"
                                    ></div>
                                </div>

                            </div>
                        </td>

                        <td>
                            <div class="row-actions">

                                <button
                                    class="action-button view-button"
                                    data-action="view"
                                    type="button"
                                    title="Ver campaña"
                                >
                                    <i data-lucide="eye"></i>
                                </button>

                                <button
                                    class="action-button edit-button"
                                    data-action="edit"
                                    type="button"
                                    title="Editar campaña"
                                >
                                    <i data-lucide="pencil"></i>
                                </button>

                                <button
                                    class="action-button delete-button"
                                    data-action="delete"
                                    type="button"
                                    title="Eliminar campaña"
                                >
                                    <i data-lucide="trash-2"></i>
                                </button>

                            </div>
                        </td>
                    </tr>
                `;
            })
            .join("");

        const hasResults = filteredCampaigns.length > 0;

        tableContainer.style.display =
            hasResults ? "block" : "none";

        emptyState.classList.toggle(
            "show",
            !hasResults
        );

        visibleCampaigns.textContent =
            filteredCampaigns.length;

        campaignCount.textContent =
            campaigns.length;

        updateStatistics();
        renderIcons();
    }

    function updateStatistics() {
        totalCampaigns.textContent =
            campaigns.length;

        activeCampaigns.textContent =
            campaigns.filter(
                campaign => campaign.status === "activa"
            ).length;

        pausedCampaigns.textContent =
            campaigns.filter(
                campaign => campaign.status === "pausada"
            ).length;
    }

    // =====================================================
    // SIDEBAR MÓVIL
    // =====================================================

    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
        document.body.style.overflow = "";
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

   function getTokenPayload(jwtToken) {
    try {
        const payloadPart = jwtToken.split(".")[1];

        if (!payloadPart) {
            return null;
        }

        const base64 = payloadPart
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const paddedBase64 = base64.padEnd(
            Math.ceil(base64.length / 4) * 4,
            "="
        );

        const decodedPayload = decodeURIComponent(
            atob(paddedBase64)
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
        console.error("No se pudo leer el token:", error);
        return null;
    }
}

function getLoggedUserName() {
    const storedName =
        localStorage.getItem("nombre") ||
        localStorage.getItem("userName");

    if (storedName && storedName !== "Empleado") {
        return storedName;
    }

    const payload = getTokenPayload(token);

    return (
        payload?.[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] ||
        payload?.name ||
        payload?.unique_name ||
        payload?.given_name ||
        "Empleado"
    );
}

const loggedUserName = getLoggedUserName();

if (employeeName) {
    employeeName.textContent = loggedUserName;
}

if (employeeInitials) {
    employeeInitials.textContent =
        getInitials(loggedUserName);
}

    logoutButton?.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("nombre");
        localStorage.removeItem("userName");

        window.location.href = "index.html";
    });

    // =====================================================
    // ABRIR Y CERRAR MODALES
    // =====================================================

    function showModal(modal) {
        modal.classList.add("show");
        document.body.classList.add("modal-open");
    }

    function hideModal(modal) {
        modal.classList.remove("show");

        const anotherModalOpen =
            document.querySelector(".modal-overlay.show");

        if (!anotherModalOpen) {
            document.body.classList.remove("modal-open");
        }
    }
    function showSuccessMessage(message) {
    successModalMessage.textContent = message;

    showModal(successModal);
    renderIcons();
}

function closeSuccessMessage() {
    hideModal(successModal);
}

closeSuccessModal?.addEventListener(
    "click",
    closeSuccessMessage
);

successModal?.addEventListener(
    "click",
    event => {
        if (event.target === successModal) {
            closeSuccessMessage();
        }
    }
);

  // =====================================================
// CONTROL DE LOS CAMPOS DEL MODAL
// =====================================================

function setControlEnabled(control, enabled) {
    if (!control) {
        return;
    }

    control.disabled = !enabled;

    if (enabled) {
        control.removeAttribute("disabled");
    } else {
        control.setAttribute("disabled", "");
    }

    control.style.pointerEvents =
        enabled ? "auto" : "none";

    control.style.opacity =
        enabled ? "1" : "0.65";

    control.tabIndex =
        enabled ? 0 : -1;
}

function setDatePickerEnabled(input, enabled) {
    if (!input) {
        return;
    }

    input.disabled = !enabled;

    if (enabled) {
        input.removeAttribute("disabled");
    } else {
        input.setAttribute("disabled", "");
    }

    const picker = input._flatpickr;

    if (!picker?.altInput) {
        return;
    }

    picker.altInput.disabled = !enabled;

    if (enabled) {
        picker.altInput.removeAttribute("disabled");
    } else {
        picker.altInput.setAttribute("disabled", "");
        picker.close();
    }

    // Flatpickr requiere readonly para abrir el calendario
    // sin escribir manualmente.
    picker.altInput.readOnly = true;
    picker.altInput.setAttribute("readonly", "");

    picker.altInput.style.pointerEvents =
        enabled ? "auto" : "none";

    picker.altInput.style.opacity =
        enabled ? "1" : "0.65";

    picker.altInput.tabIndex =
        enabled ? 0 : -1;
}

function setStatusButtonsEnabled(enabled) {
    statusPills.forEach(button => {
        button.disabled = !enabled;

        if (enabled) {
            button.removeAttribute("disabled");
        } else {
            button.setAttribute("disabled", "");
        }

        button.style.pointerEvents =
            enabled ? "auto" : "none";

        button.style.opacity =
            enabled ? "1" : "0.55";

        button.setAttribute(
            "aria-disabled",
            String(!enabled)
        );
    });
}

function setCampaignFormMode(mode) {
    const editable =
        mode === "create" ||
        mode === "edit";

    // Evita que el formulario completo quede inerte.
    campaignForm.inert = false;
    campaignForm.removeAttribute("inert");

    const editableControls = [
        campaignName,
        campaignBudget,
        campaignDescription,
        campaignProgress
    ];

    editableControls.forEach(control => {
        setControlEnabled(control, editable);

        if (editable) {
            control.readOnly = false;
            control.removeAttribute("readonly");
        }
    });

    setDatePickerEnabled(
        campaignStart,
        editable
    );

    setDatePickerEnabled(
        campaignEnd,
        editable
    );

    setStatusButtonsEnabled(editable);

    // El responsable nunca se modifica.
    setControlEnabled(
        campaignResponsible,
        editable
    );

    campaignResponsible.readOnly = true;
    campaignResponsible.setAttribute(
        "readonly",
        ""
    );

    if (!editable) {
        setControlEnabled(
            campaignResponsible,
            false
        );
    }
}

function resetCampaignForm() {
    campaignForm.reset();

    campaignId.value = "";
    campaignBudget.value = "";
    campaignProgress.value = "0";
    progressValue.textContent = "0%";

    selectedCampaignId = null;

    setCampaignStatus("activa");

    if (campaignStart._flatpickr) {
        campaignStart._flatpickr.clear(false);
        campaignStart._flatpickr.set(
            "minDate",
            null
        );
    } else {
        campaignStart.value = "";
    }

    if (campaignEnd._flatpickr) {
        campaignEnd._flatpickr.clear(false);
        campaignEnd._flatpickr.set(
            "minDate",
            null
        );
    } else {
        campaignEnd.value = "";
    }
}

function fillCampaignForm(campaign) {
    const progress = clampProgress(
        campaign.progress ?? 0
    );

    campaignId.value =
        campaign.id || "";

    campaignName.value =
        campaign.name || "";

    campaignResponsible.value =
        campaign.responsible || "";

    campaignDescription.value =
        campaign.description || "";

    campaignBudget.value =
        campaign.presupuesto ?? "";

    campaignProgress.value =
        String(progress);

    progressValue.textContent =
        `${progress}%`;

    setCampaignStatus(
        campaign.status || "activa"
    );

    if (campaignStart._flatpickr) {
        campaignStart._flatpickr.setDate(
            campaign.start || null,
            false,
            "Y-m-d"
        );
    } else {
        campaignStart.value =
            campaign.start || "";
    }

    if (campaignEnd._flatpickr) {
        campaignEnd._flatpickr.setDate(
            campaign.end || null,
            false,
            "Y-m-d"
        );
    } else {
        campaignEnd.value =
            campaign.end || "";
    }

    if (
        campaign.start &&
        campaignEnd._flatpickr
    ) {
        campaignEnd._flatpickr.set(
            "minDate",
            campaign.start
        );
    }
}

function openCampaignForm(
    mode,
    campaign = null
) {
    modalMode = mode;

    resetCampaignForm();

    if (mode === "create") {
        modalEyebrow.textContent =
            "Nueva operación";

        modalTitle.textContent =
            "Registrar campaña";

        campaignResponsible.value =
            loggedUserName;

        campaignProgress.value = "0";
        progressValue.textContent = "0%";

        setCampaignStatus("activa");
        setCampaignFormMode("create");

        submitCampaignButton.style.display =
            "inline-flex";

        cancelCampaignModal.textContent =
            "Cancelar";
    } else if (
        mode === "edit" &&
        campaign
    ) {
        modalEyebrow.textContent =
            "Modificar operación";

        modalTitle.textContent =
            "Editar campaña";

        selectedCampaignId =
            campaign.id;

        fillCampaignForm(campaign);
        setCampaignFormMode("edit");

        submitCampaignButton.style.display =
            "inline-flex";

        cancelCampaignModal.textContent =
            "Cancelar";
    } else if (
        mode === "view" &&
        campaign
    ) {
        modalEyebrow.textContent =
            "Información de campaña";

        modalTitle.textContent =
            "Detalle de campaña";

        selectedCampaignId =
            campaign.id;

        fillCampaignForm(campaign);
        setCampaignFormMode("view");

        submitCampaignButton.style.display =
            "none";

        cancelCampaignModal.textContent =
            "Cerrar";
    }

    showModal(campaignModal);
    renderIcons();
}

function closeCampaignForm() {
    hideModal(campaignModal);

    setCampaignFormMode("create");
    resetCampaignForm();

    submitCampaignButton.style.display =
        "inline-flex";
}
    function openStatusDropdown() {
    customStatusFilter?.classList.add("open");

    statusFilterTrigger?.setAttribute(
        "aria-expanded",
        "true"
    );
}

function closeStatusDropdown() {
    customStatusFilter?.classList.remove("open");

    statusFilterTrigger?.setAttribute(
        "aria-expanded",
        "false"
    );
}

function toggleStatusDropdown() {
    const isOpen =
        customStatusFilter?.classList.contains("open");

    if (isOpen) {
        closeStatusDropdown();
    } else {
        openStatusDropdown();
    }
}

function syncCustomStatusFilter() {
    const currentValue = statusFilter.value;

    const selectedOption = statusFilterOptions.find(
        option => option.dataset.value === currentValue
    );

    statusFilterOptions.forEach(option => {
        const isSelected =
            option.dataset.value === currentValue;

        option.classList.toggle("active", isSelected);

        option.setAttribute(
            "aria-selected",
            String(isSelected)
        );
    });

    if (statusFilterLabel && selectedOption) {
        statusFilterLabel.textContent =
            selectedOption.dataset.label;
    }
}

    openCreateModal?.addEventListener("click", () => {
        openCampaignForm("create");
    });

    secondaryCreateButton?.addEventListener(
        "click",
        () => {
            openCampaignForm("create");
        }
    );

    closeCampaignModalButton?.addEventListener(
        "click",
        closeCampaignForm
    );

    cancelCampaignModal?.addEventListener(
        "click",
        closeCampaignForm
    );

    campaignModal?.addEventListener("click", event => {
        if (event.target === campaignModal) {
            closeCampaignForm();
        }
    });

    // =====================================================
    // PROGRESO
    // =====================================================

    campaignProgress?.addEventListener("input", () => {
        progressValue.textContent =
            `${campaignProgress.value}%`;
    });

    statusFilterTrigger?.addEventListener(
    "click",
    event => {
        event.stopPropagation();
        toggleStatusDropdown();
    }
);

statusFilterMenu?.addEventListener(
    "click",
    event => {
        const option = event.target.closest(
            ".status-filter-option"
        );

        if (!option) {
            return;
        }

        statusFilter.value = option.dataset.value;

        statusFilter.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );

        syncCustomStatusFilter();
        closeStatusDropdown();
    }
);

document.addEventListener("click", event => {
    if (
        customStatusFilter &&
        !customStatusFilter.contains(event.target)
    ) {
        closeStatusDropdown();
    }
});

    // =====================================================
    // CREAR Y EDITAR
    // =====================================================

    campaignForm?.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const startDate = campaignStart.value;
        const endDate = campaignEnd.value;

        if (!campaignName.value.trim()) {
            alert(
                "Debes escribir el nombre de la campaña."
            );

            campaignName.focus();
            return;
        }

        if (!startDate || !endDate) {
            alert(
                "Debes seleccionar las fechas de la campaña."
            );

            return;
        }

        if (endDate < startDate) {
            alert(
                "La fecha final no puede ser anterior a la fecha de inicio."
            );

            campaignEnd.focus();
            return;
        }

        const originalButtonText =
            submitCampaignButton.innerHTML;

        try {
            submitCampaignButton.disabled = true;
            submitCampaignButton.textContent =
                "Guardando...";

         if (modalMode === "edit") {
    await updateCampaignInDatabase(
        selectedCampaignId
    );

    closeCampaignForm();

    await loadCampaignsFromDatabase();

    showSuccessMessage(
        "Los cambios de la campaña se guardaron correctamente."
    );
} else {
    await createCampaignInDatabase();

    closeCampaignForm();

    await loadCampaignsFromDatabase();

    showSuccessMessage(
        "La campaña fue registrada exitosamente y ya está disponible en la plataforma."
    );
}
        } catch (error) {
            console.error(
                "Error al guardar la campaña:",
                error
            );

            alert(
                error.message ||
                "No se pudo guardar la campaña."
            );
        } finally {
            submitCampaignButton.disabled = false;
            submitCampaignButton.innerHTML =
                originalButtonText;

            renderIcons();
        }
    }
);

    // =====================================================
    // ACCIONES DE LA TABLA
    // =====================================================

    campaignTableBody?.addEventListener(
        "click",
        event => {
            const actionButton =
                event.target.closest("[data-action]");

            if (!actionButton) {
                return;
            }

            const row = actionButton.closest(
                ".campaign-row"
            );

            const id = row?.dataset.id;

            const campaign = campaigns.find(
                item => item.id === id
            );

            if (!campaign) {
                return;
            }

            const action =
                actionButton.dataset.action;

            if (action === "view") {
                openCampaignForm("view", campaign);
            }

            if (action === "edit") {
                openCampaignForm("edit", campaign);
            }

            if (action === "delete") {
                selectedCampaignId = campaign.id;
                showModal(deleteModal);
            }
        }
    );

    // =====================================================
    // ELIMINAR CAMPAÑA
    // =====================================================

    function closeDeleteConfirmation() {
        hideModal(deleteModal);
        selectedCampaignId = null;
    }

    closeDeleteModalButton?.addEventListener(
        "click",
        closeDeleteConfirmation
    );

    cancelDelete?.addEventListener(
        "click",
        closeDeleteConfirmation
    );

    deleteModal?.addEventListener("click", event => {
        if (event.target === deleteModal) {
            closeDeleteConfirmation();
        }
    });

   confirmDelete?.addEventListener(
    "click",
    async () => {
        if (!selectedCampaignId) {
            return;
        }

        const campaign = campaigns.find(
            item =>
                item.id === selectedCampaignId
        );

        if (!campaign) {
            return;
        }

        const id = selectedCampaignId;

        try {
            confirmDelete.disabled = true;
            confirmDelete.textContent =
                "Eliminando...";

            if (campaign.status !== "cancelada") {
                await cancelCampaignInDatabase(id);
            }

            await deleteCampaignFromDatabase(id);

            closeDeleteConfirmation();

            alert(
                "Campaña eliminada correctamente."
            );

            await loadCampaignsFromDatabase();
        } catch (error) {
            console.error(
                "Error al eliminar la campaña:",
                error
            );

            alert(
                error.message ||
                "No se pudo eliminar la campaña."
            );
        } finally {
            confirmDelete.disabled = false;
            confirmDelete.textContent =
                "Eliminar";
        }
    }
);

    // =====================================================
    // BUSCADOR Y FILTROS
    // =====================================================

    campaignSearch?.addEventListener(
        "input",
        renderCampaigns
    );

    statusFilter?.addEventListener(
        "change",
        renderCampaigns
    );

    clearFilters?.addEventListener("click", () => {
        campaignSearch.value = "";
        statusFilter.value = "todos";
        syncCustomStatusFilter();

        renderCampaigns();
        campaignSearch.focus();
    });

   refreshCampaigns?.addEventListener(
    "click",
    async () => {
        campaignSearch.value = "";
        statusFilter.value = "todos";

        syncCustomStatusFilter();

        await loadCampaignsFromDatabase();
    }
);

    document.addEventListener("keydown", event => {
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {
            event.preventDefault();
            campaignSearch.focus();
        }

        if (event.key === "Escape") {
            closeSidebar();
            closeStatusDropdown();

            if (campaignModal.classList.contains("show")) {
                closeCampaignForm();
            }

            if (deleteModal.classList.contains("show")) {
                closeDeleteConfirmation();
            }
        }
    });

    // =====================================================
    // PRIMER RENDERIZADO
    // =====================================================
if (typeof flatpickr !== "undefined") {
    flatpickr.localize({
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: [
                "Dom",
                "Lun",
                "Mar",
                "Mié",
                "Jue",
                "Vie",
                "Sáb"
            ],

            longhand: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado"
            ]
        },

        months: {
            shorthand: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"
            ],

            longhand: [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ]
        }
    });

    const startDatePicker = flatpickr(
        campaignStart,
        {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d M, Y",
            disableMobile: true,
            allowInput: false,
            monthSelectorType: "static",
            altInputClass: "flatpickr-input",
            onChange: selectedDates => {
                if (selectedDates.length > 0) {
                    endDatePicker.set(
                        "minDate",
                        selectedDates[0]
                    );
                }
            }
        }
    );

    const endDatePicker = flatpickr(
        campaignEnd,
        {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d M, Y",
            disableMobile: true,
            allowInput: false,
            monthSelectorType: "static",
            altInputClass: "flatpickr-input"
        }
    );

    startDatePicker.altInput.placeholder =
        "Seleccionar fecha de inicio";

    endDatePicker.altInput.placeholder =
        "Seleccionar fecha final";
}
    loadCampaignsFromDatabase();
});