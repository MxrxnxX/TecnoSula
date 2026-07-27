document.addEventListener("DOMContentLoaded", async () => {
    "use strict";

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const ADMIN_EMAIL = "admin@tecnosula.com";
    const USERS_API = "http://localhost:5208/api/Usuarios";

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // =====================================================
    // ELEMENTOS GENERALES
    // =====================================================

    const usersTableBody =
        document.getElementById("usersTableBody");

    const userSearch =
        document.getElementById("userSearch");

    const statusFilter =
        document.getElementById("statusFilter");
        const userStatusFilter =
    document.getElementById(
        "userStatusFilter"
    );

const userStatusFilterTrigger =
    document.getElementById(
        "userStatusFilterTrigger"
    );

const userStatusFilterMenu =
    document.getElementById(
        "userStatusFilterMenu"
    );

const userStatusFilterLabel =
    document.getElementById(
        "userStatusFilterLabel"
    );

const userStatusFilterIcon =
    document.getElementById(
        "userStatusFilterIcon"
    );

const userStatusFilterOptions =
    Array.from(
        document.querySelectorAll(
            ".user-status-filter-option"
        )
    );

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
        const newUserButton =
    document.getElementById("newUserButton");

    // =====================================================
    // ELEMENTOS DEL MODAL DE EDICIÓN
    // =====================================================

    const editUserModal =
        document.getElementById("editUserModal");
        const editUserModalTitle =
    document.getElementById(
        "editUserModalTitle"
    );

const editUserModalDescription =
    document.getElementById(
        "editUserModalDescription"
    );

    const editUserForm =
        document.getElementById("editUserForm");

    const editUserId =
        document.getElementById("editUserId");

    const editUserName =
        document.getElementById("editUserName");

    const editUserLastName =
        document.getElementById("editUserLastName");

    const editUserEmail =
        document.getElementById("editUserEmail");

    const editUserPhone =
        document.getElementById("editUserPhone");
        const editUserPassword =
    document.getElementById(
        "editUserPassword"
    );

const editUserPasswordGroup =
    document.getElementById(
        "editUserPasswordGroup"
    );

    const editUserRole =
        document.getElementById("editUserRole");

    const editUserStatus =
        document.getElementById("editUserStatus");

    const editUserMessage =
        document.getElementById("editUserMessage");

    const closeEditUserModalButton =
        document.getElementById("closeEditUserModal");

    const cancelEditUserButton =
        document.getElementById("cancelEditUserButton");

   const saveEditUserButton =
    document.getElementById("saveEditUserButton");

const roleOptionButtons =
    document.querySelectorAll(".role-option");

const statusOptionButtons =
    document.querySelectorAll(".status-option");

    let users = [];
    let userFormMode = "edit";

    // Ocultar el modal al cargar la página
    if (editUserModal) {
        editUserModal.hidden = true;
    }

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

    const tokenPayload = decodeTokenPayload(token);

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

    async function readResponse(response) {
        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            return await response.json();
        }

        return {};
    }

    function handleAuthorizationError(response) {
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return true;
        }

        if (response.status === 403) {
            alert(
                "No tienes permiso para realizar esta acción."
            );

            return true;
        }

        return false;
    }

    // =====================================================
    // INFORMACIÓN DEL ADMINISTRADOR
    // =====================================================

    if (employeeName) {
        employeeName.textContent = currentName;
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

        usersTableBody.innerHTML = userList
            .map(user => {
                const idUsuario = getUserProperty(
                    user,
                    "idUsuario",
                    "IdUsuario"
                );

                const nombre = getUserProperty(
                    user,
                    "nombre",
                    "Nombre"
                );

                const apellido = getUserProperty(
                    user,
                    "apellido",
                    "Apellido"
                );

                const correo = getUserProperty(
                    user,
                    "correo",
                    "Correo"
                );

                const telefono = getUserProperty(
                    user,
                    "telefono",
                    "Telefono"
                );

                const estado = getUserProperty(
                    user,
                    "estado",
                    "Estado"
                );

                const rol = getUserProperty(
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

                const deactivateButton = active
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
                    : "";

                return `
                    <tr>
                        <td>
                            <div class="user-identity">

                                <div class="user-table-avatar">
                                    ${escapeHtml(initials)}
                                </div>

                                <div class="user-identity-data">
                                    <strong>
                                        ${escapeHtml(
                                            fullName || "Sin nombre"
                                        )}
                                    </strong>

                                    <span>
                                        ID: ${escapeHtml(idUsuario)}
                                    </span>
                                </div>

                            </div>
                        </td>

                        <td>
                            ${escapeHtml(
                                correo || "Sin correo"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                telefono || "Sin teléfono"
                            )}
                        </td>

                        <td>
                            <span class="user-role">
                                ${escapeHtml(
                                    rol || "Sin rol"
                                )}
                            </span>
                        </td>

                        <td>
                            <span class="user-status ${statusClass}">
                                ${escapeHtml(
                                    estado || "Sin estado"
                                )}
                            </span>
                        </td>

                        <td>
                            <div class="user-actions">

                                <button
                                    class="user-action-button edit"
                                    type="button"
                                    title="Editar usuario"
                                    aria-label="Editar usuario"
                                    data-action="edit"
                                    data-user-id="${escapeHtml(idUsuario)}"
                                >
                                    <i data-lucide="pencil"></i>
                                </button>

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
// FILTRO VISUAL DE ESTADO
// =====================================================

function syncUserStatusFilter() {
    const currentValue =
        statusFilter?.value || "todos";

    const selectedOption =
        userStatusFilterOptions.find(
            option =>
                option.dataset.statusValue ===
                currentValue
        );

    const label =
        selectedOption?.dataset.statusLabel ||
        "Todos los usuarios";

    const icon =
        selectedOption?.dataset.statusIcon ||
        "users-round";

    if (userStatusFilterLabel) {
        userStatusFilterLabel.textContent =
            label;
    }

    if (userStatusFilterIcon) {
        userStatusFilterIcon.innerHTML = `
            <i data-lucide="${icon}"></i>
        `;
    }

    if (userStatusFilter) {
        userStatusFilter.dataset.status =
            currentValue;
    }

    userStatusFilterOptions.forEach(
        option => {
            const selected =
                option.dataset.statusValue ===
                currentValue;

            option.classList.toggle(
                "selected",
                selected
            );

            option.setAttribute(
                "aria-selected",
                String(selected)
            );
        }
    );

    renderIcons();
}

function openUserStatusFilter() {
    if (
        !userStatusFilter ||
        !userStatusFilterMenu ||
        !userStatusFilterTrigger
    ) {
        return;
    }

    userStatusFilterMenu.hidden = false;

    requestAnimationFrame(() => {
        userStatusFilterMenu.classList.add(
            "show"
        );
    });

    userStatusFilter.classList.add(
        "open"
    );

    userStatusFilterTrigger.setAttribute(
        "aria-expanded",
        "true"
    );
}

function closeUserStatusFilter() {
    if (
        !userStatusFilter ||
        !userStatusFilterMenu ||
        !userStatusFilterTrigger
    ) {
        return;
    }

    userStatusFilterMenu.classList.remove(
        "show"
    );

    userStatusFilter.classList.remove(
        "open"
    );

    userStatusFilterTrigger.setAttribute(
        "aria-expanded",
        "false"
    );

    window.setTimeout(() => {
        if (
            !userStatusFilterMenu.classList.contains(
                "show"
            )
        ) {
            userStatusFilterMenu.hidden = true;
        }
    }, 180);
}

function toggleUserStatusFilter() {
    const isOpen =
        userStatusFilter?.classList.contains(
            "open"
        );

    if (isOpen) {
        closeUserStatusFilter();
    } else {
        openUserStatusFilter();
    }
}
    // =====================================================
    // FILTRAR USUARIOS
    // =====================================================

    function applyFilters() {
        const searchValue =
            normalizeText(userSearch?.value);

        const selectedStatus =
            normalizeText(statusFilter?.value);

        const filteredUsers = users.filter(user => {
            const nombre = getUserProperty(
                user,
                "nombre",
                "Nombre"
            );

            const apellido = getUserProperty(
                user,
                "apellido",
                "Apellido"
            );

            const correo = getUserProperty(
                user,
                "correo",
                "Correo"
            );

            const estado = getUserProperty(
                user,
                "estado",
                "Estado"
            );

            const completeText = normalizeText(
                `${nombre} ${apellido} ${correo}`
            );

            const matchesSearch =
                !searchValue ||
                completeText.includes(searchValue);

            const matchesStatus =
                selectedStatus === "todos" ||
                normalizeText(estado) === selectedStatus;

            return matchesSearch && matchesStatus;
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
            const response = await fetch(USERS_API, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (handleAuthorizationError(response)) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Error HTTP ${response.status}`
                );
            }

            const data = await response.json();

            users = Array.isArray(data) ? data : [];

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
    // MENSAJES DEL MODAL
    // =====================================================

    function showEditMessage(message, type = "") {
        if (!editUserMessage) {
            return;
        }

        editUserMessage.textContent = message;
        editUserMessage.className = "user-form-message";

        if (type) {
            editUserMessage.classList.add(type);
        }
    }

    function clearEditMessage() {
        showEditMessage("");
    }

   function setEditFormLoading(isLoading) {
    if (!saveEditUserButton) {
        return;
    }

    saveEditUserButton.disabled =
        isLoading;

    const buttonText =
        userFormMode === "create"
            ? "Crear usuario"
            : "Guardar cambios";

    saveEditUserButton.innerHTML =
        isLoading
            ? `
                <i data-lucide="loader-circle"></i>
                Procesando...
            `
            : `
                <i data-lucide="${
                    userFormMode === "create"
                        ? "user-plus"
                        : "save"
                }"></i>

                ${buttonText}
            `;

    renderIcons();
}
    // =====================================================
// SELECCIÓN VISUAL DE ROL Y ESTADO
// =====================================================

function selectUserRole(roleId) {
    const normalizedRoleId =
        String(roleId ?? "");

    if (editUserRole) {
        editUserRole.value =
            normalizedRoleId;
    }

    roleOptionButtons.forEach(button => {
        const selected =
            button.dataset.roleId ===
            normalizedRoleId;

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

function selectUserStatus(status) {
    const normalizedStatus =
        String(status ?? "").trim();

    if (editUserStatus) {
        editUserStatus.value =
            normalizedStatus;
    }

    statusOptionButtons.forEach(button => {
        const selected =
            normalizeText(
                button.dataset.status
            ) === normalizeText(normalizedStatus);

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
    // ABRIR Y CERRAR MODAL
    // =====================================================
function openCreateUser() {
    userFormMode = "create";

    editUserForm?.reset();

    if (editUserId) {
        editUserId.value = "";
    }

    if (editUserModalTitle) {
        editUserModalTitle.textContent =
            "Nuevo usuario";
    }

    if (editUserModalDescription) {
        editUserModalDescription.textContent =
            "Registra un nuevo usuario y define sus permisos de acceso.";
    }

    if (editUserPasswordGroup) {
        editUserPasswordGroup.hidden =
            false;
    }

    if (editUserPassword) {
        editUserPassword.required =
            true;

        editUserPassword.value = "";
    }

    selectUserRole("3");
    selectUserStatus("Activo");

    clearEditMessage();
    setEditFormLoading(false);
    showEditModal();

    window.setTimeout(() => {
        editUserName?.focus();
    }, 100);
}
    function showEditModal() {
        if (!editUserModal) {
            return;
        }

        editUserModal.hidden = false;
        editUserModal.setAttribute("aria-hidden", "false");

        requestAnimationFrame(() => {
            editUserModal.classList.add("show");
        });

        document.body.style.overflow = "hidden";
        renderIcons();
    }

    function closeEditModal() {
        if (!editUserModal) {
            return;
        }

        editUserModal.classList.remove("show");
        editUserModal.setAttribute("aria-hidden", "true");

        window.setTimeout(() => {
            editUserModal.hidden = true;
        }, 220);
editUserForm?.reset();
selectUserRole("");
selectUserStatus("");

        clearEditMessage();
        setEditFormLoading(false);

        document.body.style.overflow =
            sidebar?.classList.contains("open")
                ? "hidden"
                : "";
    }

    // =====================================================
    // CARGAR USUARIO PARA EDITAR
    // =====================================================

    async function openEditUser(idUsuario) {
        if (!idUsuario) {
            return;
        }
        userFormMode = "edit";

if (editUserModalTitle) {
    editUserModalTitle.textContent =
        "Editar usuario";
}

if (editUserModalDescription) {
    editUserModalDescription.textContent =
        "Modifica la información y los permisos del usuario.";
}

if (editUserPasswordGroup) {
    editUserPasswordGroup.hidden = true;
}

if (editUserPassword) {
    editUserPassword.required = false;
    editUserPassword.value = "";
}

        showEditModal();
        showEditMessage("Cargando información del usuario...");
        setEditFormLoading(true);

        try {
            const response = await fetch(
                `${USERS_API}/${idUsuario}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (handleAuthorizationError(response)) {
                closeEditModal();
                return;
            }

            const result = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.mensaje ||
                    "No fue posible consultar el usuario."
                );
            }

            const id = getUserProperty(
                result,
                "idUsuario",
                "IdUsuario"
            );

            const nombre = getUserProperty(
                result,
                "nombre",
                "Nombre"
            );

            const apellido = getUserProperty(
                result,
                "apellido",
                "Apellido"
            );

            const correo = getUserProperty(
                result,
                "correo",
                "Correo"
            );

            const telefono = getUserProperty(
                result,
                "telefono",
                "Telefono"
            );

            const estado = getUserProperty(
                result,
                "estado",
                "Estado"
            );

            const idRol = getUserProperty(
                result,
                "idRol",
                "IdRol"
            );
editUserId.value = id;
editUserName.value = nombre;
editUserLastName.value = apellido;
editUserEmail.value = correo;
editUserPhone.value = telefono;

selectUserRole(idRol);
selectUserStatus(estado);


            clearEditMessage();
            setEditFormLoading(false);

            editUserName?.focus();
        } catch (error) {
            console.error(
                "Error al consultar el usuario:",
                error
            );

            showEditMessage(
                error.message,
                "error"
            );

            setEditFormLoading(false);
        }
    }
    // =====================================================
// CREAR NUEVO USUARIO
// =====================================================

async function createUser(event) {
    event.preventDefault();

    const nombre =
        editUserName?.value?.trim();

    const apellido =
        editUserLastName?.value?.trim();

    const correo =
        editUserEmail?.value
            ?.trim()
            .toLowerCase();

    const contrasena =
        editUserPassword?.value || "";

    const telefono =
        editUserPhone?.value?.trim() || "";

    const estado =
        editUserStatus?.value;

    const idRol =
        Number(editUserRole?.value);

    if (
        !nombre ||
        !apellido ||
        !correo ||
        !contrasena ||
        !estado ||
        !Number.isInteger(idRol) ||
        idRol <= 0
    ) {
        showEditMessage(
            "Completa correctamente todos los campos obligatorios.",
            "error"
        );

        return;
    }

    if (contrasena.length < 6) {
        showEditMessage(
            "La contraseña debe tener al menos 6 caracteres.",
            "error"
        );

        return;
    }

    const userData = {
        nombre,
        apellido,
        correo,
        contrasena,
        telefono,
        estado,
        idRol
    };

    clearEditMessage();
    setEditFormLoading(true);

    try {
        const response = await fetch(
            USERS_API,
            {
                method: "POST",

                headers: {
                    Accept:
                        "application/json",

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(userData)
            }
        );

        if (
            handleAuthorizationError(response)
        ) {
            return;
        }

        const result =
            await readResponse(response);

        if (!response.ok) {
            let errorMessage =
                result.mensaje ||
                "No fue posible crear el usuario.";

            if (result.errors) {
                const validationErrors =
                    Object.values(
                        result.errors
                    )
                        .flat()
                        .join(" ");

                if (validationErrors) {
                    errorMessage =
                        validationErrors;
                }
            }

            throw new Error(errorMessage);
        }

        showEditMessage(
            result.mensaje ||
            "Usuario creado correctamente.",
            "success"
        );

        window.TecnoSulaNotifications
            ?.agregar({
                titulo:
                    "Nuevo usuario registrado",

                mensaje:
                    `El usuario "${nombre} ${apellido}" fue creado correctamente.`,

                tipo:
                    "success",

                icono:
                    "user-plus",

                categoria:
                    "Gestión de usuarios",

                iconoCategoria:
                    "users",

                accion:
                    "Ver usuarios",

                enlace:
                    "usuarios.html"
            });

        await loadUsers();

        window.setTimeout(() => {
            closeEditModal();
        }, 800);
    } catch (error) {
        console.error(
            "Error al crear el usuario:",
            error
        );

        showEditMessage(
            error.message,
            "error"
        );
    } finally {
        setEditFormLoading(false);
    }
}

    // =====================================================
    // GUARDAR CAMBIOS DEL USUARIO
    // =====================================================

    async function updateUser(event) {
        event.preventDefault();

        const idUsuario =
            editUserId?.value?.trim();

        const nombre =
            editUserName?.value?.trim();

        const apellido =
            editUserLastName?.value?.trim();

        const correo =
            editUserEmail?.value
                ?.trim()
                .toLowerCase();

        const telefono =
            editUserPhone?.value?.trim() || "";

        const estado =
            editUserStatus?.value;

        const idRol =
            Number(editUserRole?.value);

        if (
            !idUsuario ||
            !nombre ||
            !apellido ||
            !correo ||
            !estado ||
            !Number.isInteger(idRol) ||
            idRol <= 0
        ) {
            showEditMessage(
                "Completa correctamente todos los campos obligatorios.",
                "error"
            );

            return;
        }

        const userData = {
            nombre,
            apellido,
            correo,
            telefono,
            estado,
            idRol
        };

        clearEditMessage();
        setEditFormLoading(true);

        try {
            const response = await fetch(
                `${USERS_API}/${idUsuario}`,
                {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                }
            );

            if (handleAuthorizationError(response)) {
                return;
            }

            const result = await readResponse(response);

            if (!response.ok) {
                let errorMessage =
                    result.mensaje ||
                    "No fue posible actualizar el usuario.";

                if (result.errors) {
                    const validationErrors =
                        Object.values(result.errors)
                            .flat()
                            .join(" ");

                    if (validationErrors) {
                        errorMessage = validationErrors;
                    }
                }

                throw new Error(errorMessage);
            }

            showEditMessage(
                result.mensaje ||
                "Usuario actualizado correctamente.",
                "success"
            );

            await loadUsers();

            window.setTimeout(() => {
                closeEditModal();
            }, 700);
        } catch (error) {
            console.error(
                "Error al actualizar el usuario:",
                error
            );

            showEditMessage(
                error.message,
                "error"
            );
        } finally {
            setEditFormLoading(false);
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
            const response = await fetch(
                `${USERS_API}/${idUsuario}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (handleAuthorizationError(response)) {
                return;
            }

            const result = await readResponse(response);

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

        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove("show");

        if (editUserModal?.hidden !== false) {
            document.body.style.overflow = "";
        }
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
    // EVENTOS DE FILTROS
    // =====================================================
userStatusFilterTrigger?.addEventListener(
    "click",
    event => {
        event.preventDefault();
        event.stopPropagation();

        toggleUserStatusFilter();
    }
);

userStatusFilterMenu?.addEventListener(
    "click",
    event => {
        event.stopPropagation();

        const option =
            event.target.closest(
                ".user-status-filter-option"
            );

        if (!option || !statusFilter) {
            return;
        }

        statusFilter.value =
            option.dataset.statusValue ||
            "todos";

        statusFilter.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );

        closeUserStatusFilter();
    }
);

document.addEventListener(
    "click",
    event => {
        if (
            userStatusFilter &&
            !userStatusFilter.contains(
                event.target
            )
        ) {
            closeUserStatusFilter();
        }
    }
);
    userSearch?.addEventListener(
        "input",
        applyFilters
    );

 statusFilter?.addEventListener(
    "change",
    () => {
        syncUserStatusFilter();
        applyFilters();
    }
);

    // =====================================================
    // EVENTOS DE LA TABLA
    // =====================================================

    usersTableBody?.addEventListener(
        "click",
        event => {
            const button = event.target.closest(
                "button[data-action]"
            );

            if (!button) {
                return;
            }

            const action = button.dataset.action;
            const userId = button.dataset.userId;

            if (!userId) {
                return;
            }

            if (action === "edit") {
                openEditUser(userId);
                return;
            }

            if (action === "deactivate") {
                deactivateUser(userId);
            }
        }
    );
function saveUser(event) {
    if (userFormMode === "create") {
        createUser(event);
        return;
    }

    updateUser(event);
}
    // =====================================================
    // EVENTOS DEL MODAL
    // =====================================================
roleOptionButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            selectUserRole(
                button.dataset.roleId
            );
        }
    );
});

statusOptionButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            selectUserStatus(
                button.dataset.status
            );
        }
    );
});
newUserButton?.addEventListener(
    "click",
    openCreateUser
);
   editUserForm?.addEventListener(
    "submit",
    saveUser
);

    closeEditUserModalButton?.addEventListener(
        "click",
        closeEditModal
    );

    cancelEditUserButton?.addEventListener(
        "click",
        closeEditModal
    );

    editUserModal?.addEventListener(
        "click",
        event => {
            if (event.target === editUserModal) {
                closeEditModal();
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

            window.location.href = "index.html";
        }
    );

    // =====================================================
    // TECLA ESCAPE
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {
            if (event.key !== "Escape") {
                return;
            }
            if (
    userStatusFilter?.classList.contains(
        "open"
    )
) {
    closeUserStatusFilter();
    return;
}

            if (
                editUserModal &&
                editUserModal.hidden === false
            ) {
                closeEditModal();
                return;
            }

            closeSidebar();
        }
    );

    // =====================================================
    // INICIAR
    // =====================================================

   syncUserStatusFilter();
renderIcons();
await loadUsers();
});