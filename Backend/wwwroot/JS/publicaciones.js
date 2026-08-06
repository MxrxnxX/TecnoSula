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
        const publicationCampaignSelector =
    document.getElementById(
        "publicationCampaignSelector"
    );

const publicationCampaignTrigger =
    document.getElementById(
        "publicationCampaignTrigger"
    );

const publicationCampaignSelectedText =
    document.getElementById(
        "publicationCampaignSelectedText"
    );

const publicationCampaignMenu =
    document.getElementById(
        "publicationCampaignMenu"
    );

const publicationCampaignSearch =
    document.getElementById(
        "publicationCampaignSearch"
    );

const publicationCampaignOptions =
    document.getElementById(
        "publicationCampaignOptions"
    );

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
        const publicationDateDisplay =
    document.getElementById(
        "publicationDateDisplay"
    );

const publicationTimeDisplay =
    document.getElementById(
        "publicationTimeDisplay"
    );

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

let publications = [];
let campaigns = [];
let socialNetworks = [];
let publicationDatePicker = null;
let publicationTimePicker = null;

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
    // =====================================================
// PICKERS PERSONALIZADOS DE FECHA Y HORA
// =====================================================

function formatPickerDate(value) {
    if (!value) {
        return "Selecciona una fecha";
    }

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) {
        return "Selecciona una fecha";
    }

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    return date.toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}


