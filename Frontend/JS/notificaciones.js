(() => {
    "use strict";

    const STORAGE_KEY = "tecnosulaNotificationsState";

    function iniciarCentroNotificaciones() {
        const wrappers = document.querySelectorAll(
            ".notifications-wrapper"
        );

        if (wrappers.length === 0) {
            console.error(
                "TecnoSula: no existe .notifications-wrapper en esta página."
            );
            return;
        }

        wrappers.forEach(wrapper => {
            inicializarWrapper(wrapper);
        });

        renderizarIconos();
    }

    function inicializarWrapper(wrapper) {
        /*
         * Evita agregar dos veces los mismos eventos,
         * pero no bloquea otras páginas ni otros botones.
         */
        if (wrapper.dataset.notificationsReady === "true") {
            return;
        }

        const notificationButton =
            wrapper.querySelector(".notification-button");

        const notificationsPanel =
            wrapper.querySelector(".notifications-panel");

        const closeNotificationsButton =
            wrapper.querySelector(".close-notifications-button");

        const markNotificationsRead =
            wrapper.querySelector(".mark-read-button");

        const notificationsList =
            wrapper.querySelector(".notifications-list");

        const notificationsEmpty =
            wrapper.querySelector(".notifications-empty");

        const clearNotificationsButton =
            wrapper.querySelector("#clearNotificationsButton");

        const notificationPoint =
            wrapper.querySelector(".notification-point");

        const notificationCount =
            wrapper.querySelector(".notification-count");

        const unreadNotificationsText =
            wrapper.querySelector("#unreadNotificationsText");

        const notificationsOverlay =
            document.getElementById("notificationsOverlay");

        if (!notificationButton) {
            console.error(
                "TecnoSula: no se encontró .notification-button."
            );
            return;
        }

        if (!notificationsPanel) {
            console.error(
                "TecnoSula: no se encontró .notifications-panel."
            );
            return;
        }

        wrapper.dataset.notificationsReady = "true";

        let notificationState = cargarEstado();

        function obtenerNotificaciones() {
            return Array.from(
                wrapper.querySelectorAll(".notification-item")
            );
        }

        function abrirPanel() {
            notificationsPanel.classList.add("show");

            notificationButton.setAttribute(
                "aria-expanded",
                "true"
            );

            notificationsPanel.setAttribute(
                "aria-hidden",
                "false"
            );

            if (window.innerWidth <= 980) {
                notificationsOverlay?.classList.add("show");
                document.body.style.overflow = "hidden";
            }
        }

        function cerrarPanel() {
            notificationsPanel.classList.remove("show");

            notificationsOverlay?.classList.remove("show");

            notificationButton.setAttribute(
                "aria-expanded",
                "false"
            );

            notificationsPanel.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow = "";
        }

        function alternarPanel() {
            const estaAbierto =
                notificationsPanel.classList.contains("show");

            if (estaAbierto) {
                cerrarPanel();
            } else {
                abrirPanel();
            }
        }

        function actualizarInterfaz() {
            const items = obtenerNotificaciones();

            const visibles = items.filter(item => {
                return !item.hidden;
            });

            const noLeidas = visibles.filter(item => {
                return item.classList.contains("unread");
            });

            const cantidadNoLeidas = noLeidas.length;
            const hayNotificaciones = visibles.length > 0;

            if (notificationCount) {
                notificationCount.textContent =
                    cantidadNoLeidas > 99
                        ? "99+"
                        : String(cantidadNoLeidas);

                notificationCount.classList.toggle(
                    "hidden",
                    cantidadNoLeidas === 0
                );
            }

            notificationPoint?.classList.toggle(
                "hidden",
                cantidadNoLeidas === 0
            );

            if (unreadNotificationsText) {
                if (cantidadNoLeidas === 0) {
                    unreadNotificationsText.textContent =
                        "No hay notificaciones sin leer";
                } else if (cantidadNoLeidas === 1) {
                    unreadNotificationsText.textContent =
                        "1 notificación sin leer";
                } else {
                    unreadNotificationsText.textContent =
                        `${cantidadNoLeidas} notificaciones sin leer`;
                }
            }

            if (markNotificationsRead) {
                markNotificationsRead.disabled =
                    cantidadNoLeidas === 0;
            }

            if (clearNotificationsButton) {
                clearNotificationsButton.disabled =
                    !hayNotificaciones;
            }

            if (notificationsList) {
                notificationsList.style.display =
                    hayNotificaciones ? "block" : "none";
            }

            notificationsEmpty?.classList.toggle(
                "show",
                !hayNotificaciones
            );
        }

        function restaurarEstado() {
            const items = obtenerNotificaciones();

            items.forEach(item => {
                const notificationId =
                    item.dataset.notificationId;

                const unreadIndicator =
                    item.querySelector(".unread-indicator");

                if (notificationState.cleared) {
                    item.hidden = true;
                    return;
                }

                item.hidden = false;

                const estaLeida =
                    notificationState.readIds.includes(
                        notificationId
                    );

                item.classList.toggle(
                    "unread",
                    !estaLeida
                );

                if (unreadIndicator) {
                    unreadIndicator.style.display =
                        estaLeida ? "none" : "";
                }
            });

            actualizarInterfaz();
        }

        function marcarComoLeida(item) {
            if (!item || item.hidden) {
                return;
            }

            const notificationId =
                item.dataset.notificationId;

            item.classList.remove("unread");

            const unreadIndicator =
                item.querySelector(".unread-indicator");

            if (unreadIndicator) {
                unreadIndicator.style.display = "none";
            }

            if (
                notificationId &&
                !notificationState.readIds.includes(
                    notificationId
                )
            ) {
                notificationState.readIds.push(
                    notificationId
                );
            }

            notificationState.cleared = false;

            guardarEstado(notificationState);
            actualizarInterfaz();
        }

        function marcarTodasComoLeidas() {
            const items = obtenerNotificaciones();

            items.forEach(item => {
                if (item.hidden) {
                    return;
                }

                item.classList.remove("unread");

                const notificationId =
                    item.dataset.notificationId;

                const unreadIndicator =
                    item.querySelector(".unread-indicator");

                if (unreadIndicator) {
                    unreadIndicator.style.display = "none";
                }

                if (
                    notificationId &&
                    !notificationState.readIds.includes(
                        notificationId
                    )
                ) {
                    notificationState.readIds.push(
                        notificationId
                    );
                }
            });

            notificationState.cleared = false;

            guardarEstado(notificationState);
            actualizarInterfaz();
        }

        function limpiarNotificaciones() {
            const items = obtenerNotificaciones();

            items.forEach(item => {
                item.hidden = true;
            });

            notificationState.cleared = true;

            guardarEstado(notificationState);
            actualizarInterfaz();
        }

        /* =================================================
           EVENTOS
        ================================================= */

        notificationButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                alternarPanel();
            }
        );

        notificationsPanel.addEventListener(
            "click",
            event => {
                event.stopPropagation();
            }
        );

        closeNotificationsButton?.addEventListener(
            "click",
            event => {
                event.preventDefault();
                cerrarPanel();
            }
        );

        notificationsOverlay?.addEventListener(
            "click",
            cerrarPanel
        );

        markNotificationsRead?.addEventListener(
            "click",
            event => {
                event.preventDefault();
                marcarTodasComoLeidas();
            }
        );

        clearNotificationsButton?.addEventListener(
            "click",
            event => {
                event.preventDefault();
                limpiarNotificaciones();
            }
        );

        notificationsList?.addEventListener(
            "click",
            event => {
                const notificationItem =
                    event.target.closest(
                        ".notification-item"
                    );

                if (!notificationItem) {
                    return;
                }

                marcarComoLeida(notificationItem);

                const actionButton =
                    event.target.closest(
                        "[data-campaign-link]"
                    );

                if (!actionButton) {
                    return;
                }

                const destination =
                    actionButton.dataset.campaignLink;

                if (destination) {
                    window.location.href = destination;
                }
            }
        );

        document.addEventListener(
            "click",
            event => {
                if (
                    notificationsPanel.classList.contains(
                        "show"
                    ) &&
                    !wrapper.contains(event.target)
                ) {
                    cerrarPanel();
                }
            }
        );

        document.addEventListener(
            "keydown",
            event => {
                if (event.key === "Escape") {
                    cerrarPanel();
                }
            }
        );

        window.addEventListener(
            "resize",
            () => {
                if (
                    !notificationsPanel.classList.contains(
                        "show"
                    )
                ) {
                    return;
                }

                const esPantallaPequena =
                    window.innerWidth <= 980;

                notificationsOverlay?.classList.toggle(
                    "show",
                    esPantallaPequena
                );

                document.body.style.overflow =
                    esPantallaPequena
                        ? "hidden"
                        : "";
            }
        );

        window.addEventListener(
            "storage",
            event => {
                if (event.key !== STORAGE_KEY) {
                    return;
                }

                notificationState = cargarEstado();
                restaurarEstado();
            }
        );

        restaurarEstado();

        console.log(
            "TecnoSula: centro de notificaciones inicializado."
        );
    }

    function cargarEstado() {
        const savedState =
            localStorage.getItem(STORAGE_KEY);

        if (!savedState) {
            return {
                readIds: [],
                cleared: false
            };
        }

        try {
            const parsedState =
                JSON.parse(savedState);

            return {
                readIds: Array.isArray(
                    parsedState.readIds
                )
                    ? parsedState.readIds
                    : [],

                cleared: Boolean(
                    parsedState.cleared
                )
            };
        } catch (error) {
            console.error(
                "No se pudo cargar el estado de las notificaciones.",
                error
            );

            return {
                readIds: [],
                cleared: false
            };
        }
    }

    function guardarEstado(state) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );
    }

    function renderizarIconos() {
        if (
            typeof lucide !== "undefined" &&
            typeof lucide.createIcons === "function"
        ) {
            lucide.createIcons();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarCentroNotificaciones
        );
    } else {
        iniciarCentroNotificaciones();
    }
})();