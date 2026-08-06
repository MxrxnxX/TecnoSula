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
// ELEMENTOS DE SEGURIDAD
// =====================================================

const securityForm =
    document.getElementById("securityForm");

const contrasenaActualInput =
    document.getElementById("contrasenaActual");

const nuevaContrasenaInput =
    document.getElementById("nuevaContrasena");

const confirmarContrasenaInput =
    document.getElementById("confirmarContrasena");

const guardarSeguridadButton =
    document.getElementById("guardarSeguridad");

const limpiarSeguridadButton =
    document.getElementById("limpiarSeguridad");

const securitySaveStatus =
    document.getElementById("securitySaveStatus");

const errorContrasenaActual =
    document.getElementById("errorContrasenaActual");

const errorNuevaContrasena =
    document.getElementById("errorNuevaContrasena");

const errorConfirmarContrasena =
    document.getElementById("errorConfirmarContrasena");

const passwordVisibilityButtons =
    document.querySelectorAll(
        ".password-visibility-button"
    );
    // =====================================================
// ELEMENTOS DE NOTIFICACIONES
// =====================================================

const notificationsForm =
    document.getElementById("notificationsForm");

const notificarCampanasInput =
    document.getElementById("notificarCampanas");

const notificarPublicacionesInput =
    document.getElementById("notificarPublicaciones");

const notificarReportesInput =
    document.getElementById("notificarReportes");

const notificarSistemaInput =
    document.getElementById("notificarSistema");

const guardarNotificacionesButton =
    document.getElementById("guardarNotificaciones");

const restaurarNotificacionesButton =
    document.getElementById("restaurarNotificaciones");

const notificationsSaveStatus =
    document.getElementById("notificationsSaveStatus");

const notificationInputs = [
    notificarCampanasInput,
    notificarPublicacionesInput,
    notificarReportesInput,
    notificarSistemaInput
].filter(Boolean);

const preferenciasNotificacionesPorDefecto = {
    campanas: true,
    publicaciones: true,
    reportes: true,
    sistema: true
};
// =====================================================
// ELEMENTOS DE PREFERENCIAS
// =====================================================

const preferencesForm =
    document.getElementById("preferencesForm");

const preferenciaAnimacionesInput =
    document.getElementById(
        "preferenciaAnimaciones"
    );

const preferenciaMensajesInput =
    document.getElementById(
        "preferenciaMensajes"
    );

const paginaInicioPreferidaSelect =
    document.getElementById(
        "paginaInicioPreferida"
    );
    const paginaInicioCustom =
    document.getElementById(
        "paginaInicioCustom"
    );

const paginaInicioTrigger =
    document.getElementById(
        "paginaInicioTrigger"
    );

const paginaInicioTexto =
    document.getElementById(
        "paginaInicioTexto"
    );

const paginaInicioMenu =
    document.getElementById(
        "paginaInicioMenu"
    );

const paginaInicioOpciones =
    document.querySelectorAll(
        ".module-select-option"
    );

const guardarPreferenciasButton =
    document.getElementById(
        "guardarPreferencias"
    );

const restaurarPreferenciasButton =
    document.getElementById(
        "restaurarPreferencias"
    );

const preferencesSaveStatus =
    document.getElementById(
        "preferencesSaveStatus"
    );

const preferenciasInterfazPorDefecto = {
    animaciones: true,
    mensajes: true,
    paginaInicio: "Dashboard.html"
};

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

     const contenido =
    await respuesta.text();

let datosRespuesta = null;

if (contenido) {
    try {
        datosRespuesta =
            JSON.parse(contenido);
    } catch {
        datosRespuesta = contenido;
    }
}

if (!respuesta.ok) {
    const mensaje =
        datosRespuesta?.mensaje ||
        (
            typeof datosRespuesta === "string"
                ? datosRespuesta
                : `Error HTTP ${respuesta.status}`
        );

    throw new Error(mensaje);
}

return datosRespuesta;
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
// MENSAJES DE SEGURIDAD
// =====================================================

function mostrarEstadoSeguridad(
    mensaje,
    tipo = ""
) {
    if (!securitySaveStatus) {
        return;
    }

    securitySaveStatus.textContent =
        mensaje;

    securitySaveStatus.classList.remove(
        "success",
        "error"
    );

    if (tipo) {
        securitySaveStatus.classList.add(
            tipo
        );
    }
}

