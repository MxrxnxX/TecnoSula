document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const API_BASE_URL =
        "http://localhost:5208/api";

    const token =
        localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    let perfilOriginal = null;

    // =====================================================
    // ELEMENTOS GENERALES
    // =====================================================

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const openSidebarButton =
        document.getElementById("openSidebar");

    const closeSidebarButton =
        document.getElementById("closeSidebar");

    const logoutButton =
        document.getElementById("logoutButton");

    const employeeNameElement =
        document.getElementById("employeeName");

    const employeeInitialsElement =
        document.getElementById("employeeInitials");

    const settingsTabs =
        document.querySelectorAll(".settings-tab");

    const settingsPanels =
        document.querySelectorAll(".settings-panel");

    // =====================================================
    // ELEMENTOS DEL PERFIL
    // =====================================================

    const profileForm =
        document.getElementById("profileForm");

    const profileInitialsElement =
        document.getElementById("profileInitials");

    const profileFullNameElement =
        document.getElementById("profileFullName");

    const profileEmailElement =
        document.getElementById("profileEmail");

    const profileRoleElement =
        document.getElementById("profileRole");

    const perfilNombreInput =
        document.getElementById("perfilNombre");

    const perfilApellidoInput =
        document.getElementById("perfilApellido");

    const perfilCorreoInput =
        document.getElementById("perfilCorreo");

    const perfilTelefonoInput =
        document.getElementById("perfilTelefono");

    const perfilRolInput =
        document.getElementById("perfilRol");

    const perfilEstadoInput =
        document.getElementById("perfilEstado");

    const guardarPerfilButton =
        document.getElementById("guardarPerfil");

    const restaurarPerfilButton =
        document.getElementById("restaurarPerfil");

    const profileSaveStatus =
        document.getElementById("profileSaveStatus");

    const errorPerfilNombre =
        document.getElementById("errorPerfilNombre");

    const errorPerfilApellido =
        document.getElementById("errorPerfilApellido");

    const errorPerfilTelefono =
        document.getElementById("errorPerfilTelefono");

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
    // INICIALES
    // =====================================================

    function obtenerIniciales(
        nombre,
        apellido = ""
    ) {
        const partes = [
            nombre,
            apellido
        ]
            .filter(Boolean)
            .join(" ")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2);

        const iniciales = partes
            .map(
                palabra =>
                    palabra.charAt(0).toUpperCase()
            )
            .join("");

        return iniciales || "EM";
    }

    // =====================================================
    // PERFIL DE LA BARRA LATERAL
    // =====================================================

    function actualizarPerfilLateral(
        nombre,
        apellido
    ) {
        const nombreCompleto = [
            nombre,
            apellido
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

        if (employeeNameElement) {
            employeeNameElement.textContent =
                nombreCompleto || "Empleado";
        }

        if (employeeInitialsElement) {
            employeeInitialsElement.textContent =
                obtenerIniciales(
                    nombre,
                    apellido
                );
        }
    }

    // =====================================================
    // MENÚ LATERAL
    // =====================================================

    function abrirSidebar() {
        sidebar?.classList.add("open");
        sidebarOverlay?.classList.add("show");

        document.body.style.overflow =
            "hidden";
    }

    function cerrarSidebar() {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove("show");

        document.body.style.overflow = "";
    }

    openSidebarButton?.addEventListener(
        "click",
        abrirSidebar
    );

    closeSidebarButton?.addEventListener(
        "click",
        cerrarSidebar
    );

    sidebarOverlay?.addEventListener(
        "click",
        cerrarSidebar
    );

    // =====================================================
    // NAVEGACIÓN DE CONFIGURACIÓN
    // =====================================================

    function abrirSeccion(nombreSeccion) {
        settingsTabs.forEach(tab => {
            const seleccionada =
                tab.dataset.section ===
                nombreSeccion;

            tab.classList.toggle(
                "active",
                seleccionada
            );
        });

        settingsPanels.forEach(panel => {
            const seleccionado =
                panel.dataset.panel ===
                nombreSeccion;

            panel.hidden = !seleccionado;

            panel.classList.toggle(
                "active",
                seleccionado
            );
        });

        localStorage.setItem(
            "configuracionSeccionActiva",
            nombreSeccion
        );

        renderIcons();
    }

    settingsTabs.forEach(tab => {
        tab.addEventListener(
            "click",
            () => {
                const seccion =
                    tab.dataset.section;

                if (seccion) {
                    abrirSeccion(seccion);
                }
            }
        );
    });

    function restaurarSeccionActiva() {
        const guardada =
            localStorage.getItem(
                "configuracionSeccionActiva"
            );

        const existe = Array
            .from(settingsTabs)
            .some(
                tab =>
                    tab.dataset.section ===
                    guardada &&
                    getComputedStyle(tab).display !==
                        "none"
            );

        abrirSeccion(
            existe
                ? guardada
                : "perfil"
        );
    }

    // =====================================================
    // MENSAJES DEL PERFIL
    // =====================================================

    function mostrarEstadoPerfil(
        mensaje,
        tipo = ""
    ) {
        if (!profileSaveStatus) {
            return;
        }

        profileSaveStatus.textContent =
            mensaje;

        profileSaveStatus.classList.remove(
            "success",
            "error"
        );

        if (tipo) {
            profileSaveStatus.classList.add(
                tipo
            );
        }
    }

    // =====================================================
    // LIMPIAR ERRORES
    // =====================================================

    function limpiarErroresPerfil() {
        if (errorPerfilNombre) {
            errorPerfilNombre.textContent = "";
        }

        if (errorPerfilApellido) {
            errorPerfilApellido.textContent = "";
        }

        if (errorPerfilTelefono) {
            errorPerfilTelefono.textContent = "";
        }

        perfilNombreInput
            ?.closest(".settings-field")
            ?.classList.remove("has-error");

        perfilApellidoInput
            ?.closest(".settings-field")
            ?.classList.remove("has-error");

        perfilTelefonoInput
            ?.closest(".settings-field")
            ?.classList.remove("has-error");
    }

    // =====================================================
    // VALIDAR PERFIL
    // =====================================================

    function validarPerfil() {
        limpiarErroresPerfil();

        const nombre =
            perfilNombreInput?.value.trim() || "";

        const apellido =
            perfilApellidoInput?.value.trim() || "";

        const telefono =
            perfilTelefonoInput?.value.trim() || "";

        let valido = true;

        if (!nombre) {
            errorPerfilNombre.textContent =
                "El nombre es obligatorio.";

            perfilNombreInput
                ?.closest(".settings-field")
                ?.classList.add("has-error");

            valido = false;
        }

        if (!apellido) {
            errorPerfilApellido.textContent =
                "El apellido es obligatorio.";

            perfilApellidoInput
                ?.closest(".settings-field")
                ?.classList.add("has-error");

            valido = false;
        }

        if (
            telefono &&
            !/^[0-9+\-\s()]{7,20}$/.test(
                telefono
            )
        ) {
            errorPerfilTelefono.textContent =
                "Ingresa un teléfono válido.";

            perfilTelefonoInput
                ?.closest(".settings-field")
                ?.classList.add("has-error");

            valido = false;
        }

        return valido;
    }

    // =====================================================
    // MOSTRAR DATOS DEL PERFIL
    // =====================================================

    function llenarPerfil(perfil) {
        perfilOriginal = {
            ...perfil
        };

        const nombre =
            perfil.nombre || "";

        const apellido =
            perfil.apellido || "";

        const correo =
            perfil.correo || "";

        const telefono =
            perfil.telefono || "";

        const rol =
            perfil.rol || "Usuario";

        const estado =
            perfil.estado || "Activo";

        if (perfilNombreInput) {
            perfilNombreInput.value = nombre;
        }

        if (perfilApellidoInput) {
            perfilApellidoInput.value = apellido;
        }

        if (perfilCorreoInput) {
            perfilCorreoInput.value = correo;
        }

        if (perfilTelefonoInput) {
            perfilTelefonoInput.value = telefono;
        }

        if (perfilRolInput) {
            perfilRolInput.value = rol;
        }

        if (perfilEstadoInput) {
            perfilEstadoInput.value = estado;
        }

        if (profileFullNameElement) {
            profileFullNameElement.textContent =
                `${nombre} ${apellido}`.trim() ||
                "Usuario TecnoSula";
        }

        if (profileEmailElement) {
            profileEmailElement.textContent =
                correo || "Sin correo";
        }

        if (profileRoleElement) {
            profileRoleElement.textContent =
                rol;
        }

        if (profileInitialsElement) {
            profileInitialsElement.textContent =
                obtenerIniciales(
                    nombre,
                    apellido
                );
        }

        actualizarPerfilLateral(
            nombre,
            apellido
        );

        localStorage.setItem(
            "nombre",
            `${nombre} ${apellido}`.trim()
        );

        localStorage.setItem(
            "correo",
            correo
        );
    }

    // =====================================================
    // PETICIÓN AUTENTICADA
    // =====================================================

    async function realizarPeticion(
        url,
        opciones = {}
    ) {
        const respuesta = await fetch(
            url,
            {
                ...opciones,

                headers: {
                    Accept: "application/json",
                    Authorization:
                        `Bearer ${token}`,

                    ...(opciones.body
                        ? {
                            "Content-Type":
                                "application/json"
                        }
                        : {}),

                    ...(opciones.headers || {})
                }
            }
        );

        if (respuesta.status === 401) {
            localStorage.removeItem("token");

            window.location.href =
                "index.html";

            throw new Error(
                "La sesión ha expirado."
            );
        }

        if (!respuesta.ok) {
            const mensaje =
                await respuesta.text();

            throw new Error(
                mensaje ||
                `Error HTTP ${respuesta.status}`
            );
        }

        return respuesta.json();
    }

    // =====================================================
    // CARGAR PERFIL
    // =====================================================

    async function cargarPerfil() {
        try {
            mostrarEstadoPerfil(
                "Cargando información..."
            );

            const perfil =
                await realizarPeticion(
                    `${API_BASE_URL}/Configuracion/perfil`
                );

            llenarPerfil(perfil);

            mostrarEstadoPerfil("");

        } catch (error) {
            console.error(
                "No se pudo cargar el perfil:",
                error
            );

            mostrarEstadoPerfil(
                "No se pudo cargar la información del perfil.",
                "error"
            );
        }
    }

    // =====================================================
    // RESTAURAR PERFIL
    // =====================================================

    restaurarPerfilButton?.addEventListener(
        "click",
        () => {
            if (!perfilOriginal) {
                return;
            }

            llenarPerfil(perfilOriginal);
            limpiarErroresPerfil();

            mostrarEstadoPerfil(
                "Se restauraron los datos originales."
            );
        }
    );

    // =====================================================
    // GUARDAR PERFIL
    // =====================================================

    profileForm?.addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            if (!validarPerfil()) {
                mostrarEstadoPerfil(
                    "Revisa los campos indicados.",
                    "error"
                );

                return;
            }

            const datos = {
                nombre:
                    perfilNombreInput.value.trim(),

                apellido:
                    perfilApellidoInput.value.trim(),

                telefono:
                    perfilTelefonoInput.value.trim()
            };

            try {
                guardarPerfilButton.disabled = true;

                guardarPerfilButton.innerHTML = `
                    <i data-lucide="loader-circle"></i>
                    Guardando...
                `;

                renderIcons();

                mostrarEstadoPerfil(
                    "Guardando cambios..."
                );

                const respuesta =
                    await realizarPeticion(
                        `${API_BASE_URL}/Configuracion/perfil`,
                        {
                            method: "PUT",
                            body: JSON.stringify(datos)
                        }
                    );

                llenarPerfil(
                    respuesta.usuario
                );

                mostrarEstadoPerfil(
                    respuesta.mensaje ||
                    "Perfil actualizado correctamente.",
                    "success"
                );

            } catch (error) {
                console.error(
                    "No se pudo actualizar el perfil:",
                    error
                );

                mostrarEstadoPerfil(
                    error.message ||
                    "No se pudo actualizar el perfil.",
                    "error"
                );

            } finally {
                guardarPerfilButton.disabled =
                    false;

                guardarPerfilButton.innerHTML = `
                    <i data-lucide="save"></i>
                    Guardar cambios
                `;

                renderIcons();
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
            localStorage.removeItem("idUsuario");
            localStorage.removeItem("correo");
            localStorage.removeItem(
                "configuracionSeccionActiva"
            );

            window.location.href =
                "index.html";
        }
    );

    // =====================================================
    // CARGAR MÓDULO
    // =====================================================

    restaurarSeccionActiva();
    cargarPerfil();
    renderIcons();
});