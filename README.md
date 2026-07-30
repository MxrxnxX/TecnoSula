# TecnoSula

<p align="center">
  Plataforma web para la gestión centralizada de campañas de marketing, publicaciones, usuarios, reportes y actividades administrativas.
</p>

---

## Descripción del proyecto

**TecnoSula** es una plataforma web diseñada para facilitar la planificación, administración y seguimiento de campañas de marketing dentro de una organización.

El sistema centraliza en un solo entorno la gestión de campañas, publicaciones digitales, usuarios, notificaciones, reportes y configuraciones personales. Su propósito es mejorar el control de la información, reducir procesos manuales y ofrecer una experiencia organizada para los diferentes perfiles que participan en la operación.

La plataforma fue desarrollada bajo una arquitectura separada de frontend y backend, utilizando tecnologías web modernas, autenticación segura y una base de datos relacional.

---

## Problema que resuelve

En muchas organizaciones, la información relacionada con campañas, publicaciones, responsables, presupuestos y avances se administra mediante documentos independientes o herramientas no conectadas entre sí.

Esto puede provocar:

- Pérdida o duplicación de información.
- Falta de control sobre el progreso de las campañas.
- Dificultad para identificar responsables.
- Problemas para administrar usuarios y permisos.
- Poca visibilidad sobre resultados y actividades recientes.
- Falta de organización en la programación de publicaciones.

TecnoSula reúne estos procesos en una plataforma centralizada, permitiendo que cada usuario acceda únicamente a las herramientas correspondientes a su rol.

---

## Objetivo general

Desarrollar una plataforma web segura, organizada y fácil de utilizar que permita administrar campañas de marketing, publicaciones digitales, usuarios y reportes desde un sistema centralizado.

---

## Objetivos específicos

- Centralizar la información relacionada con campañas de marketing.
- Permitir el seguimiento del progreso, presupuesto y estado de cada campaña.
- Facilitar la creación y programación de publicaciones digitales.
- Administrar usuarios, roles y estados de cuenta.
- Proteger el acceso mediante autenticación y autorización por roles.
- Generar información útil para el análisis y la toma de decisiones.
- Ofrecer una interfaz moderna, responsive y consistente.
- Mantener informado al usuario mediante un centro de notificaciones.

---

## Módulos principales

### Autenticación y acceso

El sistema cuenta con un módulo de autenticación encargado de validar las credenciales y controlar el acceso a la plataforma.

Incluye:

- Inicio de sesión.
- Registro de usuarios.
- Autenticación mediante JWT.
- Contraseñas protegidas con BCrypt.
- Recuperación de contraseña por correo electrónico.
- Enlaces temporales de recuperación.
- Cambio de contraseña desde la configuración de la cuenta.
- Control de acceso según el rol del usuario.

---

### Panel principal

El dashboard funciona como punto de entrada al sistema y presenta una vista general de la actividad disponible para el usuario.

Permite acceder rápidamente a:

- Campañas.
- Publicaciones.
- Gestión de usuarios.
- Reportes.
- Notificaciones.
- Configuración personal.

La navegación y los módulos visibles cambian según los permisos del usuario autenticado.

---

### Gestión de campañas

Este módulo permite registrar y administrar las campañas de marketing de la organización.

Cada campaña puede incluir información como:

- Nombre.
- Descripción.
- Fecha de inicio.
- Fecha de finalización.
- Presupuesto.
- Responsable.
- Progreso.
- Estado.

El sistema permite crear, consultar, editar, filtrar y eliminar campañas.

También incorpora reglas de negocio, como la actualización automática del estado cuando una campaña alcanza el cien por ciento de progreso.

---

### Publicación y programación

El módulo de publicaciones permite organizar el contenido relacionado con las campañas de marketing.

Incluye funciones para:

- Crear publicaciones.
- Editar información.
- Asociar publicaciones con campañas.
- Seleccionar redes sociales.
- Programar fecha y hora de publicación.
- Administrar estados.
- Reagendar publicaciones.
- Cancelar programaciones.
- Duplicar contenido.

Este módulo busca facilitar la planificación digital y mantener organizada la estrategia de contenido.

---

### Gestión de usuarios

La gestión de usuarios está disponible únicamente para administradores.

Desde este módulo es posible:

- Consultar los usuarios registrados.
- Buscar usuarios por nombre o correo.
- Filtrar cuentas por estado.
- Registrar nuevos usuarios.
- Editar información personal.
- Asignar roles.
- Cambiar el estado de una cuenta.
- Desactivar usuarios.
- Visualizar el acceso disponible para cada perfil.

Las desactivaciones no eliminan la información del usuario. La cuenta permanece almacenada, pero pierde el acceso al sistema.

---

### Reportes

El módulo de reportes reúne información relevante para el análisis de las actividades registradas en TecnoSula.

Su propósito es facilitar la interpretación de datos relacionados con:

- Campañas.
- Presupuestos.
- Progreso.
- Estados.
- Publicaciones.
- Usuarios.
- Actividad general del sistema.

La información puede representarse mediante indicadores, tablas y elementos visuales orientados a la toma de decisiones.

---

### Centro de notificaciones

TecnoSula incorpora un sistema de notificaciones para informar al usuario sobre acciones importantes dentro de la plataforma.

Entre las actividades notificadas se encuentran:

- Creación de campañas.
- Actualización de información.
- Finalización de campañas.
- Registro de usuarios.
- Desactivación de cuentas.
- Creación o programación de publicaciones.
- Cambios administrativos.

Las notificaciones pueden marcarse como leídas y administrarse desde un panel integrado en la interfaz.

---

### Configuración

El módulo de configuración permite que cada usuario administre su experiencia dentro de TecnoSula.

Está dividido en las siguientes secciones:

- Mi perfil.
- Seguridad.
- Notificaciones.
- Preferencias.
- Sistema.

Desde esta área se puede actualizar información personal, cambiar la contraseña, seleccionar los avisos que se desean recibir y personalizar aspectos de la interfaz.

Las opciones administrativas del sistema se muestran únicamente a usuarios con el rol correspondiente.

---

## Roles del sistema

TecnoSula utiliza autorización basada en roles para definir las acciones disponibles para cada usuario.

### Administrador

Tiene control completo sobre la plataforma.

Puede:

- Gestionar campañas.
- Administrar publicaciones.
- Consultar reportes.
- Registrar y editar usuarios.
- Asignar roles.
- Activar o desactivar cuentas.
- Acceder a opciones administrativas.

### Empleado

Participa en la gestión operativa del sistema.

Puede acceder a los módulos necesarios para administrar campañas, publicaciones y actividades relacionadas con su trabajo.

### Cliente

Cuenta con un acceso más limitado, orientado a la consulta de información y a las funciones habilitadas para su perfil.

---

## Arquitectura del sistema

TecnoSula utiliza una arquitectura cliente-servidor.

### Frontend

La interfaz fue desarrollada con:

- HTML5.
- CSS3.
- JavaScript.
- Lucide Icons.
- Flatpickr.

El frontend se encarga de presentar la información, validar interacciones y comunicarse con la API.

### Backend

La lógica del sistema fue desarrollada con:

- ASP.NET Core.
- C#.
- Entity Framework Core.
- API REST.
- JWT Bearer Authentication.
- BCrypt.
- MailKit.
- Swagger.

El backend procesa las solicitudes, aplica las reglas de negocio, controla la seguridad y administra la comunicación con la base de datos.

### Base de datos

El sistema utiliza SQL Server y una base de datos llamada:

```text
TecnoSula
