const token = localStorage.getItem("token");


if(!token){

    window.location.href = "index.html";

}



document
.getElementById("cerrarSesion")
.addEventListener("click",()=>{


    localStorage.removeItem("token");


    window.location.href="index.html";


});