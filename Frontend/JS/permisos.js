// =====================================================
// PERMISOS VISUALES DE TECNOSULA
// =====================================================

(() => {
    const ROLE_CLAIM =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

    function decodificarToken(token) {
        const partes = token.split(".");

        if (partes.length !== 3) {
            throw new Error("El token no tiene un formato válido.");
        }

        let base64 = partes[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        base64 = base64.padEnd(
            base64.length + (4 - base64.length % 4) % 4,
            "="
        );

        const textoJson = decodeURIComponent(
            atob(base64)
                .split("")
                .map(caracter => {
                    return "%" +
                        caracter
                            .charCodeAt(0)
                            .toString(16)
                            .padStart(2, "0");
                })
                .join("")
        );

        return JSON.parse(textoJson);
    }

    function obtenerRol(payload) {
        return String(
            payload[ROLE_CLAIM] ??
            payload.role ??
            payload.rol ??
            payload.Rol ??
            ""
        )
            .trim()
            .toLowerCase();
    }

    function aplicarPermisos() {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.replace("index.html");
            return;
        }

        try {
            const payload = decodificarToken(token);

            // Comprobar expiración del token
            if (
                payload.exp &&
                Date.now() >= payload.exp * 1000
            ) {
                localStorage.removeItem("token");
                window.location.replace("index.html");
                return;
            }

            const rol = obtenerRol(payload);
            const esAdministrador =
                rol === "administrador";

            console.log("Rol detectado:", rol);

            // Solo el administrador recibe la clase que muestra el módulo
            document
                .querySelectorAll(".admin-only")
                .forEach(elemento => {
                    if (esAdministrador) {
                        elemento.classList.add(
                            "admin-visible"
                        );
                    } else {
                        elemento.classList.remove(
                            "admin-visible"
                        );
                    }
                });

            const requiereAdministrador =
                document.body.dataset.requiereAdmin === "true";

            // Bloquear usuarios.html para cualquier otro rol
            if (
                requiereAdministrador &&
                !esAdministrador
            ) {
                window.location.replace("Dashboard.html");
                return;
            }

            // Mostrar usuarios.html únicamente al administrador
            if (
                requiereAdministrador &&
                esAdministrador
            ) {
                document.body.classList.remove(
                    "pagina-admin-protegida"
                );
            }

        } catch (error) {
            console.error(
                "No se pudieron comprobar los permisos:",
                error
            );

            localStorage.removeItem("token");
            window.location.replace("index.html");
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        aplicarPermisos
    );
})();