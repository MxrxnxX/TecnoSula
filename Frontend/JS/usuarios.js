document.addEventListener("DOMContentLoaded", async () => {
    "use strict";

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const ADMIN_EMAIL = "admin@tecnosula.com";

    const USERS_API =
        "http://localhost:5208/api/Usuarios";

    const token =
        localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // =====================================================
    // ELEMENTOS DEL HTML
    // =====================================================

    const usersTableBody =
        document.getElementById("usersTableBody");

    const userSearch =
        document.getElementById("userSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const employeeName =
        document.getElementById("employeeName");

    const employeeInitials =
        document.getElementById("employeeInitials");

    const logoutButton =
        document.getElementById("logoutButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const openSidebarButton =
        document.getElementById("openSidebar");

    const closeSidebarButton =
        document.getElementById("closeSidebar");

    let users = [];

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
    // LEER JWT
    // =====================================================

    function decodeTokenPayload(jwtToken) {
        try {
            const payloadPart =
                jwtToken.split(".")[1];

            if (!payloadPart) {
                return null;
            }

            const normalizedPayload = payloadPart
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedPayload =
                normalizedPayload.padEnd(
                    Math.ceil(
                        normalizedPayload.length / 4
                    ) * 4,
                    "="
                );

            const decodedPayload =
                decodeURIComponent(
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
                "No se pudo leer el token.",
                error
            );

            return null;
        }
    }

    function getClaim(payload, longName, shortNames) {
        if (payload?.[longName]) {
            return payload[longName];
        }

        for (const name of shortNames) {
            if (payload?.[name]) {
                return payload[name];
            }
        }

        return "";
    }

    const tokenPayload =
        decodeTokenPayload(token);

    if (!tokenPayload) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }

    const currentEmail = String(
        getClaim(
            tokenPayload,
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
            ["email", "correo"]
        )
    )
        .trim()
        .toLowerCase();

    if (currentEmail !== ADMIN_EMAIL) {
        alert(
            "No tienes permiso para acceder a la gestión de usuarios."
        );

        window.location.href = "Dashboard.html";
        return;
    }

    const currentName =
        getClaim(
            tokenPayload,
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
            [
                "name",
                "unique_name",
                "given_name",
                "nombre"
            ]
        ) || "Administrador";

    // =====================================================
    // FUNCIONES AUXILIARES
    // =====================================================

    function normalizeText(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase();
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
                .map(word => {
                    return word
                        .charAt(0)
                        .toUpperCase();
                })
                .join("") || "AD"
        );
    }

    function getUserProperty(
        user,
        camelCaseName,
        pascalCaseName
    ) {
        return (
            user?.[camelCaseName] ??
            user?.[pascalCaseName] ??
            ""
        );
    }

    // =====================================================
    // INFORMACIÓN DEL ADMINISTRADOR
    // =====================================================

    if (employeeName) {
        employeeName.textContent =
            currentName;
    }

    if (employeeInitials) {
        employeeInitials.textContent =
            getInitials(currentName);
    }

    // =====================================================
    // MOSTRAR USUARIOS
    // =====================================================

    function renderUsers(userList) {
        if (!usersTableBody) {
            return;
        }

        if (!Array.isArray(userList) || userList.length === 0) {
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No se encontraron usuarios.
                    </td>
                </tr>
            `;

            return;
        }

        usersTableBody.innerHTML =
            userList.map(user => {
                const idUsuario =
                    getUserProperty(
                        user,
                        "idUsuario",
                        "IdUsuario"
                    );

                const nombre =
                    getUserProperty(
                        user,
                        "nombre",
                        "Nombre"
                    );

                const apellido =
                    getUserProperty(
                        user,
                        "apellido",
                        "Apellido"
                    );

                const correo =
                    getUserProperty(
                        user,
                        "correo",
                        "Correo"
                    );

                const telefono =
                    getUserProperty(
                        user,
                        "telefono",
                        "Telefono"
                    );

                const estado =
                    getUserProperty(
                        user,
                        "estado",
                        "Estado"
                    );

                const rol =
                    getUserProperty(
                        user,
                        "rol",
                        "Rol"
                    );

                const fullName =
                    `${nombre} ${apellido}`.trim();

                const active =
                    normalizeText(estado) === "activo";

                const statusClass =
                    active ? "active" : "inactive";

                const initials =
                    getInitials(fullName);

                const deactivateButton =
                    active
                        ? `
                            <button
                                class="user-action-button danger"
                                type="button"
                                title="Desactivar usuario"
                                aria-label="Desactivar usuario"
                                data-action="deactivate"
                                data-user-id="${escapeHtml(idUsuario)}"
                            >
                                <i data-lucide="user-x"></i>
                            </button>
                        `
                        : `
                            <span class="user-status inactive">
                                Sin acciones
                            </span>
                        `;

                return `
                    <tr>
                        <td>
                            <div class="user-identity">

                                <div class="user-table-avatar">
                                    ${escapeHtml(initials)}
                                </div>

                                <div class="user-identity-data">
                                    <strong>
                                        ${escapeHtml(fullName || "Sin nombre")}
                                    </strong>

                                    <span>
                                        ID: ${escapeHtml(idUsuario)}
                                    </span>
                                </div>

                            </div>
                        </td>

                        <td>
                            ${escapeHtml(correo || "Sin correo")}
                        </td>

                        <td>
                            ${escapeHtml(telefono || "Sin teléfono")}
                        </td>

                        <td>
                            <span class="user-role">
                                ${escapeHtml(rol || "Sin rol")}
                            </span>
                        </td>

                        <td>
                            <span class="user-status ${statusClass}">
                                ${escapeHtml(estado || "Sin estado")}
                            </span>
                        </td>

                        <td>
                            <div class="user-actions">
                                ${deactivateButton}
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join("");

        renderIcons();
    }

    // =====================================================
    // FILTRAR USUARIOS
    // =====================================================

    function applyFilters() {
        const searchValue =
            normalizeText(userSearch?.value);

        const selectedStatus =
            normalizeText(statusFilter?.value);

        const filteredUsers =
            users.filter(user => {
                const nombre =
                    getUserProperty(
                        user,
                        "nombre",
                        "Nombre"
                    );

                const apellido =
                    getUserProperty(
                        user,
                        "apellido",
                        "Apellido"
                    );

                const correo =
                    getUserProperty(
                        user,
                        "correo",
                        "Correo"
                    );

                const estado =
                    getUserProperty(
                        user,
                        "estado",
                        "Estado"
                    );

                const completeText =
                    normalizeText(
                        `${nombre} ${apellido} ${correo}`
                    );

                const matchesSearch =
                    !searchValue ||
                    completeText.includes(searchValue);

                const matchesStatus =
                    selectedStatus === "todos" ||
                    normalizeText(estado) ===
                        selectedStatus;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            });

        renderUsers(filteredUsers);
    }

    // =====================================================
    // CONSULTAR USUARIOS
    // =====================================================

    async function loadUsers() {
        if (usersTableBody) {
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Cargando usuarios...
                    </td>
                </tr>
            `;
        }

        try {
            const response =
                await fetch(USERS_API, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status === 401) {
                localStorage.removeItem("token");

                window.location.href =
                    "index.html";

                return;
            }

            if (response.status === 403) {
                alert(
                    "No tienes permiso para consultar los usuarios."
                );

                window.location.href =
                    "Dashboard.html";

                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Error HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            users =
                Array.isArray(data)
                    ? data
                    : [];

            applyFilters();
        } catch (error) {
            console.error(
                "Error al consultar usuarios:",
                error
            );

            if (usersTableBody) {
                usersTableBody.innerHTML = `
                    <tr>
                        <td colspan="6">
                            No fue posible cargar los usuarios.
                            Verifica que el backend esté ejecutándose.
                        </td>
                    </tr>
                `;
            }
        }
    }

    // =====================================================
    // DESACTIVAR USUARIO
    // =====================================================

    async function deactivateUser(idUsuario) {
        const confirmed = window.confirm(
            "¿Deseas desactivar este usuario?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${USERS_API}/${idUsuario}`,
                    {
                        method: "DELETE",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "index.html";
                return;
            }

            if (response.status === 403) {
                alert(
                    "No tienes permiso para realizar esta acción."
                );

                return;
            }

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.mensaje ||
                    "No fue posible desactivar el usuario."
                );
            }

            alert(
                result.mensaje ||
                "Usuario desactivado correctamente."
            );

            await loadUsers();
        } catch (error) {
            console.error(
                "Error al desactivar usuario:",
                error
            );

            alert(error.message);
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
        sidebarOverlay?.classList.remove("show");

        document.body.style.overflow =
            "";
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
    // EVENTOS DE LA TABLA Y FILTROS
    // =====================================================

    userSearch?.addEventListener(
        "input",
        applyFilters
    );

    statusFilter?.addEventListener(
        "change",
        applyFilters
    );

    usersTableBody?.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest(
                    "button[data-action]"
                );

            if (!button) {
                return;
            }

            const action =
                button.dataset.action;

            const userId =
                button.dataset.userId;

            if (
                action === "deactivate" &&
                userId
            ) {
                deactivateUser(userId);
            }
        }
    );

    // =====================================================
    // CERRAR SESIÓN
    // =====================================================

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
            if (event.key === "Escape") {
                closeSidebar();
            }
        }
    );

    // =====================================================
    // INICIAR
    // =====================================================

    renderIcons();

    await loadUsers();
});