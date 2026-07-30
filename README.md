TecnoSula

Sistema web para la gestión de campañas de marketing, publicaciones, usuarios, reportes y configuraciones internas.

TecnoSula fue desarrollado como una plataforma administrativa que permite centralizar el trabajo de campañas, controlar el acceso por roles, programar publicaciones, consultar métricas y administrar la cuenta de cada usuario desde una interfaz moderna y responsive.

Funcionalidades principales

Inicio de sesión con autenticación mediante JWT.

Registro de nuevos usuarios.

Recuperación de contraseña por correo electrónico.

Cambio de contraseña desde el módulo de configuración.

Gestión de campañas de marketing.

Control de progreso, presupuesto, estado y responsable de cada campaña.

Publicación y programación de contenido digital.

Gestión de usuarios disponible únicamente para administradores.

Asignación de roles: Administrador, Empleado y Cliente.

Activación y desactivación de cuentas.

Reportes y visualización de métricas.

Centro de notificaciones.

Preferencias de interfaz por usuario.

Diseño responsive para computadoras, tablets y teléfonos.

Tecnologías utilizadas

Backend

ASP.NET Core 10

C#

Entity Framework Core

SQL Server

JWT Bearer Authentication

BCrypt.Net-Next

MailKit

Swagger / OpenAPI

Frontend

HTML5

CSS3

JavaScript

Lucide Icons

Flatpickr

Herramientas

Visual Studio Code

SQL Server Management Studio

Git

GitHub

Arquitectura general

TecnoSula
├── Backend
│   ├── Controllers
│   ├── Data
│   ├── DTOs
│   ├── Models
│   ├── Services
│   ├── Program.cs
│   └── appsettings.json
│
└── Frontend
    ├── Css
    ├── JS
    ├── index.html
    ├── Registro.html
    ├── Dashboard.html
    ├── campanas.html
    ├── publicaciones.html
    ├── usuarios.html
    ├── reportes.html
    ├── configuracion.html
    ├── recuperar.html
    └── contrasenaNueva.html

Requisitos previos

Antes de ejecutar el proyecto debes tener instalado:

.NET SDK 10

SQL Server

SQL Server Management Studio

Visual Studio Code o Visual Studio

Extensión Live Server para Visual Studio Code

Git

Configuración de la base de datos

La base de datos utilizada por el proyecto se llama:

TecnoSula

Las tablas principales son:

Usuarios

Roles

Campanas

RecuperacionPassword

Tablas relacionadas con publicaciones, redes sociales y reportes

Los roles requeridos por el sistema son:

Administrador
Empleado
Cliente

Después de crear la base de datos, configura la cadena de conexión en:

Backend/appsettings.json

Ejemplo:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=TU_SERVIDOR;Database=TecnoSula;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

Cambia TU_SERVIDOR por el nombre de tu instancia de SQL Server.

Configuración de JWT

En Backend/appsettings.json agrega o verifica la configuración de JWT:

{
  "Jwt": {
    "Key": "TU_CLAVE_SECRETA_SEGURA",
    "Issuer": "TecnoSulaAPI",
    "Audience": "TecnoSulaUsers"
  }
}

La clave debe ser privada y suficientemente larga.

Configuración del correo electrónico

La recuperación de contraseña utiliza MailKit para enviar el enlace de recuperación.

Debes configurar las credenciales SMTP en appsettings.json según la estructura utilizada por tu servicio de correo.

Ejemplo:

{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "SenderName": "TecnoSula",
    "SenderEmail": "tu-correo@gmail.com",
    "Username": "tu-correo@gmail.com",
    "Password": "TU_CONTRASENA_DE_APLICACION"
  }
}

No publiques contraseñas, tokens ni claves privadas en GitHub.

Para Gmail se recomienda utilizar una contraseña de aplicación.

Ejecución del backend

Abre una terminal dentro de la carpeta Backend y ejecuta:

dotnet restore
dotnet run

Por defecto, la API se ejecuta en:

http://localhost:5208

Swagger estará disponible en:

http://localhost:5208/swagger

Ejecución del frontend

Abre la carpeta del proyecto en Visual Studio Code.

Localiza Frontend/index.html.

Haz clic derecho sobre el archivo.