// =====================================================
// LIMPIAR ERRORES DE SEGURIDAD
// =====================================================

function limpiarErroresSeguridad() {
    if (errorContrasenaActual) {
        errorContrasenaActual.textContent = "";
    }

    if (errorNuevaContrasena) {
        errorNuevaContrasena.textContent = "";
    }

    if (errorConfirmarContrasena) {
        errorConfirmarContrasena.textContent = "";
    }

    contrasenaActualInput
        ?.closest(".settings-field")
        ?.classList.remove("has-error");

    nuevaContrasenaInput
        ?.closest(".settings-field")
        ?.classList.remove("has-error");

    confirmarContrasenaInput
        ?.closest(".settings-field")
        ?.classList.remove("has-error");
}

// =====================================================
// MOSTRAR ERROR DE SEGURIDAD
// =====================================================

function mostrarErrorSeguridad(
    input,
    elementoError,
    mensaje
) {
    if (elementoError) {
        elementoError.textContent =
            mensaje;
    }

    input
        ?.closest(".settings-field")
        ?.classList.add("has-error");
}

// =====================================================
// VALIDAR FORMULARIO DE SEGURIDAD
// =====================================================

function validarSeguridad() {
    limpiarErroresSeguridad();

    const actual =
        contrasenaActualInput?.value || "";

    const nueva =
        nuevaContrasenaInput?.value || "";

    const confirmacion =
        confirmarContrasenaInput?.value || "";

    let valido = true;

    if (!actual.trim()) {
        mostrarErrorSeguridad(
            contrasenaActualInput,
            errorContrasenaActual,
            "Ingresa tu contraseña actual."
        );

        valido = false;
    }

    if (!nueva) {
        mostrarErrorSeguridad(
            nuevaContrasenaInput,
            errorNuevaContrasena,
            "Ingresa una nueva contraseña."
        );

        valido = false;

    } else if (nueva.length < 8) {
        mostrarErrorSeguridad(
            nuevaContrasenaInput,
            errorNuevaContrasena,
            "Debe tener al menos 8 caracteres."
        );

        valido = false;

    } else if (nueva === actual) {
        mostrarErrorSeguridad(
            nuevaContrasenaInput,
            errorNuevaContrasena,
            "Debe ser diferente a la contraseña actual."
        );

        valido = false;
    }

    if (!confirmacion) {
        mostrarErrorSeguridad(
            confirmarContrasenaInput,
            errorConfirmarContrasena,
            "Confirma la nueva contraseña."
        );

        valido = false;

    } else if (confirmacion !== nueva) {
        mostrarErrorSeguridad(
            confirmarContrasenaInput,
            errorConfirmarContrasena,
            "Las contraseñas no coinciden."
        );

        valido = false;
    }

    return valido;
}

// =====================================================
// MOSTRAR U OCULTAR CONTRASEÑAS
// =====================================================

function restablecerVisibilidadContrasenas() {
    passwordVisibilityButtons.forEach(button => {
        const idInput =
            button.dataset.passwordTarget;

        const input =
            document.getElementById(idInput);

        if (input) {
            input.type = "password";
        }

        button.innerHTML = `
            <i data-lucide="eye"></i>
        `;

        button.setAttribute(
            "aria-label",
            "Mostrar contraseña"
        );

        button.title =
            "Mostrar contraseña";
    });

    renderIcons();
}

passwordVisibilityButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            const idInput =
                button.dataset.passwordTarget;

            const input =
                document.getElementById(idInput);

            if (!input) {
                return;
            }

            const estaVisible =
                input.type === "text";

            input.type =
                estaVisible
                    ? "password"
                    : "text";

            button.innerHTML = estaVisible
                ? `<i data-lucide="eye"></i>`
                : `<i data-lucide="eye-off"></i>`;

            button.setAttribute(
                "aria-label",
                estaVisible
                    ? "Mostrar contraseña"
                    : "Ocultar contraseña"
            );

            button.title =
                estaVisible
                    ? "Mostrar contraseña"
                    : "Ocultar contraseña";

            renderIcons();
        }
    );
});

// =====================================================
// LIMPIAR FORMULARIO DE SEGURIDAD
// =====================================================

