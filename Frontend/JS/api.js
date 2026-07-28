"use strict";

// =====================================================
// CONFIGURACIÓN GENERAL DE LA API
// =====================================================

const API_URL = "http://localhost:5208/api";

// También lo exponemos globalmente por compatibilidad.
window.API_URL = API_URL;


// =====================================================
// TOKEN JWT
// =====================================================

function obtenerToken() {
    return localStorage.getItem("token");
}


// =====================================================
// CREAR PARÁMETROS DE CONSULTA
// =====================================================

function crearParametrosConsulta(parametros = {}) {
    const query = new URLSearchParams();

    Object.entries(parametros).forEach(
        ([clave, valor]) => {
            if (
                valor === undefined ||
                valor === null ||
                valor === ""
            ) {
                return;
            }

            query.append(clave, String(valor));
        }
    );

    const resultado = query.toString();

    return resultado
        ? `?${resultado}`
        : "";
}


// =====================================================
// OBTENER MENSAJE DE ERROR DEL BACKEND
// =====================================================

function obtenerMensajeError(data, status) {
    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.mensaje) {
        return data.mensaje;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.errors) {
        const mensajes =
            Object.values(data.errors)
                .flat()
                .filter(Boolean);

        if (mensajes.length > 0) {
            return mensajes.join(" ");
        }
    }

    return `La solicitud no pudo completarse. Código ${status}.`;
}


// =====================================================
// SOLICITUD GENERAL
// =====================================================

async function apiRequest(
    endpoint,
    options = {}
) {
    const token = obtenerToken();

    const headers =
        new Headers(options.headers || {});

    headers.set(
        "Accept",
        "application/json"
    );

    const tieneCuerpo =
        options.body !== undefined &&
        options.body !== null;

    const esFormData =
        typeof FormData !== "undefined" &&
        options.body instanceof FormData;

    if (
        tieneCuerpo &&
        !esFormData &&
        !headers.has("Content-Type")
    ) {
        headers.set(
            "Content-Type",
            "application/json"
        );
    }

    if (
        token &&
        !headers.has("Authorization")
    ) {
        headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    const ruta =
        endpoint.startsWith("/")
            ? endpoint
            : `/${endpoint}`;

    let response;

    try {
        response = await fetch(
            `${API_URL}${ruta}`,
            {
                ...options,
                headers
            }
        );
    } catch (error) {
        console.error(
            "Error de conexión con la API:",
            error
        );

        throw new Error(
            "No fue posible conectar con el servidor. Verifica que el backend esté ejecutándose."
        );
    }

    let data = null;

    if (response.status !== 204) {
        const contentType =
            response.headers.get(
                "content-type"
            ) || "";

        try {
            if (
                contentType.includes(
                    "application/json"
                )
            ) {
                data = await response.json();
            } else {
                data = await response.text();
            }
        } catch (error) {
            console.error(
                "No se pudo interpretar la respuesta:",
                error
            );
        }
    }

    if (!response.ok) {
        const apiError =
            new Error(
                obtenerMensajeError(
                    data,
                    response.status
                )
            );

        apiError.status =
            response.status;

        apiError.data =
            data;

        throw apiError;
    }

    return data;
}


// =====================================================
// PUBLICACIONES
// =====================================================

async function obtenerPublicaciones(
    filtros = {}
) {
    const query =
        crearParametrosConsulta({
            idCampana:
                filtros.idCampana,

            estado:
                filtros.estado,

            idRedSocial:
                filtros.idRedSocial,

            buscar:
                filtros.buscar,

            fechaDesde:
                filtros.fechaDesde,

            fechaHasta:
                filtros.fechaHasta
        });

    return await apiRequest(
        `/Publicaciones${query}`,
        {
            method: "GET"
        }
    );
}


async function obtenerPublicacionPorId(id) {
    return await apiRequest(
        `/Publicaciones/${id}`,
        {
            method: "GET"
        }
    );
}


async function crearPublicacion(
    publicacion
) {
    return await apiRequest(
        "/Publicaciones",
        {
            method: "POST",

            body: JSON.stringify(
                publicacion
            )
        }
    );
}


async function actualizarPublicacion(
    id,
    publicacion
) {
    return await apiRequest(
        `/Publicaciones/${id}`,
        {
            method: "PUT",

            body: JSON.stringify(
                publicacion
            )
        }
    );
}


async function eliminarPublicacion(id) {
    return await apiRequest(
        `/Publicaciones/${id}`,
        {
            method: "DELETE"
        }
    );
}


async function programarPublicacion(
    id,
    fechaProgramacion
) {
    return await apiRequest(
        `/Publicaciones/${id}/programar`,
        {
            method: "PATCH",

            body: JSON.stringify({
                fechaProgramacion
            })
        }
    );
}


async function cancelarPublicacion(id) {
    return await apiRequest(
        `/Publicaciones/${id}/cancelar`,
        {
            method: "PATCH"
        }
    );
}


async function reagendarPublicacion(
    id,
    fechaProgramacion
) {
    return await apiRequest(
        `/Publicaciones/${id}/reagendar`,
        {
            method: "PATCH",

            body: JSON.stringify({
                fechaProgramacion
            })
        }
    );
}


async function duplicarPublicacion(
    id,
    titulo = null
) {
    const body =
        titulo?.trim()
            ? {
                titulo: titulo.trim()
            }
            : {};

    return await apiRequest(
        `/Publicaciones/${id}/duplicar`,
        {
            method: "POST",

            body: JSON.stringify(body)
        }
    );
}


// =====================================================
// REDES SOCIALES
// =====================================================

async function obtenerRedesSociales() {
    return await apiRequest(
        "/Publicaciones/redes-sociales",
        {
            method: "GET"
        }
    );
}


// =====================================================
// CAMPAÑAS
// =====================================================

async function obtenerCampanas() {
    return await apiRequest(
        "/Campanas",
        {
            method: "GET"
        }
    );
}


// =====================================================
// EXPONER FUNCIONES PARA LOS DEMÁS ARCHIVOS JS
// =====================================================

window.TecnoSulaApi = {
    request:
        apiRequest,

    publicaciones: {
        obtenerTodas:
            obtenerPublicaciones,

        obtenerPorId:
            obtenerPublicacionPorId,

        crear:
            crearPublicacion,

        actualizar:
            actualizarPublicacion,

        eliminar:
            eliminarPublicacion,

        programar:
            programarPublicacion,

        cancelar:
            cancelarPublicacion,

        reagendar:
            reagendarPublicacion,

        duplicar:
            duplicarPublicacion
    },

    redesSociales: {
        obtenerTodas:
            obtenerRedesSociales
    },

    campanas: {
        obtenerTodas:
            obtenerCampanas
    }
};