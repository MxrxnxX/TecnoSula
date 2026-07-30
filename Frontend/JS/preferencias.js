document.addEventListener(
    "DOMContentLoaded",
    () => {
        "use strict";

        const preferenciasPorDefecto = {
            animaciones: true,
            mensajes: true,
            paginaInicio: "Dashboard.html"
        };

        function obtenerClave() {
            const usuario =
                localStorage.getItem("idUsuario") ||
                localStorage.getItem("correo") ||
                "general";

            return `tecnosula_preferencias_${usuario}`;
        }

        function leerPreferencias() {
            const clave =
                obtenerClave();

            const guardadas =
                localStorage.getItem(clave);

            if (!guardadas) {
                return {
                    ...preferenciasPorDefecto
                };
            }

            try {
                return {
                    ...preferenciasPorDefecto,
                    ...JSON.parse(guardadas)
                };

            } catch (error) {
                console.error(
                    "Error al leer preferencias:",
                    error
                );

                return {
                    ...preferenciasPorDefecto
                };
            }
        }

        function aplicarPreferencias(
            preferencias
        ) {
            document.body.classList.toggle(
                "sin-animaciones",
                !preferencias.animaciones
            );

            document.body.classList.toggle(
                "sin-mensajes-laterales",
                !preferencias.mensajes
            );
        }

        aplicarPreferencias(
            leerPreferencias()
        );

        window.addEventListener(
            "tecnosula:preferencias-interfaz",
            event => {
                aplicarPreferencias(
                    event.detail ||
                    preferenciasPorDefecto
                );
            }
        );

        window.addEventListener(
            "storage",
            event => {
                if (
                    event.key &&
                    event.key.startsWith(
                        "tecnosula_preferencias_"
                    )
                ) {
                    aplicarPreferencias(
                        leerPreferencias()
                    );
                }
            }
        );
    }
);