limpiarSeguridadButton?.addEventListener(
    "click",
    () => {
        limpiarErroresSeguridad();
        mostrarEstadoSeguridad("");

        setTimeout(
            restablecerVisibilidadContrasenas,
            0
        );
    }
);

// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================

securityForm?.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        if (!validarSeguridad()) {
            mostrarEstadoSeguridad(
                "Revisa los campos indicados.",
                "error"
            );

            return;
        }

        const datos = {
            contrasenaActual:
                contrasenaActualInput.value,

            nuevaContrasena:
                nuevaContrasenaInput.value,

            confirmarContrasena:
                confirmarContrasenaInput.value
        };

        try {
            guardarSeguridadButton.disabled =
                true;

            guardarSeguridadButton.innerHTML = `
                <i data-lucide="loader-circle"></i>
                Actualizando...
            `;

            renderIcons();

            mostrarEstadoSeguridad(
                "Verificando contraseña..."
            );

            const respuesta =
                await realizarPeticion(
                    `${API_BASE_URL}/Auth/cambiar-password-perfil`,
                    {
                        method: "POST",
                        body: JSON.stringify(datos)
                    }
                );

            securityForm.reset();
            limpiarErroresSeguridad();
            restablecerVisibilidadContrasenas();

            mostrarEstadoSeguridad(
                respuesta?.mensaje ||
                "Contraseña actualizada correctamente.",
                "success"
            );

        } catch (error) {
            console.error(
                "No se pudo actualizar la contraseña:",
                error
            );

            mostrarEstadoSeguridad(
                error.message ||
                "No se pudo actualizar la contraseña.",
                "error"
            );

        } finally {
            guardarSeguridadButton.disabled =
                false;

            guardarSeguridadButton.innerHTML = `
                <i data-lucide="shield-check"></i>
                Actualizar contraseña
            `;

            renderIcons();
        }
    }
);
// =====================================================
// CLAVE DE PREFERENCIAS DE NOTIFICACIONES
// =====================================================

function obtenerClaveNotificaciones() {
    const usuario =
        localStorage.getItem("idUsuario") ||
        localStorage.getItem("correo") ||
        "general";

    return `tecnosula_notificaciones_${usuario}`;
}

// =====================================================
// MENSAJES DE NOTIFICACIONES
// =====================================================

function mostrarEstadoNotificaciones(
    mensaje,
    tipo = ""
) {
    if (!notificationsSaveStatus) {
        return;
    }

    notificationsSaveStatus.textContent =
        mensaje;

    notificationsSaveStatus.classList.remove(
        "success",
        "error"
    );

    if (tipo) {
        notificationsSaveStatus.classList.add(
            tipo
        );
    }
}

// =====================================================
// LEER PREFERENCIAS GUARDADAS
// =====================================================

function leerPreferenciasNotificaciones() {
    const clave =
        obtenerClaveNotificaciones();

    const preferenciasGuardadas =
        localStorage.getItem(clave);

    if (!preferenciasGuardadas) {
        return {
            ...preferenciasNotificacionesPorDefecto
        };
    }

    try {
        const preferencias =
            JSON.parse(preferenciasGuardadas);

        return {
            ...preferenciasNotificacionesPorDefecto,
            ...preferencias
        };

    } catch (error) {
        console.error(
            "No se pudieron leer las preferencias:",
            error
        );

        return {
            ...preferenciasNotificacionesPorDefecto
        };
    }
}

// =====================================================
// MOSTRAR PREFERENCIAS EN LOS INTERRUPTORES
// =====================================================

function aplicarPreferenciasNotificaciones(
    preferencias
) {
    if (notificarCampanasInput) {
        notificarCampanasInput.checked =
            preferencias.campanas;
    }

    if (notificarPublicacionesInput) {
        notificarPublicacionesInput.checked =
            preferencias.publicaciones;
    }

    if (notificarReportesInput) {
        notificarReportesInput.checked =
            preferencias.reportes;
    }

    if (notificarSistemaInput) {
        notificarSistemaInput.checked =
            preferencias.sistema;
    }
}

// =====================================================
// OBTENER PREFERENCIAS DEL FORMULARIO
// =====================================================