function formatPickerTime(value) {
    if (!value) {
        return "Selecciona una hora";
    }

    const [hours, minutes] = value.split(":");

    if (
        hours === undefined ||
        minutes === undefined
    ) {
        return "Selecciona una hora";
    }

    const date = new Date();
    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    return date.toLocaleTimeString("es-CR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}


function updateDatePickerDisplay() {
    if (!publicationDateDisplay) {
        return;
    }

    publicationDateDisplay.textContent =
        formatPickerDate(
            publicationDate?.value || ""
        );

    publicationDate
        ?.closest(".publication-picker-control")
        ?.classList.toggle(
            "has-value",
            Boolean(publicationDate?.value)
        );
}


function updateTimePickerDisplay() {
    if (!publicationTimeDisplay) {
        return;
    }

    publicationTimeDisplay.textContent =
        formatPickerTime(
            publicationTime?.value || ""
        );

    publicationTime
        ?.closest(".publication-picker-control")
        ?.classList.toggle(
            "has-value",
            Boolean(publicationTime?.value)
        );
}
// =====================================================
// INICIALIZAR CALENDARIO Y SELECTOR DE HORA
// =====================================================

function initializePublicationPickers() {
    if (
        !publicationDate ||
        !publicationTime
    ) {
        return;
    }

    if (
        typeof window.flatpickr !==
        "function"
    ) {
        console.warn(
            "Flatpickr no está disponible."
        );

        updateDatePickerDisplay();
        updateTimePickerDisplay();

        return;
    }

    const locale =
        window.flatpickr?.l10ns?.es ||
        "default";

    if (!publicationDatePicker) {
        publicationDatePicker =
            window.flatpickr(
                publicationDate,
                {
                    locale,

                    dateFormat:
                        "Y-m-d",

                    minDate:
                        "today",

                    disableMobile:
                        true,

                    allowInput:
                        false,

                    clickOpens:
                        true,

                    monthSelectorType:
                        "static",

                    prevArrow: `
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="m15 18-6-6 6-6"
                            />
                        </svg>
                    `,

                    nextArrow: `
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="m9 18 6-6-6-6"
                            />
                        </svg>
                    `,

                    onChange: (
                        selectedDates,
                        dateString
                    ) => {
                        publicationDate.value =
                            dateString;

                        updateDatePickerDisplay();
                        clearFormMessage();
                    },

                    onReady: () => {
                        updateDatePickerDisplay();
                    }
                }
            );
    }

    if (!publicationTimePicker) {
        publicationTimePicker =
            window.flatpickr(
                publicationTime,
                {
                    locale,

                    enableTime:
                        true,

                    noCalendar:
                        true,

                    dateFormat:
                        "H:i",

                    time_24hr:
                        false,

                    minuteIncrement:
                        5,

                    defaultHour:
                        9,

                    defaultMinute:
                        0,

                    disableMobile:
                        true,

                    allowInput:
                        false,

                    clickOpens:
                        true,

                    onChange: (
                        selectedDates,
                        timeString
                    ) => {
                        publicationTime.value =
                            timeString;

                        updateTimePickerDisplay();
                        clearFormMessage();
                    },

                    onReady: () => {
                        updateTimePickerDisplay();
                    }
                }
            );
    }
}


function clearPublicationDateTime() {
    if (
        publicationDatePicker &&
        typeof publicationDatePicker.clear ===
            "function"
    ) {
        publicationDatePicker.clear(false);
    } else if (publicationDate) {
        publicationDate.value = "";
    }

    if (
        publicationTimePicker &&
        typeof publicationTimePicker.clear ===
            "function"
    ) {
        publicationTimePicker.clear(false);
    } else if (publicationTime) {
        publicationTime.value = "";
    }

    updateDatePickerDisplay();
    updateTimePickerDisplay();
}


function setPublicationDateTime(
    dateValue,
    timeValue
) {
    if (
        publicationDatePicker &&
        typeof publicationDatePicker.setDate ===
            "function"
    ) {
        if (dateValue) {
            publicationDatePicker.setDate(
                dateValue,
                false,
                "Y-m-d"
            );
        } else {
            publicationDatePicker.clear(
                false
            );
        }
    } else if (publicationDate) {
        publicationDate.value =
            dateValue || "";
    }

    if (
        publicationTimePicker &&
        typeof publicationTimePicker.setDate ===
            "function"
    ) {
        if (timeValue) {
            publicationTimePicker.setDate(
                timeValue,
                false,
                "H:i"
            );
        } else {
            publicationTimePicker.clear(
                false
            );
        }
    } else if (publicationTime) {
        publicationTime.value =
            timeValue || "";
    }

    updateDatePickerDisplay();
    updateTimePickerDisplay();
}

    // =====================================================
// SELECTOR PERSONALIZADO DE CAMPAÑAS
// =====================================================

function renderCampaignSelectorOptions(
    searchValue = ""
) {
    if (!publicationCampaignOptions) {
        return;
    }

    const normalizedSearch =
        normalizeText(searchValue);

    const selectedCampaignId =
        Number(
            publicationCampaign?.value
        );

    const filteredCampaigns =
        campaigns.filter(campaign => {
            return (
                !normalizedSearch ||
                normalizeText(
                    campaign.name
                ).includes(
                    normalizedSearch
                )
            );
        });

    if (filteredCampaigns.length === 0) {
        publicationCampaignOptions.innerHTML = `
            <div class="campaign-selector-empty">

                <i data-lucide="search-x"></i>

                <strong>
                    No se encontraron campañas
                </strong>

                <span>
                    Intenta con otro término de búsqueda.
                </span>

            </div>
        `;

        renderIcons();
        return;
    }

    publicationCampaignOptions.innerHTML =
        filteredCampaigns
            .map(campaign => {
                const selected =
                    campaign.id ===
                    selectedCampaignId;

                return `
                    <button
                        class="
                            campaign-selector-option
                            ${selected ? "selected" : ""}
                        "
                        type="button"
                        role="option"
                        aria-selected="${selected}"
                        data-campaign-id="${campaign.id}"
                    >

                        <span class="campaign-option-icon">
                            <i data-lucide="radio-tower"></i>
                        </span>

                        <span class="campaign-option-information">

                            <strong>
                                ${escapeHtml(
                                    campaign.name
                                )}
                            </strong>

                            <small>
                                Campaña #${campaign.id}
                            </small>

                        </span>

                        <span class="campaign-option-check">
                            <i data-lucide="check"></i>
                        </span>

                    </button>
                `;
            })
            .join("");

    renderIcons();
}


function openCampaignSelector() {
    if (
        !publicationCampaignMenu ||
        !publicationCampaignTrigger ||
        publicationCampaignTrigger.disabled
    ) {
        return;
    }

    publicationCampaignMenu.hidden =
        false;

    publicationCampaignSelector
        ?.classList.add("open");

    publicationCampaignTrigger.setAttribute(
        "aria-expanded",
        "true"
    );

    requestAnimationFrame(() => {
        publicationCampaignMenu.classList.add(
            "show"
        );
    });

    renderCampaignSelectorOptions(
        publicationCampaignSearch?.value || ""
    );

    window.setTimeout(() => {
        publicationCampaignSearch?.focus();
    }, 100);
}


function closeCampaignSelector() {
    if (
        !publicationCampaignMenu ||
        !publicationCampaignTrigger
    ) {
        return;
    }

    publicationCampaignMenu.classList.remove(
        "show"
    );

    publicationCampaignSelector
        ?.classList.remove("open");

    publicationCampaignTrigger.setAttribute(
        "aria-expanded",
        "false"
    );

    window.setTimeout(() => {
        if (
            !publicationCampaignSelector
                ?.classList.contains("open")
        ) {
            publicationCampaignMenu.hidden =
                true;
        }
    }, 170);
}


function toggleCampaignSelector() {
    const isOpen =
        publicationCampaignSelector
            ?.classList.contains("open");

    if (isOpen) {
        closeCampaignSelector();
        return;
    }

    openCampaignSelector();
}


function selectCampaign(
    campaignId,
    closeMenu = true
) {
    const normalizedId =
        Number(campaignId);

    const campaign =
        campaigns.find(item => {
            return item.id === normalizedId;
        });

    if (publicationCampaign) {
        publicationCampaign.value =
            campaign
                ? String(campaign.id)
                : "";
    }

    if (publicationCampaignSelectedText) {
        publicationCampaignSelectedText.textContent =
            campaign
                ? campaign.name
                : "Selecciona una campaña";
    }

    publicationCampaignTrigger
        ?.classList.toggle(
            "has-selection",
            Boolean(campaign)
        );

    renderCampaignSelectorOptions(
        publicationCampaignSearch?.value || ""
    );

    if (campaign) {
        clearFormMessage();
    }

    if (closeMenu) {
        closeCampaignSelector();
    }
}
// =====================================================
// FILTROS PERSONALIZADOS DE PUBLICACIONES
// =====================================================

function getCustomFilterConfiguration(
    select
) {
    const configurations = {
        campaignFilter: {
            icon: "radio-tower",
            label: "Campaña"
        },

        platformFilter: {
            icon: "share-2",
            label: "Plataforma"
        },

        publicationStatusFilter: {
            icon: "list-filter",
            label: "Estado"
        }
    };

    return (
        configurations[select.id] || {
            icon: "filter",
            label: "Filtro"
        }
    );
}


function closeAllCustomFilters(
    exceptFilter = null
) {
    document
        .querySelectorAll(
            ".publication-custom-filter.open"
        )
        .forEach(filter => {
            if (filter === exceptFilter) {
                return;
            }

            filter.classList.remove(
                "open"
            );

            const trigger =
                filter.querySelector(
                    ".publication-custom-filter-trigger"
                );

            trigger?.setAttribute(
                "aria-expanded",
                "false"
            );
        });
}


function updateCustomFilterVisual(
    select
) {
    const filterControl =
        select.closest(
            ".filter-control"
        );

    const customFilter =
        filterControl?.querySelector(
            ".publication-custom-filter"
        );

    if (!customFilter) {
        return;
    }

    const selectedOption =
        select.options[
            select.selectedIndex
        ];

    const selectedValue =
        selectedOption?.value || "";

    const selectedText =
        selectedOption?.textContent
            ?.trim() ||
        "Selecciona una opción";

    const selectedTextElement =
        customFilter.querySelector(
            ".publication-custom-filter-value"
        );

    if (selectedTextElement) {
        selectedTextElement.textContent =
            selectedText;
    }

    customFilter
        .querySelectorAll(
            ".publication-custom-filter-option"
        )
        .forEach(option => {
            const selected =
                option.dataset.value ===
                selectedValue;

            option.classList.toggle(
                "selected",
                selected
            );

            option.setAttribute(
                "aria-selected",
                String(selected)
            );
        });

    customFilter.classList.toggle(
        "has-selection",
        Boolean(
            selectedValue &&
            selectedValue !== "todas" &&
            selectedValue !== "todos"
        )
    );

    renderIcons();
}


function initializeCustomFilter(
    select
) {
    if (!select) {
        return;
    }

    const filterControl =
        select.closest(
            ".filter-control"
        );

    if (!filterControl) {
        return;
    }

    const existingFilter =
        filterControl.querySelector(
            ".publication-custom-filter"
        );

    if (existingFilter) {
        updateCustomFilterVisual(
            select
        );

        return;
    }

    const configuration =
        getCustomFilterConfiguration(
            select
        );

    filterControl.classList.add(
        "custom-filter-ready"
    );

    select.classList.add(
        "publication-native-filter"
    );

    const customFilter =
        document.createElement(
            "div"
        );

    customFilter.className =
        "publication-custom-filter";

    customFilter.innerHTML = `
        <button
            class="publication-custom-filter-trigger"
            type="button"
            aria-haspopup="listbox"
            aria-expanded="false"
        >
            <span class="publication-custom-filter-icon">
                <i
                    data-lucide="${configuration.icon}"
                ></i>
            </span>

            <span class="publication-custom-filter-information">
                <small>
                    ${configuration.label}
                </small>

                <strong
                    class="publication-custom-filter-value"
                >
                    Selecciona una opción
                </strong>
            </span>

            <span class="publication-custom-filter-chevron">
                <i data-lucide="chevron-down"></i>
            </span>
        </button>

        <div
            class="publication-custom-filter-menu"
            role="listbox"
        >
            <div class="publication-custom-filter-menu-header">
                <span>
                    Selecciona ${configuration.label.toLowerCase()}
                </span>

                <i data-lucide="sliders-horizontal"></i>
            </div>

            <div class="publication-custom-filter-options">
                ${Array.from(select.options)
                    .map(option => {
                        return `
                            <button
                                class="publication-custom-filter-option"
                                type="button"
                                role="option"
                                aria-selected="false"
                                data-value="${escapeHtml(
                                    option.value
                                )}"
                                ${
                                    option.disabled
                                        ? "disabled"
                                        : ""
                                }
                            >
                                <span class="publication-custom-filter-option-icon">
                                    <i
                                        data-lucide="${configuration.icon}"
                                    ></i>
                                </span>

                                <span class="publication-custom-filter-option-text">
                                    ${escapeHtml(
                                        option.textContent.trim()
                                    )}
                                </span>

                                <span class="publication-custom-filter-option-check">
                                    <i data-lucide="check"></i>
                                </span>
                            </button>
                        `;
                    })
                    .join("")}
            </div>
        </div>
    `;

    filterControl.appendChild(
        customFilter
    );

    const trigger =
        customFilter.querySelector(
            ".publication-custom-filter-trigger"
        );

    trigger?.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            const willOpen =
                !customFilter.classList
                    .contains("open");

            closeAllCustomFilters(
                customFilter
            );

            customFilter.classList.toggle(
                "open",
                willOpen
            );

            trigger.setAttribute(
                "aria-expanded",
                String(willOpen)
            );
        }
    );

    customFilter.addEventListener(
        "click",
        event => {
            const option =
                event.target.closest(
                    ".publication-custom-filter-option"
                );

            if (
                !option ||
                option.disabled
            ) {
                return;
            }

            select.value =
                option.dataset.value;

            select.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );

            updateCustomFilterVisual(
                select
            );

            customFilter.classList.remove(
                "open"
            );

            trigger?.setAttribute(
                "aria-expanded",
                "false"
            );

            trigger?.focus();
        }
    );

    select.addEventListener(
        "change",
        () => {
            updateCustomFilterVisual(
                select
            );
        }
    );

    updateCustomFilterVisual(
        select
    );
}


