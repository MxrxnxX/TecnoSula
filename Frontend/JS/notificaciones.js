(() => {
    "use strict";

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const STORAGE_KEY =
        "tecnosulaNotifications";

    const MAX_NOTIFICATIONS = 50;

    // =====================================================
    // CREAR IDENTIFICADOR
    // =====================================================

    function createIdentifier() {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return crypto.randomUUID();
        }

        return (
            `notification-${Date.now()}-` +
            Math.random()
                .toString(16)
                .slice(2)
        );
    }

    // =====================================================
    // NOTIFICACIONES INICIALES
    // =====================================================

    function createDefaultNotifications() {
        const now = Date.now();

        return [
            {
                id: "notification-1",

                title:
                    "Lanzamiento digital",

                message:
                    "La campaña finalizará dentro de tres días. Revisa las tareas pendientes.",

                type: "urgent",

                icon:
                    "calendar-clock",

                category:
                    "Campaña",

                categoryIcon:
                    "radio-tower",

                actionLabel:
                    "Revisar",

                link:
                    "campanas.html",

                createdAt:
                    new Date(
                        now - 10 * 60 * 1000
                    ).toISOString(),

                read: false
            },

            {
                id: "notification-2",

                title:
                    "Fidelización de clientes",

                message:
                    "La campaña cambió al estado pausada y puede requerir seguimiento.",

                type:
                    "warning",

                icon:
                    "circle-pause",

                category:
                    "Cambio de estado",

                categoryIcon:
                    "activity",

                actionLabel:
                    "Ver campaña",

                link:
                    "campanas.html",

                createdAt:
                    new Date(
                        now - 2 * 60 * 60 * 1000
                    ).toISOString(),

                read: false
            },

            {
                id: "notification-3",

                title:
                    "Nueva campaña asignada",

                message:
                    "Has sido asignado como responsable de una nueva campaña.",

                type:
                    "information",

                icon:
                    "user-check",

                category:
                    "Asignación",

                categoryIcon:
                    "user-round",

                actionLabel:
                    "Consultar",

                link:
                    "campanas.html",

                createdAt:
                    new Date(
                        now - 24 * 60 * 60 * 1000
                    ).toISOString(),

                read: false
            }
        ];
    }

    // =====================================================
    // NORMALIZAR NOTIFICACIÓN
    // =====================================================

    function normalizeNotification(
        notification
    ) {
        const allowedTypes = [
            "urgent",
            "warning",
            "information",
            "success"
        ];

        const receivedType =
            String(
                notification?.type ??
                notification?.tipo ??
                ""
            ).toLowerCase();

        return {
            id:
                String(
                    notification?.id || ""
                ).trim() ||
                createIdentifier(),

            title:
                String(
                    notification?.title ??
                    notification?.titulo ??
                    "Notificación"
                ).trim(),

            message:
                String(
                    notification?.message ??
                    notification?.mensaje ??
                    ""
                ).trim(),

            type:
                allowedTypes.includes(
                    receivedType
                )
                    ? receivedType
                    : "information",

            icon:
                String(
                    notification?.icon ??
                    notification?.icono ??
                    "bell"
                ).trim() ||
                "bell",

            category:
                String(
                    notification?.category ??
                    notification?.categoria ??
                    "Sistema"
                ).trim() ||
                "Sistema",

            categoryIcon:
                String(
                    notification?.categoryIcon ??
                    notification?.iconoCategoria ??
                    "activity"
                ).trim() ||
                "activity",

            actionLabel:
                String(
                    notification?.actionLabel ??
                    notification?.accion ??
                    "Consultar"
                ).trim() ||
                "Consultar",

            link:
                String(
                    notification?.link ??
                    notification?.enlace ??
                    ""
                ).trim(),

            createdAt:
                notification?.createdAt ??
                notification?.fechaCreacion ??
                new Date().toISOString(),

            read:
                Boolean(
                    notification?.read ??
                    notification?.leida ??
                    false
                )
        };
    }

    // =====================================================
    // CARGAR NOTIFICACIONES
    // =====================================================

    function loadNotifications() {
        const savedNotifications =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (savedNotifications === null) {
            const defaultNotifications =
                createDefaultNotifications();

            saveNotifications(
                defaultNotifications,
                false
            );

            return defaultNotifications;
        }

        try {
            const parsedNotifications =
                JSON.parse(
                    savedNotifications
                );

            if (
                !Array.isArray(
                    parsedNotifications
                )
            ) {
                return [];
            }

            return parsedNotifications.map(
                normalizeNotification
            );
        } catch (error) {
            console.error(
                "TecnoSula: no se pudieron cargar las notificaciones.",
                error
            );

            return [];
        }
    }

    // =====================================================
    // GUARDAR NOTIFICACIONES
    // =====================================================

    function saveNotifications(
        notifications,
        notifyCurrentPage = true
    ) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(notifications)
        );

        if (notifyCurrentPage) {
            window.dispatchEvent(
                new CustomEvent(
                    "tecnosula:notifications-changed"
                )
            );
        }
    }

    // =====================================================
    // AGREGAR NOTIFICACIÓN
    // =====================================================

    function addNotification(
        notificationData
    ) {
        const notifications =
            loadNotifications();

        const newNotification =
            normalizeNotification({
                ...notificationData,

                id:
                    createIdentifier(),

                createdAt:
                    new Date().toISOString(),

                read: false
            });

        notifications.unshift(
            newNotification
        );

        saveNotifications(
            notifications.slice(
                0,
                MAX_NOTIFICATIONS
            )
        );

        return newNotification;
    }

    // =====================================================
    // MARCAR UNA COMO LEÍDA
    // =====================================================

    function markNotificationAsRead(
        notificationId
    ) {
        const notifications =
            loadNotifications();

        const updatedNotifications =
            notifications.map(
                notification => {
                    if (
                        notification.id !==
                        notificationId
                    ) {
                        return notification;
                    }

                    return {
                        ...notification,
                        read: true
                    };
                }
            );

        saveNotifications(
            updatedNotifications
        );
    }

    // =====================================================
    // MARCAR TODAS COMO LEÍDAS
    // =====================================================

    function markAllNotificationsAsRead() {
        const notifications =
            loadNotifications();

        const updatedNotifications =
            notifications.map(
                notification => ({
                    ...notification,
                    read: true
                })
            );

        saveNotifications(
            updatedNotifications
        );
    }

    // =====================================================
    // LIMPIAR NOTIFICACIONES
    // =====================================================

    function clearNotifications() {
        saveNotifications([]);
    }

    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    // =====================================================
    // FORMATEAR TIEMPO
    // =====================================================

    function formatRelativeTime(
        dateValue
    ) {
        const date =
            new Date(dateValue);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Hace un momento";
        }

        const elapsedMilliseconds =
            Date.now() - date.getTime();

        const elapsedMinutes =
            Math.max(
                0,
                Math.floor(
                    elapsedMilliseconds /
                    (1000 * 60)
                )
            );

        if (elapsedMinutes < 1) {
            return "Hace un momento";
        }

        if (elapsedMinutes < 60) {
            return (
                `Hace ${elapsedMinutes} min`
            );
        }

        const elapsedHours =
            Math.floor(
                elapsedMinutes / 60
            );

        if (elapsedHours < 24) {
            return elapsedHours === 1
                ? "Hace 1 hora"
                : `Hace ${elapsedHours} horas`;
        }

        if (elapsedHours < 48) {
            return "Ayer";
        }

        return new Intl.DateTimeFormat(
            "es-CR",
            {
                day: "2-digit",
                month: "short"
            }
        ).format(date);
    }

    // =====================================================
    // CREAR HTML DE LA NOTIFICACIÓN
    // =====================================================

    function getNotificationHtml(
        notification
    ) {
        const unreadClass =
            notification.read
                ? ""
                : "unread";

        const unreadIndicator =
            notification.read
                ? ""
                : `
                    <span
                        class="unread-indicator"
                        aria-hidden="true"
                    ></span>
                `;

        const actionButton =
            notification.link
                ? `
                    <button
                        class="notification-action"
                        type="button"
                        data-notification-link="${escapeHtml(
                            notification.link
                        )}"
                    >
                        ${escapeHtml(
                            notification.actionLabel
                        )}

                        <i data-lucide="arrow-up-right"></i>
                    </button>
                `
                : "";

        return `
            <article
                class="notification-item ${unreadClass}"
                data-notification-id="${escapeHtml(
                    notification.id
                )}"
            >

                <div
                    class="notification-item-icon ${escapeHtml(
                        notification.type
                    )}"
                >
                    <i
                        data-lucide="${escapeHtml(
                            notification.icon
                        )}"
                    ></i>
                </div>

                <div class="notification-item-content">

                    <div class="notification-item-heading">

                        <strong>
                            ${escapeHtml(
                                notification.title
                            )}
                        </strong>

                        <span class="notification-time">
                            ${escapeHtml(
                                formatRelativeTime(
                                    notification.createdAt
                                )
                            )}
                        </span>

                    </div>

                    <p>
                        ${escapeHtml(
                            notification.message
                        )}
                    </p>

                    <div class="notification-meta">

                        <span class="notification-category">

                            <i
                                data-lucide="${escapeHtml(
                                    notification.categoryIcon
                                )}"
                            ></i>

                            ${escapeHtml(
                                notification.category
                            )}

                        </span>

                        ${actionButton}

                    </div>

                </div>

                ${unreadIndicator}

            </article>
        `;
    }

    // =====================================================
    // ICONOS
    // =====================================================

    function renderIcons() {
        if (
            typeof lucide !== "undefined" &&
            typeof lucide.createIcons ===
                "function"
        ) {
            lucide.createIcons();
        }
    }

    // =====================================================
    // OBTENER ELEMENTOS
    // =====================================================

    function getWrapperElements(
        wrapper
    ) {
        return {
            notificationButton:
                wrapper.querySelector(
                    ".notification-button"
                ),

            notificationsPanel:
                wrapper.querySelector(
                    ".notifications-panel"
                ),

            closeNotificationsButton:
                wrapper.querySelector(
                    ".close-notifications-button"
                ),

            markNotificationsRead:
                wrapper.querySelector(
                    ".mark-read-button"
                ),

            notificationsList:
                wrapper.querySelector(
                    ".notifications-list"
                ),

            notificationsEmpty:
                wrapper.querySelector(
                    ".notifications-empty"
                ),

            clearNotificationsButton:
                wrapper.querySelector(
                    "#clearNotificationsButton"
                ),

            notificationPoint:
                wrapper.querySelector(
                    ".notification-point"
                ),

            notificationCount:
                wrapper.querySelector(
                    ".notification-count"
                ),

            unreadNotificationsText:
                wrapper.querySelector(
                    "#unreadNotificationsText"
                ),

            notificationsOverlay:
                document.getElementById(
                    "notificationsOverlay"
                )
        };
    }

    // =====================================================
    // ACTUALIZAR INTERFAZ
    // =====================================================

    function updateWrapperInterface(
        wrapper,
        notifications
    ) {
        const elements =
            getWrapperElements(wrapper);

        const unreadCount =
            notifications.filter(
                notification =>
                    !notification.read
            ).length;

        const hasNotifications =
            notifications.length > 0;

        if (elements.notificationsList) {
            elements.notificationsList
                .innerHTML =
                    notifications
                        .map(
                            getNotificationHtml
                        )
                        .join("");

            elements.notificationsList
                .style.display =
                    hasNotifications
                        ? "block"
                        : "none";
        }

        elements.notificationsEmpty
            ?.classList.toggle(
                "show",
                !hasNotifications
            );

        if (elements.notificationCount) {
            elements.notificationCount
                .textContent =
                    unreadCount > 99
                        ? "99+"
                        : String(
                            unreadCount
                        );

            elements.notificationCount
                .classList.toggle(
                    "hidden",
                    unreadCount === 0
                );

            elements.notificationCount
                .setAttribute(
                    "aria-label",
                    `${unreadCount} notificaciones sin leer`
                );
        }

        elements.notificationPoint
            ?.classList.toggle(
                "hidden",
                unreadCount === 0
            );

        if (
            elements.unreadNotificationsText
        ) {
            if (unreadCount === 0) {
                elements
                    .unreadNotificationsText
                    .textContent =
                        "No hay notificaciones sin leer";
            } else if (
                unreadCount === 1
            ) {
                elements
                    .unreadNotificationsText
                    .textContent =
                        "1 notificación sin leer";
            } else {
                elements
                    .unreadNotificationsText
                    .textContent =
                        `${unreadCount} notificaciones sin leer`;
            }
        }

        if (
            elements.markNotificationsRead
        ) {
            elements.markNotificationsRead
                .disabled =
                    unreadCount === 0;
        }

        if (
            elements.clearNotificationsButton
        ) {
            elements
                .clearNotificationsButton
                .disabled =
                    !hasNotifications;
        }
    }

    // =====================================================
    // RENDERIZAR TODOS LOS CENTROS
    // =====================================================

    function renderAllNotificationCenters() {
        const notifications =
            loadNotifications();

        document
            .querySelectorAll(
                ".notifications-wrapper"
            )
            .forEach(wrapper => {
                updateWrapperInterface(
                    wrapper,
                    notifications
                );
            });

        renderIcons();
    }

    // =====================================================
    // INICIALIZAR CADA CENTRO
    // =====================================================

    function initializeWrapper(wrapper) {
        if (
            wrapper.dataset
                .notificationsReady ===
            "true"
        ) {
            return;
        }

        const elements =
            getWrapperElements(wrapper);

        if (
            !elements.notificationButton ||
            !elements.notificationsPanel
        ) {
            return;
        }

        wrapper.dataset
            .notificationsReady =
                "true";

        function openPanel() {
            elements.notificationsPanel
                .classList.add("show");

            elements.notificationButton
                .setAttribute(
                    "aria-expanded",
                    "true"
                );

            elements.notificationsPanel
                .setAttribute(
                    "aria-hidden",
                    "false"
                );

            if (
                window.innerWidth <= 980
            ) {
                elements.notificationsOverlay
                    ?.classList.add("show");

                document.body.style
                    .overflow = "hidden";
            }
        }

        function closePanel() {
            elements.notificationsPanel
                .classList.remove("show");

            elements.notificationsOverlay
                ?.classList.remove("show");

            elements.notificationButton
                .setAttribute(
                    "aria-expanded",
                    "false"
                );

            elements.notificationsPanel
                .setAttribute(
                    "aria-hidden",
                    "true"
                );

            document.body.style
                .overflow = "";
        }

        function togglePanel() {
            if (
                elements.notificationsPanel
                    .classList.contains(
                        "show"
                    )
            ) {
                closePanel();
            } else {
                openPanel();
            }
        }

        elements.notificationButton
            .addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    togglePanel();
                }
            );

        elements.notificationsPanel
            .addEventListener(
                "click",
                event => {
                    event.stopPropagation();
                }
            );

        elements.closeNotificationsButton
            ?.addEventListener(
                "click",
                event => {
                    event.preventDefault();

                    closePanel();
                }
            );

        elements.notificationsOverlay
            ?.addEventListener(
                "click",
                closePanel
            );

        elements.markNotificationsRead
            ?.addEventListener(
                "click",
                event => {
                    event.preventDefault();

                    markAllNotificationsAsRead();
                }
            );

        elements.clearNotificationsButton
            ?.addEventListener(
                "click",
                event => {
                    event.preventDefault();

                    clearNotifications();
                }
            );

        elements.notificationsList
            ?.addEventListener(
                "click",
                event => {
                    const notificationItem =
                        event.target.closest(
                            ".notification-item"
                        );

                    if (!notificationItem) {
                        return;
                    }

                    const notificationId =
                        notificationItem
                            .dataset
                            .notificationId;

                    if (notificationId) {
                        markNotificationAsRead(
                            notificationId
                        );
                    }

                    const actionButton =
                        event.target.closest(
                            "[data-notification-link]"
                        );

                    const destination =
                        actionButton?.dataset
                            .notificationLink;

                    if (destination) {
                        window.location.href =
                            destination;
                    }
                }
            );

        document.addEventListener(
            "click",
            event => {
                if (
                    elements.notificationsPanel
                        .classList.contains(
                            "show"
                        ) &&
                    !wrapper.contains(
                        event.target
                    )
                ) {
                    closePanel();
                }
            }
        );

        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key === "Escape"
                ) {
                    closePanel();
                }
            }
        );

        window.addEventListener(
            "resize",
            () => {
                if (
                    !elements.notificationsPanel
                        .classList.contains(
                            "show"
                        )
                ) {
                    return;
                }

                const smallScreen =
                    window.innerWidth <=
                    980;

                elements.notificationsOverlay
                    ?.classList.toggle(
                        "show",
                        smallScreen
                    );

                document.body.style
                    .overflow =
                        smallScreen
                            ? "hidden"
                            : "";
            }
        );
    }

    // =====================================================
    // INICIAR CENTRO DE NOTIFICACIONES
    // =====================================================

    function initializeNotificationCenter() {
        document
            .querySelectorAll(
                ".notifications-wrapper"
            )
            .forEach(
                initializeWrapper
            );

        renderAllNotificationCenters();
    }

    // =====================================================
    // FUNCIONES DISPONIBLES PARA OTROS ARCHIVOS
    // =====================================================

    window.TecnoSulaNotifications = {
        add:
            addNotification,

        agregar:
            addNotification,

        list:
            loadNotifications,

        listar:
            loadNotifications,

        markAllAsRead:
            markAllNotificationsAsRead,

        marcarTodasComoLeidas:
            markAllNotificationsAsRead,

        clear:
            clearNotifications,

        limpiar:
            clearNotifications
    };

    // =====================================================
    // ACTUALIZAR EN LA MISMA PÁGINA
    // =====================================================

    window.addEventListener(
        "tecnosula:notifications-changed",
        renderAllNotificationCenters
    );

    // =====================================================
    // ACTUALIZAR ENTRE PESTAÑAS
    // =====================================================

    window.addEventListener(
        "storage",
        event => {
            if (
                event.key ===
                STORAGE_KEY
            ) {
                renderAllNotificationCenters();
            }
        }
    );

    // =====================================================
    // INICIAR
    // =====================================================

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeNotificationCenter
        );
    } else {
        initializeNotificationCenter();
    }
})();