function obtenerPreferenciasFormulario() {
    return {
        campanas:
            Boolean(notificarCampanasInput?.checked),

        publicaciones:
            Boolean(notificarPublicacionesInput?.checked),

        reportes:
            Boolean(notificarReportesInput?.checked),

        sistema:
            Boolean(notificarSistemaInput?.checked)
    };
}

// =====================================================
// GUARDAR PREFERENCIAS
// =====================================================

function guardarPreferenciasNotificaciones(
    preferencias
) {
    const clave =
        obtenerClaveNotificaciones();

    localStorage.setItem(
        clave,
        JSON.stringify(preferencias)
    );

    localStorage.setItem(
        "tecnosula_notificaciones_activas",
        JSON.stringify(preferencias)
    );

    window.dispatchEvent(
        new CustomEvent(
            "tecnosula:preferencias-notificaciones",
            {
                detail: preferencias
            }
        )
    );
}

// =====================================================
// CARGAR PREFERENCIAS
// =====================================================

function cargarPreferenciasNotificaciones() {
    const preferencias =
        leerPreferenciasNotificaciones();

    aplicarPreferenciasNotificaciones(
        preferencias
    );

    guardarPreferenciasNotificaciones(
        preferencias
    );
}

// =====================================================
// DETECTAR CAMBIOS
// =====================================================

notificationInputs.forEach(input => {
    input.addEventListener(
        "change",
        () => {
            mostrarEstadoNotificaciones(
                "Tienes cambios pendientes por guardar."
            );
        }
    );
});

// =====================================================
// RESTAURAR NOTIFICACIONES
// =====================================================

restaurarNotificacionesButton?.addEventListener(
    "click",
    () => {
        const preferencias = {
            ...preferenciasNotificacionesPorDefecto
        };

        aplicarPreferenciasNotificaciones(
            preferencias
        );

        guardarPreferenciasNotificaciones(
            preferencias
        );

        mostrarEstadoNotificaciones(
            "Se restauraron las preferencias predeterminadas.",
            "success"
        );
    }
);

// =====================================================
// GUARDAR NOTIFICACIONES
// =====================================================

notificationsForm?.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const preferencias =
            obtenerPreferenciasFormulario();

        try {
            guardarNotificacionesButton.disabled =
                true;

            guardarNotificacionesButton.innerHTML = `
                <i data-lucide="loader-circle"></i>
                Guardando...
            `;

            renderIcons();

            guardarPreferenciasNotificaciones(
                preferencias
            );

            mostrarEstadoNotificaciones(
                "Preferencias guardadas correctamente.",
                "success"
            );

        } catch (error) {
            console.error(
                "No se pudieron guardar las preferencias:",
                error
            );

            mostrarEstadoNotificaciones(
                "No se pudieron guardar las preferencias.",
                "error"
            );

        } finally {
            guardarNotificacionesButton.disabled =
                false;

            guardarNotificacionesButton.innerHTML = `
                <i data-lucide="save"></i>
                Guardar preferencias
            `;

            renderIcons();
        }
    }
);

// =====================================================
// SELECTOR PERSONALIZADO DE PÁGINA INICIAL
// =====================================================

function cerrarSelectorPaginaInicio() {
    paginaInicioCustom?.classList.remove(
        "open"
    );

    paginaInicioTrigger?.setAttribute(
        "aria-expanded",
        "false"
    );
}

function abrirSelectorPaginaInicio() {
    paginaInicioCustom?.classList.add(
        "open"
    );

    paginaInicioTrigger?.setAttribute(
        "aria-expanded",
        "true"
    );
}

function actualizarSelectorPaginaInicio(
    valor,
    emitirCambio = false
) {
    const opcionSeleccionada =
        Array.from(paginaInicioOpciones)
            .find(
                opcion =>
                    opcion.dataset.value === valor
            );

    if (!opcionSeleccionada) {
        return;
    }

    const etiqueta =
        opcionSeleccionada.dataset.label ||
        "Inicio";

    const icono =
        opcionSeleccionada.dataset.icon ||
        "layout-dashboard";

    if (paginaInicioPreferidaSelect) {
        paginaInicioPreferidaSelect.value =
            valor;
    }

    if (paginaInicioTexto) {
        paginaInicioTexto.textContent =
            etiqueta;
    }

    const contenedorIcono =
        paginaInicioTrigger?.querySelector(
            ".module-select-trigger-icon"
        );

    if (contenedorIcono) {
        contenedorIcono.innerHTML = `
            <i data-lucide="${icono}"></i>
        `;
    }

    paginaInicioOpciones.forEach(opcion => {
        const seleccionada =
            opcion.dataset.value === valor;

        opcion.classList.toggle(
            "selected",
            seleccionada
        );

        opcion.setAttribute(
            "aria-selected",
            seleccionada
                ? "true"
                : "false"
        );
    });

    renderIcons();

    if (
        emitirCambio &&
        paginaInicioPreferidaSelect
    ) {
        paginaInicioPreferidaSelect.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );
    }
}

