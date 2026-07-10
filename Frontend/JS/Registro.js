const form = document.getElementById("registerForm");


form.addEventListener("submit", async (e) => {


    e.preventDefault();



    const usuario = {


        nombre: document.getElementById("nombre").value,


        apellido: document.getElementById("apellido").value,


        correo: document.getElementById("correo").value,


        telefono: document.getElementById("telefono").value,


        contrasena: document.getElementById("contrasena").value


    };




    try {


        const response = await fetch(
           "http://localhost:5208/api/Auth/register",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify(usuario)

            }
        );





        const data = await response.json();





        if(response.ok){


            document.getElementById("mensaje").innerHTML =
            "Usuario creado correctamente";


            setTimeout(()=>{


                window.location.href="index.html";


            },2000);



        }else{


            document.getElementById("mensaje").innerHTML =
            data.mensaje || "Error al crear usuario";


        }



    }catch(error){


        console.error(error);


        document.getElementById("mensaje").innerHTML =
        "No se pudo conectar con el servidor";


    }



});