function initializeCustomFilters() {
    [
        campaignFilter,
        platformFilter,
        publicationStatusFilter
    ].forEach(select => {
        initializeCustomFilter(
            select
        );
    });

    document.addEventListener(
        "click",
        event => {
            if (
                !event.target.closest(
                    ".publication-custom-filter"
                )
            ) {
                closeAllCustomFilters();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeAllCustomFilters();
            }
        }
    );

    renderIcons();
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
    function getPublicationPlatforms(publication) {
    const platformList =
        Array.isArray(publication?.platforms)
            ? publication.platforms
            : [publication?.platform];

    const uniquePlatforms = new Map();

    platformList.forEach(platform => {
        const cleanPlatform =
            String(platform || "").trim();

        if (!cleanPlatform) {
            return;
        }

        const normalizedPlatform =
            normalizeText(cleanPlatform);

        if (!uniquePlatforms.has(normalizedPlatform)) {
            uniquePlatforms.set(
                normalizedPlatform,
                cleanPlatform
            );
        }
    });

    return Array.from(
        uniquePlatforms.values()
    );
}
function renderPlatformBadges(
    platforms,
    badgeClass = "publication-platform"
) {
    return platforms
        .map(platform => {
            const platformClass =
                getPlatformClass(platform);

            return `
                <span
                    class="${badgeClass} ${platformClass}"
                >
                    <i
                        data-lucide="${getPlatformIcon(
                            platform
                        )}"
                    ></i>

                    ${escapeHtml(platform)}
                </span>
            `;
        })
        .join("");
}

function readSelectedPlatforms() {
    if (!publicationPlatform) {
        return [];
    }

    const storedValue =
        publicationPlatform.value?.trim();

    if (!storedValue) {
        return [];
    }

    try {
        const parsedPlatforms =
            JSON.parse(storedValue);

        if (Array.isArray(parsedPlatforms)) {
            return parsedPlatforms
                .map(platform =>
                    String(platform || "").trim()
                )
                .filter(Boolean);
        }
    } catch (error) {
        // Compatibilidad con valores antiguos.
    }

    return storedValue
        .split(",")
        .map(platform => platform.trim())
        .filter(Boolean);
}

// =====================================================
// NORMALIZAR RESPUESTAS DE LA API
// =====================================================

function getResponseArray(response, propertyName = "") {
    if (Array.isArray(response)) {
        return response;
    }

    if (
        propertyName &&
        Array.isArray(response?.[propertyName])
    ) {
        return response[propertyName];
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}


function separateDateTime(dateTimeValue) {
    if (!dateTimeValue) {
        return {
            date: "",
            time: ""
        };
    }

    const normalizedValue =
        String(dateTimeValue);

    const [datePart, timePart = ""] =
        normalizedValue.split("T");

    return {
        date: datePart || "",
        time: timePart.slice(0, 5)
    };
}


function getFileNameFromUrl(url) {
    if (!url) {
        return "";
    }

    const cleanUrl =
        String(url).split("?")[0];

    const parts =
        cleanUrl.split(/[\\/]/);

    return parts.at(-1) || "";
}


function mapApiPublication(apiPublication) {
    const programming =
        separateDateTime(
            apiPublication.fechaProgramacion ??
            apiPublication.FechaProgramacion
        );

    const apiNetworks =
        getResponseArray(
            apiPublication.redesSociales ??
            apiPublication.RedesSociales
        );

    const mappedNetworks =
        apiNetworks
            .map(network => ({
                id:
                    Number(
                        network.idRedSocial ??
                        network.IdRedSocial
                    ),

                name:
                    String(
                        network.nombre ??
                        network.Nombre ??
                        ""
                    ).trim()
            }))
            .filter(network => {
                return (
                    Number.isFinite(network.id) &&
                    network.id > 0 &&
                    network.name
                );
            });

    const campaignName =
        String(
            apiPublication.nombreCampana ??
            apiPublication.NombreCampana ??
            "Sin campaña"
        );

    const mediaUrl =
        apiPublication.urlMultimedia ??
        apiPublication.UrlMultimedia ??
        "";

    const platforms =
        mappedNetworks.map(
            network => network.name
        );

    return {
        id:
            Number(
                apiPublication.idPublicacion ??
                apiPublication.IdPublicacion
            ),

        campaignId:
            Number(
                apiPublication.idCampana ??
                apiPublication.IdCampana
            ),

        campaign:
            campaignName,

        title:
            String(
                apiPublication.titulo ??
                apiPublication.Titulo ??
                ""
            ),

        description:
            String(
                apiPublication.descripcion ??
                apiPublication.Descripcion ??
                ""
            ),

        platforms,

        socialNetworkIds:
            mappedNetworks.map(
                network => network.id
            ),

        // Compatibilidad con funciones anteriores.
        platform:
            platforms[0] || "",

        status:
            String(
                apiPublication.estado ??
                apiPublication.Estado ??
                "Borrador"
            ),

        date:
            programming.date,

        time:
            programming.time,

        mediaType:
            String(
                apiPublication.tipoMultimedia ??
                apiPublication.TipoMultimedia ??
                "Imagen"
            ),

        mediaUrl,

        mediaName:
            getFileNameFromUrl(mediaUrl),

        createdBy:
            String(
                apiPublication.nombreUsuario ??
                apiPublication.NombreUsuario ??
                ""
            ),

        previewClass:
            getPreviewClass(campaignName)
    };
}


// =====================================================
// OBTENER IDS DE LAS REDES SELECCIONADAS
// =====================================================

function readSelectedSocialNetworkIds() {
    const selectedNames =
        readSelectedPlatforms();

    return selectedNames
        .map(selectedName => {
            const network =
                socialNetworks.find(item => {
                    return (
                        normalizeText(item.name) ===
                        normalizeText(selectedName)
                    );
                });

            return network?.id;
        })
        .filter(id => {
            return (
                Number.isFinite(id) &&
                id > 0
            );
        });
}


// =====================================================
// MOSTRAR CARGA
// =====================================================

function renderPublicationsLoading() {
    if (!publicationList) {
        return;
    }

    publicationList.innerHTML = `
        <div class="publication-empty">

            <div class="publication-empty-icon">
                <i data-lucide="loader-circle"></i>
            </div>

            <h3>Cargando publicaciones</h3>

            <p>
                Estamos consultando la información
                registrada en TecnoSula.
            </p>

        </div>
    `;

    renderIcons();
}


// =====================================================
// CARGAR CAMPAÑAS
// =====================================================

async function loadCampaignsFromApi() {
    const response =
        await window.TecnoSulaApi
            .campanas
            .obtenerTodas();

    const apiCampaigns =
        getResponseArray(response, "campanas");

    campaigns =
        apiCampaigns
            .map(campaign => ({
                id:
                    Number(
                        campaign.idCampana ??
                        campaign.IdCampana
                    ),

                name:
                    String(
                        campaign.nombre ??
                        campaign.Nombre ??
                        ""
                    ).trim()
            }))
            .filter(campaign => {
                return (
                    Number.isFinite(campaign.id) &&
                    campaign.id > 0 &&
                    campaign.name
                );
            });

   if (publicationCampaignTrigger) {
    publicationCampaignTrigger.disabled =
        campaigns.length === 0;
}

if (publicationCampaignSelectedText) {
    publicationCampaignSelectedText.textContent =
        campaigns.length > 0
            ? "Selecciona una campaña"
            : "No hay campañas disponibles";
}

selectCampaign(null, false);

renderCampaignSelectorOptions();

    if (campaignFilter) {
        campaignFilter.innerHTML = `
            <option value="todas">
                Todas las campañas
            </option>

            ${campaigns
                .map(campaign => {
                    return `
                        <option value="${campaign.id}">
                            ${escapeHtml(campaign.name)}
                        </option>
                    `;
                })
                .join("")}
        `;
    }
}


// =====================================================
// CARGAR REDES SOCIALES
// =====================================================

async function loadSocialNetworksFromApi() {
    const response =
        await window.TecnoSulaApi
            .redesSociales
            .obtenerTodas();

    const apiNetworks =
        getResponseArray(response);

    socialNetworks =
        apiNetworks
            .map(network => ({
                id:
                    Number(
                        network.idRedSocial ??
                        network.IdRedSocial
                    ),

                name:
                    String(
                        network.nombre ??
                        network.Nombre ??
                        ""
                    ).trim()
            }))
            .filter(network => {
                return (
                    Number.isFinite(
                        network.id
                    ) &&
                    network.id > 0 &&
                    network.name
                );
            });

    platformOptions.forEach(button => {
        const network =
            socialNetworks.find(item => {
                return (
                    normalizeText(
                        item.name
                    ) ===
                    normalizeText(
                        button.dataset.platform
                    )
                );
            });

        button.dataset.redSocialId =
            network
                ? String(network.id)
                : "";

        button.disabled =
            !network;
    });

    if (platformFilter) {
        platformFilter.innerHTML = `
            <option value="todas">
                Todas las plataformas
            </option>

            ${socialNetworks
                .map(network => {
                    return `
                        <option
                            value="${network.id}"
                        >
                            ${escapeHtml(
                                network.name
                            )}
                        </option>
                    `;
                })
                .join("")}
        `;
    }
}


// =====================================================
// CARGAR PUBLICACIONES
// =====================================================

async function loadPublicationsFromApi() {
    const response =
        await window.TecnoSulaApi
            .publicaciones
            .obtenerTodas();

    const apiPublications =
        getResponseArray(
            response,
            "publicaciones"
        );

    publications =
        apiPublications
            .map(mapApiPublication)
            .filter(publication => {
                return (
                    Number.isFinite(
                        publication.id
                    ) &&
                    publication.id > 0
                );
            });

    refreshModule();
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

    if (!container) {
        return;
    }

    const icon =
        type === "success"
            ? "circle-check-big"
            : type === "error"
                ? "circle-alert"
                : "info";

    const toast =
        document.createElement("div");

    toast.className =
        `publication-toast ${type}`;

    toast.innerHTML = `
        <div class="publication-toast-icon">
            <i data-lucide="${icon}"></i>
        </div>

        <div class="publication-toast-content">
            <strong>
                ${escapeHtml(title)}
            </strong>

            <span>
                ${escapeHtml(message)}
            </span>
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
        }, 230);
    }, 4200);
}

   // =====================================================
// MODAL GENERAL PARA ACCIONES DE PUBLICACIONES
// =====================================================

function ensurePublicationToolsModal() {
    if (
        document.getElementById(
            "publicationToolsModal"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "publicationToolsModalStyles";

    style.textContent = `
        .publication-tools-modal {
            position: fixed;
            inset: 0;
            z-index: 140000;
            display: grid;
            place-items: center;
            padding: 20px;
            background: rgba(1, 8, 18, 0.78);
            backdrop-filter: blur(12px);
            opacity: 0;
            visibility: hidden;
            transition:
                opacity 200ms ease,
                visibility 200ms ease;
        }

        .publication-tools-modal[hidden] {
            display: none;
        }

        .publication-tools-modal.show {
            opacity: 1;
            visibility: visible;
        }

        .publication-tools-dialog {
            position: relative;
            width: min(
                610px,
                calc(100vw - 32px)
            );
            max-height: calc(100vh - 40px);
            overflow-y: auto;
            border: 1px solid
                rgba(122, 174, 255, 0.18);
            border-radius: 23px;
            background:
                radial-gradient(
                    circle at top right,
                    rgba(37, 99, 235, 0.13),
                    transparent 35%
                ),
                linear-gradient(
                    145deg,
                    rgba(14, 35, 62, 0.99),
                    rgba(4, 16, 31, 0.99)
                );
            box-shadow:
                0 34px 90px
                    rgba(0, 0, 0, 0.58),
                inset 0 1px
                    rgba(255, 255, 255, 0.05);
            color: #dbe9fa;
            opacity: 0;
            transform:
                translateY(18px)
                scale(0.98);
            transition:
                opacity 200ms ease,
                transform 200ms ease;
        }

        .publication-tools-modal.show
        .publication-tools-dialog {
            opacity: 1;
            transform:
                translateY(0)
                scale(1);
        }

        .publication-tools-close {
            position: absolute;
            top: 17px;
            right: 17px;
            display: grid;
            width: 38px;
            height: 38px;
            place-items: center;
            border: 1px solid
                rgba(148, 190, 255, 0.14);
            border-radius: 12px;
            background:
                rgba(255, 255, 255, 0.035);
            color: #8ba2bc;
            cursor: pointer;
            transition: 180ms ease;
        }

        .publication-tools-close:hover {
            background:
                rgba(255, 255, 255, 0.08);
            color: #ffffff;
        }

        .publication-tools-close svg {
            width: 18px;
            height: 18px;
        }

        .publication-tools-header {
            display: flex;
            gap: 16px;
            padding:
                27px 65px
                19px 25px;
            border-bottom: 1px solid
                rgba(148, 190, 255, 0.11);
        }

        .publication-tools-icon {
            display: grid;
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            place-items: center;
            border-radius: 15px;
            background:
                rgba(37, 99, 235, 0.14);
            color: #8fc5ff;
        }

        .publication-tools-icon.danger {
            background:
                rgba(244, 63, 94, 0.11);
            color: #fda4af;
        }

        .publication-tools-icon.warning {
            background:
                rgba(245, 158, 11, 0.11);
            color: #fcd38d;
        }

        .publication-tools-icon.success {
            background:
                rgba(34, 197, 94, 0.11);
            color: #78edba;
        }

        .publication-tools-icon svg {
            width: 22px;
            height: 22px;
        }

        .publication-tools-heading {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .publication-tools-eyebrow {
            color: #639ce3;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }

        .publication-tools-heading h2 {
            margin: 0;
            color: #f7fbff;
            font-size: 19px;
            line-height: 1.3;
        }

        .publication-tools-heading p {
            margin: 0;
            color: #8094ad;
            font-size: 11px;
            line-height: 1.65;
        }

        .publication-tools-body {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 22px 25px;
        }

        .publication-tools-grid {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .publication-tools-information {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 14px;
            border: 1px solid
                rgba(148, 190, 255, 0.1);
            border-radius: 14px;
            background:
                rgba(255, 255, 255, 0.025);
        }

        .publication-tools-information small {
            color: #627992;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .publication-tools-information strong {
            color: #e9f3ff;
            font-size: 11px;
            line-height: 1.5;
        }

        .publication-tools-description {
            margin: 0;
            padding: 15px;
            border-left: 3px solid
                rgba(59, 130, 246, 0.7);
            border-radius: 4px 13px 13px 4px;
            background:
                rgba(37, 99, 235, 0.07);
            color: #a8bad0;
            font-size: 11px;
            line-height: 1.75;
            white-space: pre-wrap;
        }

        .publication-tools-platforms {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
        }

        .publication-tools-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .publication-tools-field label {
            color: #aabdd2;
            font-size: 10px;
            font-weight: 700;
        }

        .publication-tools-input {
            width: 100%;
            min-height: 45px;
            padding: 0 14px;
            border: 1px solid
                rgba(148, 190, 255, 0.16);
            border-radius: 13px;
            outline: none;
            background:
                rgba(2, 12, 25, 0.7);
            color: #f1f7ff;
            font: inherit;
            font-size: 11px;
            transition:
                border-color 180ms ease,
                box-shadow 180ms ease;
        }

        .publication-tools-input:focus {
            border-color:
                rgba(96, 165, 250, 0.65);
            box-shadow:
                0 0 0 4px
                rgba(37, 99, 235, 0.11);
        }

        .publication-tools-date-grid {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .publication-tools-message {
            display: none;
            padding: 11px 13px;
            border-radius: 12px;
            font-size: 10px;
            line-height: 1.55;
        }

        .publication-tools-message.error {
            display: block;
            border: 1px solid
                rgba(244, 63, 94, 0.18);
            background:
                rgba(244, 63, 94, 0.08);
            color: #fda4af;
        }

        .publication-tools-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 17px 25px 23px;
            border-top: 1px solid
                rgba(148, 190, 255, 0.1);
        }

        .publication-tools-button {
            display: inline-flex;
            min-height: 41px;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0 17px;
            border: 0;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
            transition:
                transform 170ms ease,
                filter 170ms ease,
                background 170ms ease;
        }

        .publication-tools-button:hover {
            transform: translateY(-1px);
        }

        .publication-tools-button:disabled {
            cursor: not-allowed;
            opacity: 0.65;
            transform: none;
        }

        .publication-tools-button.secondary {
            border: 1px solid
                rgba(148, 190, 255, 0.15);
            background:
                rgba(255, 255, 255, 0.035);
            color: #9eb1c7;
        }

        .publication-tools-button.primary {
            background:
                linear-gradient(
                    135deg,
                    #2563eb,
                    #3b82f6
                );
            color: #ffffff;
            box-shadow:
                0 10px 24px
                rgba(37, 99, 235, 0.23);
        }

        .publication-tools-button.danger {
            background:
                linear-gradient(
                    135deg,
                    #be123c,
                    #e11d48
                );
            color: #ffffff;
            box-shadow:
                0 10px 24px
                rgba(225, 29, 72, 0.2);
        }

        .publication-tools-button svg {
            width: 15px;
            height: 15px;
        }

        .publication-tools-loader {
            animation:
                publication-tools-spin
                800ms linear infinite;
        }

        @keyframes publication-tools-spin {
            to {
                transform: rotate(360deg);
            }
        }

        @media (max-width: 560px) {
            .publication-tools-grid,
            .publication-tools-date-grid {
                grid-template-columns: 1fr;
            }

            .publication-tools-actions {
                flex-direction: column-reverse;
            }

            .publication-tools-button {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(style);

    const modal =
        document.createElement("div");

    modal.id =
        "publicationToolsModal";

    modal.className =
        "publication-tools-modal";

    modal.hidden = true;

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    modal.innerHTML = `
        <section
            class="publication-tools-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="publicationToolsTitle"
        >
            <button
                class="publication-tools-close"
                type="button"
                data-tools-close
                aria-label="Cerrar"
            >
                <i data-lucide="x"></i>
            </button>

            <header class="publication-tools-header">

                <div
                    class="publication-tools-icon"
                    data-tools-icon-container
                >
                    <i
                        data-lucide="info"
                        data-tools-icon
                    ></i>
                </div>

                <div class="publication-tools-heading">

                    <span
                        class="publication-tools-eyebrow"
                        data-tools-eyebrow
                    >
                        Publicación
                    </span>

                    <h2
                        id="publicationToolsTitle"
                        data-tools-title
                    >
                        Información
                    </h2>

                    <p data-tools-description></p>

                </div>

            </header>

            <div
                class="publication-tools-body"
                data-tools-body
            ></div>

            <div
                class="publication-tools-message"
                data-tools-message
            ></div>

            <footer class="publication-tools-actions">

                <button
                    class="publication-tools-button secondary"
                    type="button"
                    data-tools-secondary
                >
                    Cerrar
                </button>

                <button
                    class="publication-tools-button primary"
                    type="button"
                    data-tools-primary
                >
                    Confirmar
                </button>

            </footer>

        </section>
    `;

    document.body.appendChild(modal);

    modal
        .querySelector("[data-tools-close]")
        ?.addEventListener(
            "click",
            closePublicationToolsModal
        );

    modal
        .querySelector("[data-tools-secondary]")
        ?.addEventListener(
            "click",
            closePublicationToolsModal
        );

    modal.addEventListener(
        "click",
        event => {
            if (event.target === modal) {
                closePublicationToolsModal();
            }
        }
    );

    renderIcons();
}


function getPublicationToolsElements() {
    ensurePublicationToolsModal();

    const modal =
        document.getElementById(
            "publicationToolsModal"
        );

    return {
        modal,

        iconContainer:
            modal.querySelector(
                "[data-tools-icon-container]"
            ),

        icon:
            modal.querySelector(
                "[data-tools-icon]"
            ),

        eyebrow:
            modal.querySelector(
                "[data-tools-eyebrow]"
            ),

        title:
            modal.querySelector(
                "[data-tools-title]"
            ),

        description:
            modal.querySelector(
                "[data-tools-description]"
            ),

        body:
            modal.querySelector(
                "[data-tools-body]"
            ),

        message:
            modal.querySelector(
                "[data-tools-message]"
            ),

        secondaryButton:
            modal.querySelector(
                "[data-tools-secondary]"
            ),

        primaryButton:
            modal.querySelector(
                "[data-tools-primary]"
            )
    };
}


function showPublicationToolsMessage(
    message = ""
) {
    const modal =
        document.getElementById(
            "publicationToolsModal"
        );

    const messageElement =
        modal?.querySelector(
            "[data-tools-message]"
        );

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message;

    messageElement.className =
        "publication-tools-message";

    if (message) {
        messageElement.classList.add(
            "error"
        );
    }
}


function closePublicationToolsModal() {
    const modal =
        document.getElementById(
            "publicationToolsModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    window.setTimeout(() => {
        modal.hidden = true;
        showPublicationToolsMessage("");
    }, 200);

    const anotherModalOpen =
        publicationModal &&
        publicationModal.hidden === false;

    document.body.style.overflow =
        anotherModalOpen ||
        sidebar?.classList.contains("open")
            ? "hidden"
            : "";
}


function openPublicationToolsModal({
    icon = "info",
    variant = "",
    eyebrow = "Publicación",
    title = "Información",
    description = "",
    content = "",
    primaryText = "",
    primaryIcon = "check",
    primaryVariant = "primary",
    secondaryText = "Cerrar",
    onConfirm = null
}) {
    const elements =
        getPublicationToolsElements();

    elements.iconContainer.className =
        `publication-tools-icon ${variant}`.trim();

    elements.icon.setAttribute(
        "data-lucide",
        icon
    );

    elements.eyebrow.textContent =
        eyebrow;

    elements.title.textContent =
        title;

    elements.description.textContent =
        description;

    elements.body.innerHTML =
        content;

    elements.secondaryButton.textContent =
        secondaryText;

    elements.primaryButton.onclick = null;

    showPublicationToolsMessage("");

    if (
        primaryText &&
        typeof onConfirm === "function"
    ) {
        elements.primaryButton.hidden =
            false;

        elements.primaryButton.className =
            `publication-tools-button ${primaryVariant}`;

        elements.primaryButton.innerHTML = `
            <i data-lucide="${primaryIcon}"></i>
            ${escapeHtml(primaryText)}
        `;

        elements.primaryButton.onclick =
            async () => {
                const originalContent =
                    elements
                        .primaryButton
                        .innerHTML;

                elements.primaryButton.disabled =
                    true;

                elements.primaryButton.innerHTML = `
                    <i
                        class="publication-tools-loader"
                        data-lucide="loader-circle"
                    ></i>
                    Procesando...
                `;

                renderIcons();

                try {
                    await onConfirm();
                } catch (error) {
                    console.error(
                        "Error en la acción:",
                        error
                    );

                    showPublicationToolsMessage(
                        error.message ||
                        "No fue posible completar la acción."
                    );
                } finally {
                    elements.primaryButton.disabled =
                        false;

                    elements.primaryButton.innerHTML =
                        originalContent;

                    renderIcons();
                }
            };
    } else {
        elements.primaryButton.hidden =
            true;
    }

    elements.modal.hidden = false;

    elements.modal.setAttribute(
        "aria-hidden",
        "false"
    );

    requestAnimationFrame(() => {
        elements.modal.classList.add(
            "show"
        );
    });

    document.body.style.overflow =
        "hidden";

    renderIcons();
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
            const normalizedStatus =
    normalizeText(publication.status);

const canEdit =
    normalizedStatus === "borrador" ||
    normalizedStatus === "programada";

const canSchedule =
    normalizedStatus !== "publicada";

const canCancel =
    normalizedStatus === "programada";

const scheduleTitle =
    normalizedStatus === "programada"
        ? "Reagendar publicación"
        : "Programar publicación";

        const platforms =
    getPublicationPlatforms(publication);

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
    platforms.join(",")
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

                       <div class="publication-platforms">
    ${renderPlatformBadges(
        platforms,
        "publication-platform"
    )}
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
        class="publication-action-button duplicate"
        type="button"
        title="Duplicar publicación"
        data-action="duplicate"
        data-publication-id="${
            publication.id
        }"
    >
        <i data-lucide="copy-plus"></i>
    </button>

    ${
        canEdit
            ? `
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
            `
            : ""
    }

    ${
        canSchedule
            ? `
                <button
                    class="publication-action-button schedule"
                    type="button"
                    title="${scheduleTitle}"
                    data-action="reschedule"
                    data-publication-id="${
                        publication.id
                    }"
                >
                    <i data-lucide="calendar-clock"></i>
                </button>
            `
            : ""
    }

    ${
        canCancel
            ? `
                <button
                    class="publication-action-button cancel-schedule"
                    type="button"
                    title="Cancelar programación"
                    data-action="cancel-schedule"
                    data-publication-id="${
                        publication.id
                    }"
                >
                    <i data-lucide="calendar-x-2"></i>
                </button>
            `
            : ""
    }

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
        normalizeText(
            publicationSearch?.value
        );

    const selectedCampaign =
        campaignFilter?.value || "todas";

    const selectedPlatform =
        platformFilter?.value || "todas";

    const selectedStatus =
        normalizeText(
            publicationStatusFilter?.value
        );

    const filteredPublications =
        publications.filter(publication => {
            const publicationPlatforms =
                getPublicationPlatforms(
                    publication
                );

            const searchableContent =
                normalizeText(
                    `${publication.title}
                     ${publication.description}
                     ${publication.campaign}
                     ${publicationPlatforms.join(" ")}`
                );

            const matchesSearch =
                !searchValue ||
                searchableContent.includes(
                    searchValue
                );

            const matchesCampaign =
                selectedCampaign === "todas" ||
                publication.campaignId ===
                    Number(selectedCampaign);

            const matchesPlatform =
                selectedPlatform === "todas" ||
                publication.socialNetworkIds
                    .includes(
                        Number(selectedPlatform)
                    );

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

    renderPublications(
        filteredPublications
    );
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
                    {
                        weekday: "long"
                    }
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
                const platforms =
                    getPublicationPlatforms(
                        publication
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

                            <div class="agenda-platforms">
                                ${renderPlatformBadges(
                                    platforms,
                                    "agenda-platform"
                                )}
                            </div>

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
                <strong>Sin programación</strong>
            </div>

            <div class="hero-calendar-icon">
                <i data-lucide="calendar-x"></i>
            </div>
        `;
    }

    if (content) {
        content.innerHTML = `
            <h3>
                No existen publicaciones programadas
            </h3>

            <p>
                Crea una publicación y selecciona una
                fecha futura para mostrarla aquí.
            </p>
        `;
    }

    if (footer) {
        footer.innerHTML = `
            <span>
                <i data-lucide="calendar-days"></i>
                Agenda disponible
            </span>

            <span class="publication-status draft">
                Sin contenido
            </span>
        `;
    }

    renderIcons();
    return;
}
        const nextPublicationPlatforms =
    getPublicationPlatforms(
        nextPublication
    );

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
               <div class="hero-platforms">
    ${renderPlatformBadges(
        nextPublicationPlatforms,
        "hero-platform"
    )}
</div>

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

   function setSelectedPlatforms(platforms = []) {
    const normalizedPlatforms =
        new Set(
            platforms.map(platform =>
                normalizeText(platform)
            )
        );

    const validSelectedPlatforms = [];

    platformOptions.forEach(button => {
        const platform =
            button.dataset.platform || "";

        const selected =
            normalizedPlatforms.has(
                normalizeText(platform)
            );

        button.classList.toggle(
            "selected",
            selected
        );

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

        if (selected) {
            validSelectedPlatforms.push(platform);
        }
    });

    if (publicationPlatform) {
        publicationPlatform.value =
            JSON.stringify(
                validSelectedPlatforms
            );
    }
}

function togglePlatform(platform) {
    const selectedPlatforms =
        readSelectedPlatforms();

    const normalizedPlatform =
        normalizeText(platform);

    const alreadySelected =
        selectedPlatforms.some(
            selectedPlatform =>
                normalizeText(
                    selectedPlatform
                ) === normalizedPlatform
        );

    const updatedPlatforms =
        alreadySelected
            ? selectedPlatforms.filter(
                  selectedPlatform =>
                      normalizeText(
                          selectedPlatform
                      ) !== normalizedPlatform
              )
            : [
                  ...selectedPlatforms,
                  platform
              ];

    setSelectedPlatforms(
        updatedPlatforms
    );

    clearFormMessage();
}

    // =====================================================
    // SELECCIÓN DE ESTADO
    // =====================================================

    function selectStatus(
    status,
    { clearSchedule = true } = {}
) {
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

    if (
        clearSchedule &&
        normalizedStatus === "borrador"
    ) {
        clearPublicationDateTime();
    }

    clearFormMessage();
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

    if (publicationCampaignSearch) {
        publicationCampaignSearch.value =
            "";
    }

    selectCampaign(
        null,
        false
    );

    closeCampaignSelector();

    setSelectedPlatforms([]);

    selectStatus(
        "Borrador",
        {
            clearSchedule: false
        }
    );

    clearPublicationDateTime();

    if (descriptionCounter) {
        descriptionCounter.textContent =
            "0";
    }

    resetMediaArea();
    clearFormMessage();
}


function openPublicationModal(
    mode = "create",
    publication = null
) {
    if (!publicationModal) {
        return;
    }

    resetPublicationForm();

    try {
        initializePublicationPickers();
    } catch (error) {
        console.error(
            "No se pudieron iniciar los selectores:",
            error
        );
    }

    if (
        mode === "edit" &&
        publication
    ) {
        editingPublicationId =
            publication.id;

        if (publicationModalTitle) {
            publicationModalTitle.textContent =
                "Editar publicación";
        }

        if (savePublicationButton) {
            savePublicationButton.innerHTML = `
                <i data-lucide="save"></i>
                Guardar cambios
            `;
        }

        selectCampaign(
            publication.campaignId,
            false
        );

        if (publicationTitle) {
            publicationTitle.value =
                publication.title || "";
        }

        if (publicationDescription) {
            publicationDescription.value =
                publication.description || "";
        }

        setSelectedPlatforms(
            getPublicationPlatforms(
                publication
            )
        );

        selectStatus(
            publication.status ||
            "Borrador",
            {
                clearSchedule: false
            }
        );

        setPublicationDateTime(
            publication.date || "",
            publication.time || ""
        );

        if (publication.mediaName) {
            showSelectedMedia(
                publication.mediaName
            );
        }

        if (descriptionCounter) {
            descriptionCounter.textContent =
                String(
                    publication.description
                        ?.length || 0
                );
        }
    } else {
        if (publicationModalTitle) {
            publicationModalTitle.textContent =
                "Nueva publicación";
        }

        if (savePublicationButton) {
            savePublicationButton.innerHTML = `
                <i data-lucide="save"></i>
                Guardar publicación
            `;
        }
    }

    publicationModal.hidden =
        false;

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
        publicationCampaignTrigger
            ?.focus();
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

   async function savePublication(event) {
    event.preventDefault();

    const campaignId =
        Number(
            publicationCampaign?.value
        );

    const title =
        publicationTitle?.value?.trim();

    const description =
        publicationDescription?.value?.trim();

    const selectedPlatforms =
        readSelectedPlatforms();

    const socialNetworkIds =
        readSelectedSocialNetworkIds();

    const status =
        publicationStatus?.value?.trim();

    const date =
        publicationDate?.value || "";

    const time =
        publicationTime?.value || "";

    if (
        !Number.isFinite(campaignId) ||
        campaignId <= 0 ||
        !title ||
        !description ||
        selectedPlatforms.length === 0 ||
        socialNetworkIds.length === 0 ||
        !status
    ) {
        showFormMessage(
            "Completa la campaña, el título, el contenido, selecciona al menos una red social y establece el estado.",
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

    let programmingDate = null;

    if (status === "Programada") {
        const selectedDateTime =
            new Date(
                `${date}T${time}:00`
            );

        if (
            Number.isNaN(
                selectedDateTime.getTime()
            ) ||
            selectedDateTime.getTime() <=
                Date.now()
        ) {
            showFormMessage(
                "Selecciona una fecha y una hora futuras para programar la publicación.",
                "error"
            );

            return;
        }

        programmingDate =
            `${date}T${time}:00`;
    }

    const isVideo =
        selectedMediaName
            .toLowerCase()
            .endsWith(".mp4");

    const publicationData = {
        titulo:
            title,

        descripcion:
            description,

        tipoMultimedia:
            selectedMediaName
                ? (
                    isVideo
                        ? "Video"
                        : "Imagen"
                )
                : null,

        /*
            Todavía no tenemos endpoint para subir
            el archivo físicamente. Guardamos una
            ruta demostrativa en la base de datos.
        */
        urlMultimedia:
            selectedMediaName
                ? `/uploads/publicaciones/${selectedMediaName}`
                : null,

        idCampana:
            campaignId,

        idsRedesSociales:
            socialNetworkIds,

        fechaProgramacion:
            programmingDate,

        estado:
            status
    };

    const originalButtonContent =
        savePublicationButton?.innerHTML;

    if (savePublicationButton) {
        savePublicationButton.disabled = true;

        savePublicationButton.innerHTML = `
            <i data-lucide="loader-circle"></i>
            Guardando...
        `;

        renderIcons();
    }

    clearFormMessage();
const wasEditing =
    Boolean(editingPublicationId);
    try {
        let response;

        if (editingPublicationId) {
            response =
                await window.TecnoSulaApi
                    .publicaciones
                    .actualizar(
                        editingPublicationId,
                        publicationData
                    );
        } else {
            response =
                await window.TecnoSulaApi
                    .publicaciones
                    .crear(
                        publicationData
                    );
        }

       await loadPublicationsFromApi();

window.TecnoSulaNotifications
    ?.registrarActividad({
        title:
            wasEditing
                ? "Publicación actualizada"
                : (
                    normalizeText(status) ===
                    "programada"
                        ? "Publicación programada"
                        : "Publicación creada"
                ),

        message:
            wasEditing
                ? `La publicación "${title}" fue actualizada correctamente.`
                : (
                    normalizeText(status) ===
                    "programada"
                        ? `La publicación "${title}" fue programada para ${formatDate(
                            date
                        )} a las ${formatTime(
                            time
                        )}.`
                        : `La publicación "${title}" fue creada como borrador.`
                ),

        type:
            "success",

        icon:
            wasEditing
                ? "file-pen-line"
                : (
                    normalizeText(status) ===
                    "programada"
                        ? "calendar-check"
                        : "circle-plus"
                ),

        category:
            "Publicaciones",

        categoryIcon:
            "send",

        link:
            "publicaciones.html",

        actionLabel:
            "Ver publicaciones"
    });

closePublicationModal();

      showToast(
    wasEditing
        ? "Publicación actualizada"
        : "Publicación creada",

            response?.mensaje ||
                (
                   wasEditing
    ? "Los cambios se guardaron correctamente."
    : "La publicación se registró correctamente."
                ),

            "success"
        );
    } catch (error) {
        console.error(
            "Error al guardar la publicación:",
            error
        );

        showFormMessage(
            error.message ||
                "No fue posible guardar la publicación.",
            "error"
        );
    } finally {
        if (savePublicationButton) {
            savePublicationButton.disabled =
                false;

            savePublicationButton.innerHTML =
                originalButtonContent || `
                    <i data-lucide="save"></i>
                    Guardar publicación
                `;

            renderIcons();
        }
    }
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

   // =====================================================
// VISTA PREVIA COMPLETA
// =====================================================

function previewPublication(publication) {
    const platforms =
        getPublicationPlatforms(
            publication
        );

    const programming =
        publication.date &&
        publication.time
            ? `${formatDate(
                  publication.date
              )}, ${formatTime(
                  publication.time
              )}`
            : "Sin programación";

    const mediaInformation =
        publication.mediaName ||
        publication.mediaUrl ||
        "Sin archivo multimedia";

    openPublicationToolsModal({
        icon:
            getMediaIcon(
                publication.mediaType
            ),

        variant:
            "success",

        eyebrow:
            "Vista previa",

        title:
            publication.title,

        description:
            `Contenido asociado a la campaña ${publication.campaign}.`,

        content: `
            <div class="publication-tools-platforms">
                ${renderPlatformBadges(
                    platforms,
                    "publication-platform"
                )}
            </div>

            <div class="publication-tools-grid">

                <div class="publication-tools-information">
                    <small>Estado</small>
                    <strong>
                        ${escapeHtml(
                            publication.status
                        )}
                    </strong>
                </div>

                <div class="publication-tools-information">
                    <small>Campaña</small>
                    <strong>
                        ${escapeHtml(
                            publication.campaign
                        )}
                    </strong>
                </div>

                <div class="publication-tools-information">
                    <small>Programación</small>
                    <strong>
                        ${escapeHtml(
                            programming
                        )}
                    </strong>
                </div>

                <div class="publication-tools-information">
                    <small>Multimedia</small>
                    <strong>
                        ${escapeHtml(
                            mediaInformation
                        )}
                    </strong>
                </div>

            </div>

            <p class="publication-tools-description">
                ${escapeHtml(
                    publication.description
                )}
            </p>
        `
    });
}


// =====================================================
// DUPLICAR PUBLICACIÓN
// =====================================================

function duplicatePublication(publication) {
    const defaultTitle =
        `Copia de ${publication.title}`
            .slice(0, 150);

    openPublicationToolsModal({
        icon:
            "copy-plus",

        eyebrow:
            "Duplicar contenido",

        title:
            "Crear una copia",

        description:
            "La copia se guardará como borrador y no conservará la programación anterior.",

        content: `
            <div class="publication-tools-field">

                <label for="duplicatePublicationTitle">
                    Título de la nueva publicación
                </label>

                <input
                    id="duplicatePublicationTitle"
                    class="publication-tools-input"
                    type="text"
                    maxlength="150"
                    value="${escapeHtml(
                        defaultTitle
                    )}"
                >

            </div>
        `,

        primaryText:
            "Duplicar publicación",

        primaryIcon:
            "copy-plus",

        onConfirm:
            async () => {
                const titleInput =
                    document.getElementById(
                        "duplicatePublicationTitle"
                    );

                const title =
                    titleInput?.value.trim();

                if (!title) {
                    throw new Error(
                        "Escribe un título para la publicación duplicada."
                    );
                }

                const response =
                    await window
                        .TecnoSulaApi
                        .publicaciones
                        .duplicar(
                            publication.id,
                            title
                        );

               await loadPublicationsFromApi();

window.TecnoSulaNotifications
    ?.registrarActividad({
        title:
            "Publicación duplicada",

        message:
            `Se creó "${title}" como una copia de "${publication.title}".`,

        type:
            "success",

        icon:
            "copy-plus",

        category:
            "Publicaciones",

        categoryIcon:
            "send",

        link:
            "publicaciones.html",

        actionLabel:
            "Ver publicaciones"
    });

closePublicationToolsModal();

                showToast(
                    "Publicación duplicada",
                    response?.mensaje ||
                        "La copia fue creada como borrador.",
                    "success"
                );
            }
    });

    window.setTimeout(() => {
        document
            .getElementById(
                "duplicatePublicationTitle"
            )
            ?.focus();
    }, 220);
}


// =====================================================
// PROGRAMAR O REAGENDAR
// =====================================================

function openReschedulePublication(
    publication
) {
    const now =
        new Date();

    const fallbackDate =
        new Date();

    fallbackDate.setDate(
        fallbackDate.getDate() + 1
    );

    fallbackDate.setHours(
        9,
        0,
        0,
        0
    );

    let initialDate =
        publication.date;

    let initialTime =
        publication.time;

    const currentProgramming =
        initialDate && initialTime
            ? new Date(
                  `${initialDate}T${initialTime}:00`
              )
            : null;

    if (
        !currentProgramming ||
        Number.isNaN(
            currentProgramming.getTime()
        ) ||
        currentProgramming <= now
    ) {
        const localFallback =
            new Date(
                fallbackDate.getTime() -
                fallbackDate
                    .getTimezoneOffset() *
                    60000
            );

        initialDate =
            localFallback
                .toISOString()
                .split("T")[0];

        initialTime =
            "09:00";
    }

    const todayLocal =
        new Date(
            now.getTime() -
            now.getTimezoneOffset() *
            60000
        )
            .toISOString()
            .split("T")[0];

    const isDraft =
        normalizeText(
            publication.status
        ) === "borrador";

    openPublicationToolsModal({
        icon:
            "calendar-clock",

        eyebrow:
            isDraft
                ? "Programar contenido"
                : "Modificar programación",

        title:
            isDraft
                ? "Programar publicación"
                : "Reagendar publicación",

        description:
            "Selecciona una fecha y una hora futuras para publicar el contenido.",

        content: `
            <div class="publication-tools-information">
                <small>Publicación</small>
                <strong>
                    ${escapeHtml(
                        publication.title
                    )}
                </strong>
            </div>

            <div class="publication-tools-date-grid">

                <div class="publication-tools-field">

                    <label for="reschedulePublicationDate">
                        Nueva fecha
                    </label>

                    <input
                        id="reschedulePublicationDate"
                        class="publication-tools-input"
                        type="date"
                        min="${todayLocal}"
                        value="${escapeHtml(
                            initialDate
                        )}"
                    >

                </div>

                <div class="publication-tools-field">

                    <label for="reschedulePublicationTime">
                        Nueva hora
                    </label>

                    <input
                        id="reschedulePublicationTime"
                        class="publication-tools-input"
                        type="time"
                        value="${escapeHtml(
                            initialTime
                        )}"
                    >

                </div>

            </div>
        `,

        primaryText:
            isDraft
                ? "Programar"
                : "Reagendar",

        primaryIcon:
            "calendar-check",

        onConfirm:
            async () => {
                const date =
                    document
                        .getElementById(
                            "reschedulePublicationDate"
                        )
                        ?.value;

                const time =
                    document
                        .getElementById(
                            "reschedulePublicationTime"
                        )
                        ?.value;

                if (!date || !time) {
                    throw new Error(
                        "Selecciona una fecha y una hora."
                    );
                }

                const selectedDate =
                    new Date(
                        `${date}T${time}:00`
                    );

                if (
                    Number.isNaN(
                        selectedDate.getTime()
                    ) ||
                    selectedDate <= new Date()
                ) {
                    throw new Error(
                        "La fecha de programación debe ser futura."
                    );
                }

                const dateTime =
                    `${date}T${time}:00`;

                let response;

                if (isDraft) {
                    response =
                        await window
                            .TecnoSulaApi
                            .publicaciones
                            .programar(
                                publication.id,
                                dateTime
                            );
                } else {
                    response =
                        await window
                            .TecnoSulaApi
                            .publicaciones
                            .reagendar(
                                publication.id,
                                dateTime
                            );
                }

                await loadPublicationsFromApi();

window.TecnoSulaNotifications
    ?.registrarActividad({
        title:
            isCurrentlyScheduled
                ? "Publicación reagendada"
                : "Publicación programada",

        message:
            `La publicación "${publication.title}" fue ${
                isCurrentlyScheduled
                    ? "reagendada"
                    : "programada"
            } para ${formatDate(
                date
            )} a las ${formatTime(
                time
            )}.`,

        type:
            "success",

        icon:
            isCurrentlyScheduled
                ? "calendar-sync"
                : "calendar-check",

        category:
            "Publicaciones",

        categoryIcon:
            "calendar-clock",

        link:
            "publicaciones.html",

        actionLabel:
            "Ver agenda"
    });

closePublicationToolsModal();

                showToast(
                    isDraft
                        ? "Publicación programada"
                        : "Publicación reagendada",

                    response?.mensaje ||
                        "La programación fue actualizada correctamente.",

                    "success"
                );
            }
    });
}


// =====================================================
// CANCELAR PROGRAMACIÓN
// =====================================================

function cancelScheduledPublication(
    publication
) {
    openPublicationToolsModal({
        icon:
            "calendar-x-2",

        variant:
            "warning",

        eyebrow:
            "Cancelar programación",

        title:
            "¿Cancelar esta publicación?",

        description:
            "El contenido no será eliminado. Su estado cambiará a Cancelada.",

        content: `
            <div class="publication-tools-information">
                <small>Publicación</small>
                <strong>
                    ${escapeHtml(
                        publication.title
                    )}
                </strong>
            </div>

            <div class="publication-tools-information">
                <small>Programación actual</small>
                <strong>
                    ${escapeHtml(
                        `${formatDate(
                            publication.date
                        )}, ${formatTime(
                            publication.time
                        )}`
                    )}
                </strong>
            </div>
        `,

        primaryText:
            "Cancelar programación",

        primaryIcon:
            "calendar-x-2",

        primaryVariant:
            "danger",

        onConfirm:
            async () => {
                const response =
                    await window
                        .TecnoSulaApi
                        .publicaciones
                        .cancelar(
                            publication.id
                        );

                await loadPublicationsFromApi();

window.TecnoSulaNotifications
    ?.registrarActividad({
        title:
            "Programación cancelada",

        message:
            `Se canceló la programación de "${publication.title}".`,

        type:
            "warning",

        icon:
            "calendar-x-2",

        category:
            "Publicaciones",

        categoryIcon:
            "calendar-clock",

        link:
            "publicaciones.html",

        actionLabel:
            "Ver publicaciones"
    });

closePublicationToolsModal();

                showToast(
                    "Programación cancelada",
                    response?.mensaje ||
                        "La publicación fue cancelada correctamente.",
                    "success"
                );
            }
    });
}


// =====================================================
// ELIMINAR PUBLICACIÓN
// =====================================================

function deletePublication(publication) {
    openPublicationToolsModal({
        icon:
            "trash-2",

        variant:
            "danger",

        eyebrow:
            "Eliminar contenido",

        title:
            "¿Eliminar publicación?",

        description:
            "Esta acción eliminará definitivamente la publicación y sus relaciones con redes sociales.",

        content: `
            <div class="publication-tools-information">
                <small>Publicación seleccionada</small>
                <strong>
                    ${escapeHtml(
                        publication.title
                    )}
                </strong>
            </div>

            <p class="publication-tools-description">
                Esta operación no se puede deshacer.
            </p>
        `,

        primaryText:
            "Eliminar definitivamente",

        primaryIcon:
            "trash-2",

        primaryVariant:
            "danger",

        onConfirm:
            async () => {
                const response =
                    await window
                        .TecnoSulaApi
                        .publicaciones
                        .eliminar(
                            publication.id
                        );

              await loadPublicationsFromApi();

window.TecnoSulaNotifications
    ?.registrarActividad({
        title:
            "Publicación eliminada",

        message:
            `La publicación "${publication.title}" fue eliminada definitivamente.`,

        type:
            "urgent",

        icon:
            "trash-2",

        category:
            "Publicaciones",

        categoryIcon:
            "send",

        link:
            "publicaciones.html",

        actionLabel:
            "Ver publicaciones"
    });

closePublicationToolsModal();

                showToast(
                    "Publicación eliminada",
                    response?.mensaje ||
                        "La publicación fue eliminada correctamente.",
                    "success"
                );
            }
    });
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
        showToast(
            "Publicación no encontrada",
            "No fue posible localizar el contenido seleccionado.",
            "error"
        );

        return;
    }

    const action =
        button.dataset.action;

    switch (action) {
        case "preview":
            previewPublication(
                publication
            );
            break;

        case "duplicate":
            duplicatePublication(
                publication
            );
            break;

        case "edit":
            openPublicationModal(
                "edit",
                publication
            );
            break;

        case "reschedule":
            openReschedulePublication(
                publication
            );
            break;

        case "cancel-schedule":
            cancelScheduledPublication(
                publication
            );
            break;

        case "delete":
            deletePublication(
                publication
            );
            break;
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
    publicationCampaignTrigger
    ?.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            toggleCampaignSelector();
        }
    );

publicationCampaignSearch
    ?.addEventListener(
        "input",
        () => {
            renderCampaignSelectorOptions(
                publicationCampaignSearch
                    .value
            );
        }
    );

publicationCampaignOptions
    ?.addEventListener(
        "click",
        event => {
            const option =
                event.target.closest(
                    "[data-campaign-id]"
                );

            if (!option) {
                return;
            }

            selectCampaign(
                Number(
                    option.dataset
                        .campaignId
                )
            );
        }
    );

document.addEventListener(
    "click",
    event => {
        if (
            publicationCampaignSelector &&
            !publicationCampaignSelector
                .contains(event.target)
        ) {
            closeCampaignSelector();
        }
    }
);

publicationDate?.addEventListener(
    "change",
    updateDatePickerDisplay
);

publicationTime?.addEventListener(
    "change",
    updateTimePickerDisplay
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
            togglePlatform(
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
    publicationCampaignSelector
        ?.classList.contains("open")
) {
    closeCampaignSelector();
    return;
}

        const publicationToolsModal =
            document.getElementById(
                "publicationToolsModal"
            );

        if (
            publicationToolsModal &&
            publicationToolsModal.hidden ===
                false
        ) {
            closePublicationToolsModal();
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

 async function initializePublicationModule() {
    setUserInformation();

    initializePublicationPickers();

    updateDatePickerDisplay();
    updateTimePickerDisplay();

    selectStatus(
        "Borrador",
        {
            clearSchedule: false
        }
    );
    renderPublicationsLoading();

    if (!window.TecnoSulaApi) {
        showToast(
            "API no disponible",
            "No se encontró la configuración de api.js.",
            "error"
        );

        return;
    }

    try {
        await Promise.all([
            loadCampaignsFromApi(),
            loadSocialNetworksFromApi()
        ]); initializeCustomFilters();

        await loadPublicationsFromApi();
updateDatePickerDisplay();
updateTimePickerDisplay();
        renderIcons();
    } catch (error) {
        console.error(
            "No fue posible iniciar el módulo:",
            error
        );

        if (error.status === 401) {
            localStorage.removeItem("token");

            showToast(
                "Sesión vencida",
                "Debes iniciar sesión nuevamente.",
                "error"
            );

            window.setTimeout(() => {
                window.location.href =
                    "index.html";
            }, 1600);

            return;
        }

        renderPublications([]);

        showToast(
            "No se pudieron cargar los datos",
            error.message ||
                "Verifica que el backend esté ejecutándose.",
            "error"
        );
    }
}

initializePublicationModule();
});