paginaInicioTrigger?.addEventListener(
    "click",
    event => {
        event.stopPropagation();

        const estaAbierto =
            paginaInicioCustom
                ?.classList
                .contains("open");

        if (estaAbierto) {
            cerrarSelectorPaginaInicio();
        } else {
            abrirSelectorPaginaInicio();
        }
    }
);

paginaInicioOpciones.forEach(opcion => {
    opcion.addEventListener(
        "click",
        () => {
            const valor =
                opcion.dataset.value;

            if (!valor) {
                return;
            }

            actualizarSelectorPaginaInicio(
                valor,
                true
            );

            cerrarSelectorPaginaInicio();

            paginaInicioTrigger?.focus();
        }
    );
});

document.addEventListener(
    "click",
    event => {
        if (
            paginaInicioCustom &&
            !paginaInicioCustom.contains(
                event.target
            )
        ) {
            cerrarSelectorPaginaInicio();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            cerrarSelectorPaginaInicio();
            paginaInicioTrigger?.focus();
        }
    }
);
// =====================================================
// CLAVE DE PREFERENCIAS DE INTERFAZ
// =====================================================

function obtenerClavePreferenciasInterfaz() {
    const usuario =
        localStorage.getItem("idUsuario") ||
        localStorage.getItem("correo") ||
        "general";

    return `tecnosula_preferencias_${usuario}`;
}

// =====================================================
// MENSAJES DE PREFERENCIAS
// =====================================================

function mostrarEstadoPreferencias(
    mensaje,
    tipo = ""
) {
    if (!preferencesSaveStatus) {
        return;
    }

    preferencesSaveStatus.textContent =
        mensaje;

    preferencesSaveStatus.classList.remove(
        "success",
        "error"
    );

    if (tipo) {
        preferencesSaveStatus.classList.add(
            tipo
        );
    }
}

// =====================================================
// LEER PREFERENCIAS GUARDADAS
// =====================================================

function leerPreferenciasInterfaz() {
    const clave =
        obtenerClavePreferenciasInterfaz();

    const preferenciasGuardadas =
        localStorage.getItem(clave);

    if (!preferenciasGuardadas) {
        return {
            ...preferenciasInterfazPorDefecto
        };
    }

    try {
        const preferencias =
            JSON.parse(preferenciasGuardadas);

        return {
            ...preferenciasInterfazPorDefecto,
            ...preferencias
        };

    } catch (error) {
        console.error(
            "No se pudieron leer las preferencias:",
            error
        );

        return {
            ...preferenciasInterfazPorDefecto
        };
    }
}

// =====================================================
// MOSTRAR PREFERENCIAS EN EL FORMULARIO
// =====================================================

function mostrarPreferenciasInterfaz(
    preferencias
) {
    if (preferenciaAnimacionesInput) {
        preferenciaAnimacionesInput.checked =
            preferencias.animaciones;
    }

    if (preferenciaMensajesInput) {
        preferenciaMensajesInput.checked =
            preferencias.mensajes;
    }

   if (paginaInicioPreferidaSelect) {
    paginaInicioPreferidaSelect.value =
        preferencias.paginaInicio;
}

actualizarSelectorPaginaInicio(
    preferencias.paginaInicio,
    false
);
}

// =====================================================
// APLICAR PREFERENCIAS VISUALES
// =====================================================

