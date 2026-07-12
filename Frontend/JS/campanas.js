async function cargarCampanas() {

    const contenedor = document.getElementById("listaCampanas");

    try {

        const response = await fetch(`${API_URL}/Campanas`, {

            method: "GET",

            headers: {

                "Content-Type": "application/json"

            }

        });

        const data = await response.json();

        if (!response.ok) {

            contenedor.innerHTML = `<p>${data.mensaje || "Error al cargar campañas"}</p>`;

            return;

        }

        if (data.length === 0) {

            contenedor.innerHTML = "<p>No hay campañas registradas.</p>";

            return;

        }

        let html = "";

        data.forEach(campana => {

            html += `
                <div class="campana-item">
                    <strong>${campana.nombre}</strong>
                    <span class="estado-badge">${campana.estado}</span>
                    <p>${campana.descripcion || ""}</p>
                    <small>Responsable: ${campana.responsable}</small>
                </div>
            `;

        });

        contenedor.innerHTML = html;

    } catch (error) {

        console.error(error);

        contenedor.innerHTML = "<p>No se pudo conectar con el servidor.</p>";

    }

}

cargarCampanas();