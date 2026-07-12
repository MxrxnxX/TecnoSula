const loginForm = document.getElementById("loginForm");

const mensaje = document.getElementById("mensaje");


loginForm.addEventListener("submit", async function(event){

    event.preventDefault();


    const correo = document.getElementById("correo").value;

    const contrasena = document.getElementById("contrasena").value;



    try {


        const response = await fetch(`${API_URL}/Auth/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                correo: correo,

                contrasena: contrasena

            })

        });



        const data = await response.json();



        if(response.ok){


            // Guardamos el JWT

            localStorage.setItem(
                "token",
                data.token
            );

            // Guardamos el ID del usuario logueado
            localStorage.setItem(
                "idUsuario",
                data.idUsuario
            );


            mensaje.style.color = "green";

            mensaje.textContent =
            "Inicio de sesión correcto";


            setTimeout(()=>{

                window.location.href = "dashboard.html";

            },1000);



        }else{


            mensaje.style.color = "red";

            mensaje.textContent =
            data.message || "Credenciales incorrectas";


        }



    } catch(error){


        console.error(error);


        mensaje.style.color = "red";

        mensaje.textContent =
        "Error al conectar con el servidor";


    }


});