function aplicarPreferenciasInterfaz(
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

// =====================================================
// OBTENER PREFERENCIAS DEL FORMULARIO
// =====================================================

function obtenerPreferenciasInterfazFormulario() {
    return {
        animaciones:
            Boolean(
                preferenciaAnimacionesInput?.checked
            ),

        mensajes:
            Boolean(
                preferenciaMensajesInput?.checked
            ),

        paginaInicio:
            paginaInicioPreferidaSelect?.value ||
            "Dashboard.html"
    };
}

// =====================================================
// GUARDAR PREFERENCIAS
// =====================================================

function guardarPreferenciasInterfaz(
    preferencias
) {
    const clave =
        obtenerClavePreferenciasInterfaz();

    localStorage.setItem(
        clave,
        JSON.stringify(preferencias)
    );

    /*
       Esta segunda propiedad permite que otros módulos
       lean fácilmente las preferencias del usuario activo.
    */
    localStorage.setItem(
        "tecnosula_preferencias_activas",
        JSON.stringify(preferencias)
    );

    localStorage.setItem(
        "tecnosula_pagina_inicio",
        preferencias.paginaInicio
    );

    aplicarPreferenciasInterfaz(
        preferencias
    );

    window.dispatchEvent(
        new CustomEvent(
            "tecnosula:preferencias-interfaz",
            {
                detail: preferencias
            }
        )
    );
}

// =====================================================
// CARGAR PREFERENCIAS
// =====================================================

function cargarPreferenciasInterfaz() {
    const preferencias =
        leerPreferenciasInterfaz();

    mostrarPreferenciasInterfaz(
        preferencias
    );

    aplicarPreferenciasInterfaz(
        preferencias
    );

    localStorage.setItem(
        "tecnosula_preferencias_activas",
        JSON.stringify(preferencias)
    );

    localStorage.setItem(
        "tecnosula_pagina_inicio",
        preferencias.paginaInicio
    );
}

// =====================================================
// DETECTAR CAMBIOS
// =====================================================

preferenciaAnimacionesInput?.addEventListener(
    "change",
    () => {
        const preferencias =
            obtenerPreferenciasInterfazFormulario();

        /*
           Se aplica temporalmente para que el usuario
           pueda ver el cambio antes de guardar.
        */
        aplicarPreferenciasInterfaz(
            preferencias
        );

        mostrarEstadoPreferencias(
            "Tienes cambios pendientes por guardar."
        );
    }
);

preferenciaMensajesInput?.addEventListener(
    "change",
    () => {
        const preferencias =
            obtenerPreferenciasInterfazFormulario();

        aplicarPreferenciasInterfaz(
            preferencias
        );

        mostrarEstadoPreferencias(
            "Tienes cambios pendientes por guardar."
        );
    }
);

paginaInicioPreferidaSelect?.addEventListener(
    "change",
    () => {
        mostrarEstadoPreferencias(
            "Tienes cambios pendientes por guardar."
        );
    }
);

// =====================================================
// RESTAURAR PREFERENCIAS
// =====================================================

restaurarPreferenciasButton?.addEventListener(
    "click",
    () => {
        const preferencias = {
            ...preferenciasInterfazPorDefecto
        };

        mostrarPreferenciasInterfaz(
            preferencias
        );

        guardarPreferenciasInterfaz(
            preferencias
        );

        mostrarEstadoPreferencias(
            "Se restauraron las preferencias predeterminadas.",
            "success"
        );

        renderIcons();
    }
);

// =====================================================
// GUARDAR PREFERENCIAS
// =====================================================

preferencesForm?.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const preferencias =
            obtenerPreferenciasInterfazFormulario();

        try {
            guardarPreferenciasButton.disabled =
                true;

            guardarPreferenciasButton.innerHTML = `
                <i data-lucide="loader-circle"></i>
                Guardando...
            `;

            renderIcons();

            guardarPreferenciasInterfaz(
                preferencias
            );

            mostrarEstadoPreferencias(
                "Preferencias guardadas correctamente.",
                "success"
            );

        } catch (error) {
            console.error(
                "No se pudieron guardar las preferencias:",
                error
            );

            mostrarEstadoPreferencias(
                "No se pudieron guardar las preferencias.",
                "error"
            );

        } finally {
            guardarPreferenciasButton.disabled =
                false;

            guardarPreferenciasButton.innerHTML = `
                <i data-lucide="save"></i>
                Guardar preferencias
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
cargarPreferenciasNotificaciones();
cargarPreferenciasInterfaz();
renderIcons();
});