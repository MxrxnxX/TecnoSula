document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const ADMIN_EMAIL = "admin@tecnosula.com";
    const token = localStorage.getItem("token");

    const adminUsersModule =
        document.getElementById("adminUsersModule");

    if (!adminUsersModule || !token) {
        return;
    }

    function decodeTokenPayload(jwtToken) {
        try {
            const payloadPart = jwtToken.split(".")[1];

            if (!payloadPart) {
                return null;
            }

            const normalizedPayload = payloadPart
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedPayload = normalizedPayload.padEnd(
                Math.ceil(normalizedPayload.length / 4) * 4,
                "="
            );

            const decodedPayload = decodeURIComponent(
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
            console.error(
                "No se pudo verificar el correo del administrador.",
                error
            );

            return null;
        }
    }

    const payload = decodeTokenPayload(token);

    const email =
        payload?.[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] ||
        payload?.email ||
        payload?.correo ||
        "";

    const currentEmail = String(email)
        .trim()
        .toLowerCase();

    adminUsersModule.hidden =
        currentEmail !== ADMIN_EMAIL;

    if (
        typeof lucide !== "undefined" &&
        typeof lucide.createIcons === "function"
    ) {
        lucide.createIcons();
    }
});