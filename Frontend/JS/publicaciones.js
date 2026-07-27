document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =====================================================
    // ELEMENTOS GENERALES
    // =====================================================

    const publicationList =
        document.getElementById("publicationList");

    const publicationSearch =
        document.getElementById("publicationSearch");

    const campaignFilter =
        document.getElementById("campaignFilter");

    const platformFilter =
        document.getElementById("platformFilter");

    const publicationStatusFilter =
        document.getElementById("publicationStatusFilter");

    const calendarViewButton =
        document.getElementById("calendarViewButton");

    const newPublicationButton =
        document.getElementById("newPublicationButton");

    const employeeName =
        document.getElementById("employeeName");

    const employeeInitials =
        document.getElementById("employeeInitials");

    const employeeRole =
        document.getElementById("employeeRole");

    const logoutButton =
        document.getElementById("logoutButton");

    // =====================================================
    // SIDEBAR
    // =====================================================

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const openSidebarButton =
        document.getElementById("openSidebar");

    const closeSidebarButton =
        document.getElementById("closeSidebar");

    // =====================================================
    // MODAL
    // =====================================================

    const publicationModal =
        document.getElementById("publicationModal");

    const publicationModalTitle =
        document.getElementById("publicationModalTitle");

    const closePublicationModalButton =
        document.getElementById("closePublicationModal");

    const cancelPublicationButton =
        document.getElementById("cancelPublicationButton");

    const publicationForm =
        document.getElementById("publicationForm");

    const publicationCampaign =
        document.getElementById("publicationCampaign");

    const publicationTitle =
        document.getElementById("publicationTitle");

    const publicationDescription =
        document.getElementById("publicationDescription");

    const descriptionCounter =
        document.getElementById("descriptionCounter");

    const publicationPlatform =
        document.getElementById("publicationPlatform");

    const publicationDate =
        document.getElementById("publicationDate");

    const publicationTime =
        document.getElementById("publicationTime");

    const publicationStatus =
        document.getElementById("publicationStatus");

    const publicationFormMessage =
        document.getElementById("publicationFormMessage");

    const savePublicationButton =
        document.getElementById("savePublicationButton");

    const mediaUploadArea =
        document.getElementById("mediaUploadArea");

    const platformOptions =
        document.querySelectorAll(".platform-option");

    const statusOptions =
        document.querySelectorAll(
            ".publication-status-option"
        );

    // =====================================================
    // ELEMENTOS VISUALES DINÁMICOS
    // =====================================================

    const resultCount =
        document.querySelector(
            ".publication-result-count strong"
        );

    const metricCards =
        document.querySelectorAll(
            ".publication-metric-card"
        );

    const agenda =
        document.querySelector(".publication-agenda");

    const agendaTimeline =
        document.querySelector(".agenda-timeline");

    const agendaDateNumber =
        document.querySelector(".agenda-date-number");

    const agendaDateInformation =
        document.querySelector(
            ".agenda-date > div:nth-child(2)"
        );

    const agendaSummary =
        document.querySelector(".agenda-summary p");

    const heroCalendar =
        document.querySelector(".hero-calendar");

    // =====================================================
    // ESTADO DEL MÓDULO
    // =====================================================

    let editingPublicationId = null;
    let selectedMediaName = "";
    let nextPublicationId = 7;

    // =====================================================
    // DATOS VISUALES DE DEMOSTRACIÓN
    // =====================================================

    let publications = [
        {
            id: 1,
            campaign: "Regreso a clases",
            title:
                "Descuentos especiales para el regreso a clases",
            description:
                "Encuentra los mejores productos escolares con promociones disponibles durante todo agosto.",
            platform: "Instagram",
            status: "Programada",
            date: "2026-08-01",
            time: "08:00",
            mediaType: "Imagen",
            mediaName: "regreso-clases.jpg",
            previewClass: "preview-school"
        },
        {
            id: 2,
            campaign: "Promoción de verano",
            title:
                "Este verano disfruta un 25% de descuento",
            description:
                "Publicación promocional pendiente de revisión y aprobación antes de establecer una fecha.",
            platform: "Facebook",
            status: "Borrador",
            date: "",
            time: "",
            mediaType: "Video",
            mediaName: "promocion-verano.mp4",
            previewClass: "preview-summer"
        },
        {
            id: 3,
            campaign: "Black Friday",
            title:
                "Este viernes comienzan nuestros descuentos",
            description:
                "Video promocional con adelanto de las ofertas principales de la campaña Black Friday.",
            platform: "TikTok",
            status: "Programada",
            date: "2026-11-25",
            time: "19:00",
            mediaType: "Video corto",
            mediaName: "black-friday.mp4",
            previewClass: "preview-black-friday"
        },
        {
            id: 4,
            campaign: "Regreso a clases",
            title:
                "Productos esenciales para iniciar el curso",
            description:
                "Selección de productos recomendados para estudiantes y familias.",
            platform: "Facebook",
            status: "Publicada",
            date: "2026-07-24",
            time: "14:30",
            mediaType: "Imagen",
            mediaName: "productos-escolares.jpg",
            previewClass: "preview-school"
        },
        {
            id: 5,
            campaign: "Promoción de verano",
            title:
                "Últimos días de nuestra promoción especial",
            description:
                "Recordatorio del cierre de la promoción de verano.",
            platform: "X",
            status: "Cancelada",
            date: "2026-07-30",
            time: "10:00",
            mediaType: "Imagen",
            mediaName: "cierre-promocion.jpg",
            previewClass: "preview-summer"
        },
        {
            id: 6,
            campaign: "Black Friday",
            title:
                "Conoce las categorías participantes",
            description:
                "Contenido informativo sobre los productos incluidos en las promociones.",
            platform: "Instagram",
            status: "Programada",
            date: "2026-11-20",
            time: "17:30",
            mediaType: "Carrusel",
            mediaName: "categorias-black-friday.jpg",
            previewClass: "preview-black-friday"
        }
    ];

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

    // =====================================================
    // FUNCIONES AUXILIARES
    // =====================================================

    function normalizeText(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getInitials(name) {
        return (
            String(name || "")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(word =>
                    word.charAt(0).toUpperCase()
                )
                .join("") || "EM"
        );
    }

    function getPlatformClass(platform) {
        return normalizeText(platform)
            .replaceAll(" ", "-");
    }

    function getStatusClass(status) {
        const normalizedStatus =
            normalizeText(status);

        const classes = {
            programada: "scheduled",
            borrador: "draft",
            publicada: "published",
            cancelada: "cancelled"
        };

        return classes[normalizedStatus] || "draft";
    }

    function getStatusIcon(status) {
        const normalizedStatus =
            normalizeText(status);

        const icons = {
            programada: "clock-3",
            borrador: "file-pen-line",
            publicada: "circle-check-big",
            cancelada: "circle-x"
        };

        return icons[normalizedStatus] || "file";
    }

    function getPlatformIcon(platform) {
        const normalizedPlatform =
            normalizeText(platform);

        const icons = {
            instagram: "instagram",
            facebook: "message-circle",
            tiktok: "music-2",
            x: "at-sign"
        };

        return icons[normalizedPlatform] || "share-2";
    }

    function getMediaIcon(mediaType) {
        const normalizedType =
            normalizeText(mediaType);

        return normalizedType.includes("video")
            ? "video"
            : "image";
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return "Fecha no asignada";
        }

        const [year, month, day] =
            dateValue.split("-").map(Number);

        const date =
            new Date(year, month - 1, day);

        return new Intl.DateTimeFormat(
            "es-CR",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(date);
    }

    function formatShortDate(dateValue) {
        if (!dateValue) {
            return "";
        }

        const [year, month, day] =
            dateValue.split("-").map(Number);

        const date =
            new Date(year, month - 1, day);

        return new Intl.DateTimeFormat(
            "es-CR",
            {
                day: "2-digit",
                month: "short"
            }
        ).format(date);
    }

    function formatTime(timeValue) {
        if (!timeValue) {
            return "Hora no asignada";
        }

        const [hours, minutes] =
            timeValue.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        return new Intl.DateTimeFormat(
            "es-CR",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        ).format(date);
    }

    function getDateTimeValue(publication) {
        if (!publication.date) {
            return Number.MAX_SAFE_INTEGER;
        }

        return new Date(
            `${publication.date}T${
                publication.time || "00:00"
            }:00`
        ).getTime();
    }

    // =====================================================
    // MENSAJES VISUALES
    // =====================================================

    function createToastContainer() {
        if (
            document.getElementById(
                "publicationToastContainer"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.textContent = `
            .publication-toast-container {
                position: fixed;
                z-index: 120000;
                right: 24px;
                bottom: 24px;
                display: flex;
                width: min(360px, calc(100vw - 32px));
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            }

            .publication-toast {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 15px 16px;
                border: 1px solid rgba(148, 190, 255, 0.18);
                border-radius: 15px;
                background:
                    linear-gradient(
                        145deg,
                        rgba(16, 38, 67, 0.98),
                        rgba(5, 17, 33, 0.98)
                    );
                box-shadow:
                    0 20px 50px rgba(0, 0, 0, 0.38),
                    inset 0 1px rgba(255, 255, 255, 0.05);
                color: #dce9f8;
                opacity: 0;
                transform: translateY(15px);
                transition:
                    opacity 220ms ease,
                    transform 220ms ease;
                pointer-events: auto;
            }

            .publication-toast.show {
                opacity: 1;
                transform: translateY(0);
            }

            .publication-toast-icon {
                display: grid;
                width: 34px;
                height: 34px;
                flex-shrink: 0;
                place-items: center;
                border-radius: 11px;
                background: rgba(37, 99, 235, 0.13);
                color: #8fc5ff;
            }

            .publication-toast.success
            .publication-toast-icon {
                background: rgba(34, 197, 94, 0.1);
                color: #78edba;
            }

            .publication-toast.error
            .publication-toast-icon {
                background: rgba(244, 63, 94, 0.1);
                color: #fda4af;
            }

            .publication-toast-icon svg {
                width: 17px;
                height: 17px;
            }

            .publication-toast-content {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .publication-toast-content strong {
                color: #f8fbff;
                font-size: 11px;
            }

            .publication-toast-content span {
                color: #8296af;
                font-size: 9px;
                line-height: 1.55;
            }
        `;

        document.head.appendChild(style);

        const container =
            document.createElement("div");

        container.id =
            "publicationToastContainer";

        container.className =
            "publication-toast-container";

        document.body.appendChild(container);
    }

    function showToast(
        title,
        message,
        type = "information"
    ) {
        createToastContainer();

        const container =
            document.getElementById(
                "publicationToastContainer"
            );

        const icons = {
            information: "info",
            success: "circle-check-big",
            error: "triangle-alert"
        };

        const toast =
            document.createElement("div");

        toast.className =
            `publication-toast ${type}`;

        toast.innerHTML = `
            <div class="publication-toast-icon">
                <i data-lucide="${
                    icons[type] || "info"
                }"></i>
            </div>

            <div class="publication-toast-content">
                <strong>${escapeHtml(title)}</strong>
                <span>${escapeHtml(message)}</span>
            </div>
        `;

        container.appendChild(toast);

        renderIcons();

        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        window.setTimeout(() => {
            toast.classList.remove("show");

            window.setTimeout(() => {
                toast.remove();
            }, 220);
        }, 3200);
    }

    // =====================================================
    // INFORMACIÓN DEL USUARIO
    // =====================================================

    function setUserInformation() {
        const userName =
            localStorage.getItem("nombre") ||
            localStorage.getItem("userName") ||
            "Usuario TecnoSula";

      const role = "Planificación de contenido";

        if (employeeName) {
            employeeName.textContent = userName;
        }

        if (employeeInitials) {
            employeeInitials.textContent =
                getInitials(userName);
        }

        if (employeeRole) {
            employeeRole.textContent = role;
        }
    }

    // =====================================================
    // MOSTRAR PUBLICACIONES
    // =====================================================

    function createPublicationCard(publication) {
        const statusClass =
            getStatusClass(publication.status);

        const platformClass =
            getPlatformClass(publication.platform);

        const scheduleContent =
            publication.date && publication.time
                ? `
                    <div>
                        <i data-lucide="calendar-days"></i>

                        <span>
                            <small>Fecha</small>
                            ${escapeHtml(
                                formatDate(publication.date)
                            )}
                        </span>
                    </div>

                    <div>
                        <i data-lucide="clock"></i>

                        <span>
                            <small>Hora</small>
                            ${escapeHtml(
                                formatTime(publication.time)
                            )}
                        </span>
                    </div>
                `
                : `
                    <div>
                        <i data-lucide="calendar-x"></i>

                        <span>
                            <small>Programación</small>
                            Fecha todavía no asignada
                        </span>
                    </div>
                `;

        return `
            <article
                class="publication-card"
                data-publication-id="${publication.id}"
                data-status="${escapeHtml(
                    publication.status
                )}"
                data-platform="${escapeHtml(
                    publication.platform
                )}"
            >

                <div class="publication-preview ${
                    publication.previewClass
                }">

                    <div class="preview-overlay"></div>

                    <span class="preview-type">
                        <i data-lucide="${getMediaIcon(
                            publication.mediaType
                        )}"></i>

                        ${escapeHtml(
                            publication.mediaType
                        )}
                    </span>

                    <div class="preview-campaign">
                        ${escapeHtml(publication.campaign)}
                    </div>

                </div>

                <div class="publication-card-content">

                    <div class="publication-card-top">

                        <div class="publication-platform ${platformClass}">

                            <i data-lucide="${getPlatformIcon(
                                publication.platform
                            )}"></i>

                            <span>
                                ${escapeHtml(
                                    publication.platform
                                )}
                            </span>

                        </div>

                        <span class="publication-status ${statusClass}">
                            <i data-lucide="${getStatusIcon(
                                publication.status
                            )}"></i>

                            ${escapeHtml(publication.status)}
                        </span>

                    </div>

                    <h3>
                        ${escapeHtml(publication.title)}
                    </h3>

                    <p>
                        ${escapeHtml(
                            publication.description
                        )}
                    </p>

                    <div class="publication-schedule ${
                        publication.date ? "" : "empty"
                    }">
                        ${scheduleContent}
                    </div>

                    <div class="publication-card-footer">

                        <span class="campaign-reference">
                            <i data-lucide="radio"></i>

                            Campaña
                            ${escapeHtml(
                                publication.campaign
                            )}
                        </span>

                        <div class="publication-actions">

                            <button
                                class="publication-action-button"
                                type="button"
                                title="Vista previa"
                                data-action="preview"
                                data-publication-id="${
                                    publication.id
                                }"
                            >
                                <i data-lucide="eye"></i>
                            </button>

                            <button
                                class="publication-action-button edit"
                                type="button"
                                title="Editar publicación"
                                data-action="edit"
                                data-publication-id="${
                                    publication.id
                                }"
                            >
                                <i data-lucide="pencil"></i>
                            </button>

                            <button
                                class="publication-action-button schedule"
                                type="button"
                                title="Modificar programación"
                                data-action="reschedule"
                                data-publication-id="${
                                    publication.id
                                }"
                            >
                                <i data-lucide="calendar-clock"></i>
                            </button>

                            <button
                                class="publication-action-button danger"
                                type="button"
                                title="Eliminar publicación"
                                data-action="delete"
                                data-publication-id="${
                                    publication.id
                                }"
                            >
                                <i data-lucide="trash-2"></i>
                            </button>

                        </div>

                    </div>

                </div>

            </article>
        `;
    }

    function renderPublications(publicationArray) {
        if (!publicationList) {
            return;
        }

        if (
            !Array.isArray(publicationArray) ||
            publicationArray.length === 0
        ) {
            publicationList.innerHTML = `
                <div class="publication-empty">

                    <div class="publication-empty-icon">
                        <i data-lucide="search-x"></i>
                    </div>

                    <h3>
                        No se encontraron publicaciones
                    </h3>

                    <p>
                        Modifica los filtros o crea una nueva
                        publicación para comenzar.
                    </p>

                </div>
            `;

            if (resultCount) {
                resultCount.textContent = "0";
            }

            renderIcons();
            return;
        }

        publicationList.innerHTML =
            publicationArray
                .map(createPublicationCard)
                .join("");

        if (resultCount) {
            resultCount.textContent =
                String(publicationArray.length);
        }

        renderIcons();
    }

    // =====================================================
    // FILTROS
    // =====================================================

    function applyFilters() {
        const searchValue =
            normalizeText(publicationSearch?.value);

        const selectedCampaign =
            normalizeText(campaignFilter?.value);

        const selectedPlatform =
            normalizeText(platformFilter?.value);

        const selectedStatus =
            normalizeText(
                publicationStatusFilter?.value
            );

        const filteredPublications =
            publications.filter(publication => {
                const searchableContent =
                    normalizeText(
                        `${publication.title}
                         ${publication.description}
                         ${publication.campaign}
                         ${publication.platform}`
                    );

                const matchesSearch =
                    !searchValue ||
                    searchableContent.includes(
                        searchValue
                    );

                const campaignValue =
                    normalizeText(
                        publication.campaign
                    ).replaceAll(" ", "-");

                const matchesCampaign =
                    selectedCampaign === "todas" ||
                    campaignValue === selectedCampaign;

                const matchesPlatform =
                    selectedPlatform === "todas" ||
                    normalizeText(
                        publication.platform
                    ) === selectedPlatform;

                const matchesStatus =
                    selectedStatus === "todos" ||
                    normalizeText(
                        publication.status
                    ) === selectedStatus;

                return (
                    matchesSearch &&
                    matchesCampaign &&
                    matchesPlatform &&
                    matchesStatus
                );
            });

        renderPublications(filteredPublications);
    }

    // =====================================================
    // MÉTRICAS
    // =====================================================

    function updateMetrics() {
        const statusOrder = [
            "Programada",
            "Borrador",
            "Publicada",
            "Cancelada"
        ];

        metricCards.forEach((card, index) => {
            const status = statusOrder[index];

            const count =
                publications.filter(
                    publication =>
                        publication.status === status
                ).length;

            const numberElement =
                card.querySelector(
                    ".metric-information strong"
                );

            if (numberElement) {
                numberElement.textContent =
                    String(count).padStart(2, "0");
            }
        });
    }

    // =====================================================
    // AGENDA Y PRÓXIMA PUBLICACIÓN
    // =====================================================

    function getScheduledPublications() {
        return publications
            .filter(publication => {
                return (
                    publication.status ===
                        "Programada" &&
                    publication.date &&
                    publication.time
                );
            })
            .sort(
                (firstPublication, secondPublication) =>
                    getDateTimeValue(firstPublication) -
                    getDateTimeValue(secondPublication)
            );
    }

    function updateAgenda() {
        if (!agendaTimeline) {
            return;
        }

        const scheduledPublications =
            getScheduledPublications();

        const agendaPublications =
            scheduledPublications.slice(0, 3);

        if (agendaPublications.length === 0) {
            agendaTimeline.innerHTML = `
                <div class="publication-empty">
                    <div class="publication-empty-icon">
                        <i data-lucide="calendar-x"></i>
                    </div>

                    <h3>Agenda sin publicaciones</h3>

                    <p>
                        No existen publicaciones programadas.
                    </p>
                </div>
            `;

            if (agendaSummary) {
                agendaSummary.textContent =
                    "No tienes contenido programado.";
            }

            renderIcons();
            return;
        }

        const firstPublication =
            agendaPublications[0];

        const [year, month, day] =
            firstPublication.date
                .split("-")
                .map(Number);

        const firstDate =
            new Date(year, month - 1, day);

        if (agendaDateNumber) {
            agendaDateNumber.textContent =
                String(day).padStart(2, "0");
        }

        if (agendaDateInformation) {
            agendaDateInformation.innerHTML = `
                <strong>
                    ${new Intl.DateTimeFormat(
                        "es-CR",
                        { weekday: "long" }
                    ).format(firstDate)}
                </strong>

                <span>
                    ${new Intl.DateTimeFormat(
                        "es-CR",
                        {
                            month: "long",
                            year: "numeric"
                        }
                    ).format(firstDate)}
                </span>
            `;
        }

        agendaTimeline.innerHTML =
            agendaPublications
                .map(publication => {
                    const platformClass =
                        getPlatformClass(
                            publication.platform
                        );

                    return `
                        <article class="agenda-item">

                            <div class="agenda-time">
                                ${escapeHtml(
                                    publication.time
                                )}
                            </div>

                            <div class="agenda-line">
                                <span></span>
                            </div>

                            <div class="agenda-content">

                                <span class="agenda-platform ${platformClass}">
                                    <i data-lucide="${getPlatformIcon(
                                        publication.platform
                                    )}"></i>

                                    ${escapeHtml(
                                        publication.platform
                                    )}
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        publication.title
                                    )}
                                </strong>

                                <small>
                                    Campaña
                                    ${escapeHtml(
                                        publication.campaign
                                    )}
                                    ·
                                    ${escapeHtml(
                                        formatShortDate(
                                            publication.date
                                        )
                                    )}
                                </small>

                            </div>

                        </article>
                    `;
                })
                .join("");

        if (agendaSummary) {
            agendaSummary.textContent =
                `Tienes ${scheduledPublications.length} ` +
                `publicaciones preparadas.`;
        }

        renderIcons();
    }

    function updateHeroPublication() {
        if (!heroCalendar) {
            return;
        }

        const nextPublication =
            getScheduledPublications()[0];

        if (!nextPublication) {
            return;
        }

        const header =
            heroCalendar.querySelector(
                ".hero-calendar-header"
            );

        const content =
            heroCalendar.querySelector(
                ".hero-calendar-content"
            );

        const footer =
            heroCalendar.querySelector(
                ".hero-calendar-footer"
            );

        if (header) {
            header.innerHTML = `
                <div>
                    <span>Próxima publicación</span>

                    <strong>
                        ${escapeHtml(
                            formatTime(
                                nextPublication.time
                            )
                        )}
                    </strong>
                </div>

                <div class="hero-calendar-icon">
                    <i data-lucide="send"></i>
                </div>
            `;
        }

        if (content) {
            content.innerHTML = `
                <span class="hero-platform ${getPlatformClass(
                    nextPublication.platform
                )}">
                    <i data-lucide="${getPlatformIcon(
                        nextPublication.platform
                    )}"></i>

                    ${escapeHtml(
                        nextPublication.platform
                    )}
                </span>

                <h3>
                    ${escapeHtml(
                        nextPublication.title
                    )}
                </h3>

                <p>
                    Contenido preparado para la campaña
                    ${escapeHtml(
                        nextPublication.campaign
                    )}.
                </p>
            `;
        }

        if (footer) {
            footer.innerHTML = `
                <span>
                    <i data-lucide="calendar-days"></i>

                    ${escapeHtml(
                        formatDate(
                            nextPublication.date
                        )
                    )}
                </span>

                <span class="scheduled-indicator">
                    Programada
                </span>
            `;
        }

        renderIcons();
    }

    function refreshModule() {
        applyFilters();
        updateMetrics();
        updateAgenda();
        updateHeroPublication();
    }

    // =====================================================
    // SELECCIÓN DE PLATAFORMA
    // =====================================================

    function selectPlatform(platform) {
        const normalizedPlatform =
            normalizeText(platform);

        if (publicationPlatform) {
            publicationPlatform.value =
                platform || "";
        }

        platformOptions.forEach(button => {
            const selected =
                normalizeText(
                    button.dataset.platform
                ) === normalizedPlatform;

            button.classList.toggle(
                "selected",
                selected
            );

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });
    }

    // =====================================================
    // SELECCIÓN DE ESTADO
    // =====================================================

    function selectStatus(status) {
        const normalizedStatus =
            normalizeText(status);

        if (publicationStatus) {
            publicationStatus.value =
                status || "";
        }

        statusOptions.forEach(button => {
            const selected =
                normalizeText(
                    button.dataset.status
                ) === normalizedStatus;

            button.classList.toggle(
                "selected",
                selected
            );

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });

        const scheduled =
            normalizedStatus === "programada";

        if (publicationDate) {
            publicationDate.required = scheduled;
        }

        if (publicationTime) {
            publicationTime.required = scheduled;
        }
    }

    // =====================================================
    // MENSAJES DEL FORMULARIO
    // =====================================================

    function showFormMessage(
        message,
        type = ""
    ) {
        if (!publicationFormMessage) {
            return;
        }

        publicationFormMessage.textContent =
            message;

        publicationFormMessage.className =
            "publication-form-message";

        if (type) {
            publicationFormMessage.classList.add(
                type
            );
        }
    }

    function clearFormMessage() {
        showFormMessage("");
    }

    // =====================================================
    // MULTIMEDIA VISUAL
    // =====================================================

    function resetMediaArea() {
        selectedMediaName = "";

        if (!mediaUploadArea) {
            return;
        }

        mediaUploadArea.innerHTML = `
            <span class="media-upload-icon">
                <i data-lucide="image-up"></i>
            </span>

            <span>
                <strong>
                    Seleccionar imagen o video
                </strong>

                <small>
                    PNG, JPG o MP4 · Máximo 20 MB
                </small>
            </span>

            <span class="media-upload-button">
                Examinar
            </span>
        `;

        renderIcons();
    }

    function showSelectedMedia(fileName) {
        selectedMediaName = fileName;

        if (!mediaUploadArea) {
            return;
        }

        mediaUploadArea.innerHTML = `
            <span class="media-upload-icon">
                <i data-lucide="file-check-2"></i>
            </span>

            <span>
                <strong>
                    ${escapeHtml(fileName)}
                </strong>

                <small>
                    Archivo seleccionado para demostración
                </small>
            </span>

            <span class="media-upload-button">
                Cambiar
            </span>
        `;

        renderIcons();
    }

    function openMediaSelector() {
        const fileInput =
            document.createElement("input");

        fileInput.type = "file";
        fileInput.accept =
            "image/png,image/jpeg,video/mp4";

        fileInput.addEventListener(
            "change",
            () => {
                const file = fileInput.files?.[0];

                if (!file) {
                    return;
                }

                showSelectedMedia(file.name);

                showToast(
                    "Archivo seleccionado",
                    "El archivo se utilizará únicamente como demostración visual.",
                    "success"
                );
            }
        );

        fileInput.click();
    }

    // =====================================================
    // ABRIR Y CERRAR MODAL
    // =====================================================

    function resetPublicationForm() {
        publicationForm?.reset();

        editingPublicationId = null;

        selectPlatform("");
        selectStatus("Borrador");

        if (publicationDate) {
            publicationDate.value = "";
        }

        if (publicationTime) {
            publicationTime.value = "";
        }

        if (descriptionCounter) {
            descriptionCounter.textContent = "0";
        }

        resetMediaArea();
        clearFormMessage();
    }

    function openPublicationModal(
        mode = "create",
        publication = null
    ) {
        resetPublicationForm();

        if (mode === "edit" && publication) {
            editingPublicationId =
                publication.id;

            publicationModalTitle.textContent =
                "Editar publicación";

            savePublicationButton.innerHTML = `
                <i data-lucide="save"></i>
                Guardar cambios
            `;

            publicationCampaign.value =
                publication.campaign;

            publicationTitle.value =
                publication.title;

            publicationDescription.value =
                publication.description;

            publicationDate.value =
                publication.date || "";

            publicationTime.value =
                publication.time || "";

            selectPlatform(
                publication.platform
            );

            selectStatus(
                publication.status === "Programada"
                    ? "Programada"
                    : "Borrador"
            );

            if (publication.mediaName) {
                showSelectedMedia(
                    publication.mediaName
                );
            }

            descriptionCounter.textContent =
                String(
                    publication.description.length
                );
        } else {
            publicationModalTitle.textContent =
                "Nueva publicación";

            savePublicationButton.innerHTML = `
                <i data-lucide="save"></i>
                Guardar publicación
            `;
        }

        publicationModal.hidden = false;

        publicationModal.setAttribute(
            "aria-hidden",
            "false"
        );

        requestAnimationFrame(() => {
            publicationModal.classList.add(
                "show"
            );
        });

        document.body.style.overflow =
            "hidden";

        renderIcons();

        window.setTimeout(() => {
            publicationCampaign?.focus();
        }, 220);
    }

    function closePublicationModal() {
        if (!publicationModal) {
            return;
        }

        publicationModal.classList.remove(
            "show"
        );

        publicationModal.setAttribute(
            "aria-hidden",
            "true"
        );

        window.setTimeout(() => {
            publicationModal.hidden = true;
            resetPublicationForm();
        }, 220);

        document.body.style.overflow =
            sidebar?.classList.contains("open")
                ? "hidden"
                : "";
    }

    // =====================================================
    // GUARDAR PUBLICACIÓN VISUALMENTE
    // =====================================================

    function getPreviewClass(campaign) {
        const normalizedCampaign =
            normalizeText(campaign);

        if (
            normalizedCampaign.includes(
                "regreso"
            )
        ) {
            return "preview-school";
        }

        if (
            normalizedCampaign.includes(
                "verano"
            )
        ) {
            return "preview-summer";
        }

        return "preview-black-friday";
    }

    function savePublication(event) {
        event.preventDefault();

        const campaign =
            publicationCampaign?.value?.trim();

        const title =
            publicationTitle?.value?.trim();

        const description =
            publicationDescription?.value?.trim();

        const platform =
            publicationPlatform?.value?.trim();

        const status =
            publicationStatus?.value?.trim();

        const date =
            publicationDate?.value || "";

        const time =
            publicationTime?.value || "";

        if (
            !campaign ||
            !title ||
            !description ||
            !platform ||
            !status
        ) {
            showFormMessage(
                "Completa la campaña, el título, el contenido, la plataforma y el estado.",
                "error"
            );

            return;
        }

        if (
            status === "Programada" &&
            (!date || !time)
        ) {
            showFormMessage(
                "Las publicaciones programadas deben tener una fecha y una hora.",
                "error"
            );

            return;
        }

        const publicationData = {
            campaign,
            title,
            description,
            platform,
            status,
            date:
                status === "Programada"
                    ? date
                    : "",
            time:
                status === "Programada"
                    ? time
                    : "",
            mediaType:
                selectedMediaName
                    .toLowerCase()
                    .endsWith(".mp4")
                    ? "Video"
                    : "Imagen",
            mediaName:
                selectedMediaName ||
                "archivo-demostracion.jpg",
            previewClass:
                getPreviewClass(campaign)
        };

        if (editingPublicationId) {
            publications =
                publications.map(publication => {
                    if (
                        publication.id !==
                        editingPublicationId
                    ) {
                        return publication;
                    }

                    return {
                        ...publication,
                        ...publicationData
                    };
                });

            showToast(
                "Publicación actualizada",
                "Los cambios se reflejaron correctamente en la vista de demostración.",
                "success"
            );
        } else {
            publications.unshift({
                id: nextPublicationId++,
                ...publicationData
            });

            showToast(
                "Publicación creada",
                "La nueva publicación fue agregada a la demostración.",
                "success"
            );
        }

        refreshModule();
        closePublicationModal();
    }

    // =====================================================
    // ACCIONES DE PUBLICACIONES
    // =====================================================

    function findPublicationById(id) {
        return publications.find(
            publication =>
                publication.id === Number(id)
        );
    }

    function previewPublication(publication) {
        const programming =
            publication.date
                ? `${formatDate(
                      publication.date
                  )}, ${formatTime(
                      publication.time
                  )}`
                : "Sin fecha programada";

        showToast(
            publication.title,
            `${publication.platform} · ${publication.status} · ${programming}`,
            "information"
        );
    }

    function deletePublication(publication) {
        const confirmed =
            window.confirm(
                `¿Deseas eliminar la publicación "${publication.title}"?`
            );

        if (!confirmed) {
            return;
        }

        publications =
            publications.filter(
                currentPublication =>
                    currentPublication.id !==
                    publication.id
            );

        refreshModule();

        showToast(
            "Publicación eliminada",
            "La publicación fue retirada de la demostración.",
            "success"
        );
    }

    function handlePublicationAction(event) {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const publication =
            findPublicationById(
                button.dataset.publicationId
            );

        if (!publication) {
            return;
        }

        const action =
            button.dataset.action;

        if (action === "preview") {
            previewPublication(publication);
            return;
        }

        if (action === "edit") {
            openPublicationModal(
                "edit",
                publication
            );
            return;
        }

        if (action === "reschedule") {
            openPublicationModal(
                "edit",
                {
                    ...publication,
                    status: "Programada"
                }
            );

            window.setTimeout(() => {
                publicationDate?.focus();
            }, 260);

            return;
        }

        if (action === "delete") {
            deletePublication(publication);
        }
    }

    // =====================================================
    // SIDEBAR
    // =====================================================

    function openSidebar() {
        sidebar?.classList.add("open");
        sidebarOverlay?.classList.add("show");

        document.body.style.overflow =
            "hidden";
    }

    function closeSidebar() {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove(
            "show"
        );

        if (
            publicationModal?.hidden !==
            false
        ) {
            document.body.style.overflow =
                "";
        }
    }

    // =====================================================
    // EVENTOS
    // =====================================================

    publicationSearch?.addEventListener(
        "input",
        applyFilters
    );

    campaignFilter?.addEventListener(
        "change",
        applyFilters
    );

    platformFilter?.addEventListener(
        "change",
        applyFilters
    );

    publicationStatusFilter?.addEventListener(
        "change",
        applyFilters
    );

    newPublicationButton?.addEventListener(
        "click",
        () => {
            openPublicationModal("create");
        }
    );

    closePublicationModalButton?.addEventListener(
        "click",
        closePublicationModal
    );

    cancelPublicationButton?.addEventListener(
        "click",
        closePublicationModal
    );

    publicationModal?.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                publicationModal
            ) {
                closePublicationModal();
            }
        }
    );

    publicationForm?.addEventListener(
        "submit",
        savePublication
    );

    publicationDescription?.addEventListener(
        "input",
        () => {
            descriptionCounter.textContent =
                String(
                    publicationDescription.value
                        .length
                );
        }
    );

    platformOptions.forEach(button => {
        button.addEventListener(
            "click",
            () => {
                selectPlatform(
                    button.dataset.platform
                );
            }
        );
    });

    statusOptions.forEach(button => {
        button.addEventListener(
            "click",
            () => {
                selectStatus(
                    button.dataset.status
                );
            }
        );
    });

    mediaUploadArea?.addEventListener(
        "click",
        openMediaSelector
    );

    publicationList?.addEventListener(
        "click",
        handlePublicationAction
    );

    calendarViewButton?.addEventListener(
        "click",
        () => {
            agenda?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            showToast(
                "Vista de programación",
                "La agenda muestra las próximas publicaciones registradas.",
                "information"
            );
        }
    );

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

    logoutButton?.addEventListener(
        "click",
        () => {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            localStorage.removeItem("nombre");
            localStorage.removeItem("userName");

            window.location.href =
                "index.html";
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key !== "Escape") {
                return;
            }

            if (
                publicationModal &&
                publicationModal.hidden === false
            ) {
                closePublicationModal();
                return;
            }

            closeSidebar();
        }
    );

    // =====================================================
    // INICIAR MÓDULO
    // =====================================================

    setUserInformation();
    selectStatus("Borrador");
    refreshModule();
    renderIcons();
});