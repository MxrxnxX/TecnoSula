(() => {
    "use strict";

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const EXIT_DURATION = 210;

    const ENTER_DURATION = 380;

    const TRANSITION_FLAG =
        "tecnosulaModuleTransition";

    const documentElement =
        document.documentElement;

    let navigationInProgress = false;

    // =====================================================
    // CREAR ELEMENTOS VISUALES
    // =====================================================

    function createTransitionElements() {
        let overlay =
            document.querySelector(
                ".page-transition-overlay"
            );

        let line =
            document.querySelector(
                ".page-transition-line"
            );

        if (!overlay) {
            overlay =
                document.createElement("div");

            overlay.className =
                "page-transition-overlay";

            overlay.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.appendChild(
                overlay
            );
        }

        if (!line) {
            line =
                document.createElement("div");

            line.className =
                "page-transition-line";

            line.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.appendChild(
                line
            );
        }
    }

    // =====================================================
    // VALIDAR ENLACE
    // =====================================================

    function shouldAnimateNavigation(
        event,
        link
    ) {
        if (!link) {
            return false;
        }

        if (
            event.defaultPrevented ||
            event.button !== 0
        ) {
            return false;
        }

        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return false;
        }

        if (
            link.target === "_blank" ||
            link.hasAttribute("download")
        ) {
            return false;
        }

        const href =
            link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("javascript:")
        ) {
            return false;
        }

        const destination =
            new URL(
                link.href,
                window.location.href
            );

        if (
            destination.origin !==
            window.location.origin
        ) {
            return false;
        }

        return true;
    }

    // =====================================================
    // COMPROBAR MISMA PÁGINA
    // =====================================================

    function isCurrentPage(destination) {
        const currentLocation =
            window.location.pathname +
            window.location.search +
            window.location.hash;

        const destinationLocation =
            destination.pathname +
            destination.search +
            destination.hash;

        return (
            currentLocation ===
            destinationLocation
        );
    }

    // =====================================================
    // INICIAR SALIDA
    // =====================================================

    function navigateWithTransition(
        destination
    ) {
        if (navigationInProgress) {
            return;
        }

        navigationInProgress = true;

        sessionStorage.setItem(
            TRANSITION_FLAG,
            "true"
        );

        documentElement.classList.remove(
            "module-arriving"
        );

        documentElement.classList.add(
            "module-leaving"
        );

        window.setTimeout(
            () => {
                window.location.assign(
                    destination
                );
            },
            EXIT_DURATION
        );
    }

    // =====================================================
    // MOSTRAR ENTRADA
    // =====================================================

    function playEntryTransition() {
        const shouldPlay =
            sessionStorage.getItem(
                TRANSITION_FLAG
            ) === "true";

        sessionStorage.removeItem(
            TRANSITION_FLAG
        );

        if (!shouldPlay) {
            return;
        }

        documentElement.classList.add(
            "module-arriving"
        );

        window.setTimeout(
            () => {
                documentElement.classList.remove(
                    "module-arriving"
                );
            },
            ENTER_DURATION
        );
    }

    // =====================================================
    // EVENTOS
    // =====================================================

    function initializeTransitions() {
        createTransitionElements();

        playEntryTransition();

        document.addEventListener(
            "click",
            event => {
                const link =
                    event.target.closest(
                        "a.navigation-link"
                    );

                if (
                    !shouldAnimateNavigation(
                        event,
                        link
                    )
                ) {
                    return;
                }

                const destination =
                    new URL(
                        link.href,
                        window.location.href
                    );

                if (
                    isCurrentPage(
                        destination
                    )
                ) {
                    event.preventDefault();
                    return;
                }

                event.preventDefault();

                navigateWithTransition(
                    destination.href
                );
            }
        );

        window.addEventListener(
            "pageshow",
            () => {
                navigationInProgress =
                    false;

                documentElement.classList.remove(
                    "module-leaving"
                );
            }
        );
    }

    // =====================================================
    // INICIAR
    // =====================================================

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeTransitions
        );
    } else {
        initializeTransitions();
    }
})();