document.addEventListener("DOMContentLoaded", () => {
    // =====================================================
    // PROTEGER LA PÁGINA
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

    const campaignProgress =
        document.getElementById("campaignProgress");

    const progressValue =
        document.getElementById("progressValue");

    const submitCampaignButton =
        campaignForm.querySelector('button[type="submit"]');

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

    // =====================================================
    // CAMPAÑAS DE DEMOSTRACIÓN
    // Luego se reemplazan por los endpoints del backend.
    // =====================================================

    const defaultCampaigns = [
        {
            id: "1",
            name: "Lanzamiento digital",
            status: "activa",
            responsible: "Estiff Moreno",
            start: "2026-07-12",
            end: "2026-08-30",
            description:
                "Posicionamiento digital de nuevos servicios.",
            progress: 68,
            icon: "rocket"
        },
        {
            id: "2",
            name: "Fidelización de clientes",
            status: "pausada",
            responsible: "Equipo comercial",
            start: "2026-07-05",
            end: "2026-09-15",
            description:
                "Fortalecimiento de la relación con clientes actuales.",
            progress: 34,
            icon: "users-round"
        },
        {
            id: "3",
            name: "Promoción empresarial",
            status: "finalizada",
            responsible: "Área de marketing",
            start: "2026-05-10",
            end: "2026-06-30",
            description:
                "Promoción de soluciones empresariales de TecnoSula.",
            progress: 100,
            icon: "briefcase-business"
        }
    ];

    let campaigns = loadCampaigns();
    let selectedCampaignId = null;
    let modalMode = "create";

    // =====================================================
    // ALMACENAMIENTO TEMPORAL
    // =====================================================

    function loadCampaigns() {
        const savedCampaigns =
            localStorage.getItem("tecnosulaCampaignsDemo");

        if (!savedCampaigns) {
            return [...defaultCampaigns];
        }

        try {
            const parsedCampaigns = JSON.parse(savedCampaigns);

            return Array.isArray(parsedCampaigns)
                ? parsedCampaigns
                : [...defaultCampaigns];
        } catch (error) {
            console.error(
                "No se pudieron cargar las campañas:",
                error
            );

            return [...defaultCampaigns];
        }
    }

    function saveCampaigns() {
        localStorage.setItem(
            "tecnosulaCampaignsDemo",
            JSON.stringify(campaigns)
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
            }
        };

        return statuses[status] || statuses.pausada;
    }

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

                const progress =
                    clampProgress(campaign.progress);

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

    function enableCampaignFields(enabled) {
        const fields = campaignForm.querySelectorAll(
            "input:not([type='hidden']), select, textarea"
        );

        fields.forEach(field => {
            field.disabled = !enabled;
        });
    }

    function resetCampaignForm() {
        campaignForm.reset();
        campaignId.value = "";
        campaignProgress.value = "0";
        progressValue.textContent = "0%";
        selectedCampaignId = null;
    }

    function fillCampaignForm(campaign) {
        campaignId.value = campaign.id;
        campaignName.value = campaign.name;
        campaignStatus.value = campaign.status;
        campaignResponsible.value = campaign.responsible;
        campaignStart.value = campaign.start;
        campaignEnd.value = campaign.end;
        campaignDescription.value = campaign.description;
        campaignProgress.value = campaign.progress;
        progressValue.textContent =
            `${campaign.progress}%`;
    }

    function openCampaignForm(mode, campaign = null) {
        modalMode = mode;
        resetCampaignForm();

        if (mode === "create") {
            modalEyebrow.textContent = "Nueva operación";
            modalTitle.textContent = "Registrar campaña";

            enableCampaignFields(true);
            submitCampaignButton.style.display = "inline-flex";
            cancelCampaignModal.textContent = "Cancelar";
        }

        if (mode === "edit" && campaign) {
            modalEyebrow.textContent = "Modificar operación";
            modalTitle.textContent = "Editar campaña";

            selectedCampaignId = campaign.id;

            fillCampaignForm(campaign);
            enableCampaignFields(true);

            submitCampaignButton.style.display = "inline-flex";
            cancelCampaignModal.textContent = "Cancelar";
        }

        if (mode === "view" && campaign) {
            modalEyebrow.textContent = "Información de campaña";
            modalTitle.textContent = "Detalle de campaña";

            selectedCampaignId = campaign.id;

            fillCampaignForm(campaign);
            enableCampaignFields(false);

            submitCampaignButton.style.display = "none";
            cancelCampaignModal.textContent = "Cerrar";
        }

        showModal(campaignModal);
        renderIcons();
    }

    function closeCampaignForm() {
        hideModal(campaignModal);
        enableCampaignFields(true);
        submitCampaignButton.style.display = "inline-flex";
        resetCampaignForm();
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

    campaignForm?.addEventListener("submit", event => {
        event.preventDefault();

        const startDate = campaignStart.value;
        const endDate = campaignEnd.value;

        if (endDate < startDate) {
            alert(
                "La fecha final no puede ser anterior a la fecha de inicio."
            );

            campaignEnd.focus();
            return;
        }

       const campaignData = {
    id:
        modalMode === "edit"
            ? selectedCampaignId
            : createIdentifier(),

    name: campaignName.value.trim(),
    status: campaignStatus.value,

    responsible:
        campaignResponsible.value.trim(),

    start: startDate,
    end: endDate,

    description:
        campaignDescription.value.trim(),

    progress: clampProgress(
        campaignProgress.value
    )
};

        if (modalMode === "edit") {
            campaigns = campaigns.map(campaign =>
                campaign.id === selectedCampaignId
                    ? {
                          ...campaign,
                          ...campaignData
                      }
                    : campaign
            );
        } else {
            campaigns.unshift(campaignData);
        }

        saveCampaigns();
        closeCampaignForm();
        syncCustomStatusFilter();
        renderCampaigns();
    });

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

    confirmDelete?.addEventListener("click", () => {
        if (!selectedCampaignId) {
            return;
        }

        campaigns = campaigns.filter(
            campaign =>
                campaign.id !== selectedCampaignId
        );

        saveCampaigns();
        closeDeleteConfirmation();
        renderCampaigns();
    });

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

    refreshCampaigns?.addEventListener("click", () => {
        campaignSearch.value = "";
        statusFilter.value = "todos";

        renderCampaigns();
    });

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

    renderCampaigns();
});