Selecciona Open with Live Server.

La dirección puede verse similar a:

http://127.0.0.1:5500/TecnoSula/Frontend/index.html

El backend debe permanecer ejecutándose mientras utilizas el frontend.

Recuperación de contraseña

El flujo funciona de la siguiente manera:

El usuario ingresa su correo en recuperar.html.

El backend genera un token temporal.

El token se guarda en la base de datos con una expiración de 30 minutos.

Se envía un enlace al correo del usuario.

El enlace abre contrasenaNueva.html.

El usuario establece una nueva contraseña.

La contraseña se cifra con BCrypt.

El token queda marcado como utilizado.

La ruta generada en AuthController.cs debe coincidir con la dirección real utilizada por Live Server.

Ejemplo:

var enlace =
    $"http://127.0.0.1:5500/TecnoSula/Frontend/contrasenaNueva.html?token={token}";

Si cambia la estructura de carpetas o el puerto de Live Server, también debes actualizar esta dirección.

Roles y permisos

Administrador

Acceso completo al sistema.

Gestión de usuarios.

Creación y edición de usuarios.

Cambio de roles y estados.

Acceso a configuración del sistema.

Consulta de campañas, publicaciones y reportes.

Empleado

Gestión de campañas y publicaciones según los permisos asignados.

Acceso a reportes y configuración personal.

Sin acceso al módulo de gestión de usuarios.

Cliente

Acceso limitado a las funciones habilitadas para su rol.

Sin acceso a las funciones administrativas.

Los permisos se validan tanto en el backend como en la interfaz.

Endpoints principales

Autenticación

POST /api/Auth/login
POST /api/Auth/register
POST /api/Auth/recuperar
POST /api/Auth/cambiar-password
POST /api/Auth/cambiar-password-perfil
GET  /api/Auth/perfil

Usuarios

GET    /api/Usuarios
GET    /api/Usuarios/{id}
POST   /api/Usuarios
PUT    /api/Usuarios/{id}
DELETE /api/Usuarios/{id}

Campañas

GET    /api/Campanas
GET    /api/Campanas/{id}
POST   /api/Campanas
PUT    /api/Campanas/{id}
DELETE /api/Campanas/{id}

Publicaciones

GET    /api/Publicaciones
GET    /api/Publicaciones/{id}
POST   /api/Publicaciones
PUT    /api/Publicaciones/{id}
DELETE /api/Publicaciones/{id}
PATCH  /api/Publicaciones/{id}/programar
PATCH  /api/Publicaciones/{id}/cancelar
PATCH  /api/Publicaciones/{id}/reagendar
POST   /api/Publicaciones/{id}/duplicar

Seguridad

TecnoSula implementa las siguientes medidas:

Contraseñas cifradas mediante BCrypt.

Tokens JWT para autenticación.

Autorización por roles.

Protección de endpoints administrativos.

Tokens temporales de recuperación.

Expiración y uso único de enlaces de recuperación.

Validaciones en frontend y backend.

Ocultamiento de módulos no autorizados.

Uso con Git

Para clonar el proyecto:

git clone URL_DEL_REPOSITORIO
cd TecnoSula

Para descargar cambios recientes:

git pull origin master

Para guardar cambios:

git add .
git commit -m "Descripción de los cambios"
git push origin master

Antes de publicar el repositorio, verifica que no se incluyan:

Contraseñas de correo.

Authtokens.

Claves JWT reales.

Credenciales de SQL Server.

Archivos con información sensible.

Estado del proyecto

El proyecto cuenta con los módulos principales integrados y funcionales:

Autenticación

Recuperación de contraseña

Campañas

Publicaciones

Gestión de usuarios

Reportes

Configuración

Notificaciones

Roles y permisos

Actualmente está preparado para ejecución local y puede adaptarse posteriormente para su publicación en un servidor.

Autor

Oscar Estiff Moreno ZúñigaEstudiante de Ingeniería en SistemasUniversidad Latina, Sede Santa Cruz

GitHub: MxrxnxX

Proyecto: TecnoSula

Licencia

Este proyecto fue desarrollado con fines académicos y de portafolio.

El uso, modificación o distribución debe contar con la autorización de su autor y respetar las condiciones definidas para el proyecto.

