![JustDoIt-Gym-Logo](/src/assets/justDoItGym-logo-v2.png){: width="972" height="589" .w-50 .right}

<div style="text-align: center;">
  <img src="/src/assets//justDoItGym-logo-v2.png" alt="Example Image" width="400" />
</div>
# Gym Management System 🏋️‍♂️💪

## Descripción 📋

El `Gym Management System` es una solución integral diseñada para gestionar las operaciones de un gimnasio. Este sistema proporciona funcionalidades para administrar usuarios, entrenadores, membresías, pagos, clases, reservas, asistencia y reseñas, ¡facilitando la gestión eficiente del negocio! 🚀

## Características Principales 🌟

- Gestión de usuarios: Registro, actualización y eliminación de usuarios. 👤
- Control de entrenadores: Asignación y gestión de entrenadores. 🧑‍🏫
- Membresías: Creación y manejo de planes de membresía con diferentes precios y duraciones. 💳
- Pagos: Registro de pagos realizados por los usuarios. 💵
- Clases: Administración de clases, incluyendo horarios y entrenadores asignados. 📅
- Reservas: Funcionalidad para que los usuarios reserven clases. 📲
- Asistencia: Registro de asistencia a las clases reservadas. ✅
- Reseñas: Los usuarios pueden calificar y dejar comentarios sobre sus experiencias. 🌟

## Tecnologías Utilizadas 🛠️

- Backend:
  - Lenguaje: TypeScript
  - Framework: NestJS
  - Base de datos: PostgreSQL
  - ORM: TypeORM
- Documentación:
  - Swagger para documentación de API 📝

## Estructura de la Base de Datos 🗄️

La base de datos está compuesta por las siguientes tablas:

## Tablas Principales 📊

**1. users:**

- Información de los usuarios, incluyendo datos personales y roles (cliente, administrador). 👥

**2. trainers:**

- Información sobre los entrenadores registrados. 🏋️‍♀️

**3. memberships:**

- Planes de membresía con atributos como precio, duración y beneficios. 🏷️

**4. payments:**

- Detalles de los pagos realizados, vinculados a usuarios y membresías. 💸

**5. classes:**

- Información sobre las clases disponibles, incluyendo horarios y entrenadores asignados. ⏰

**6. booked_classes:**

- Clases reservadas por los usuarios. 📝

**7. attendance:**

- Registro de asistencia de los usuarios a las clases reservadas. 🛎️

**8. reviews:**

- Reseñas y calificaciones dadas por los usuarios. ⭐

## Relaciones 🔗

- users tiene una relación uno a muchos con payments, booked_classes, reviews.
- trainers tiene una relación uno a muchos con classes.
- classes tiene una relación uno a muchos con booked_classes y attendance.
- memberships tiene una relación uno a muchos con payments.

## Instalación y Configuración ⚙️

### Prerrequisitos 📝

- Node.js (v16 o superior)
- PostgreSQL (v13 o superior)
- Yarn o npm

## Pasos 🚀

1. Clonar el repositorio:

```
$ git clone https://github.com/usuario/gym-management-system.git

$ cd gym-management-system
```

2. Instalar dependencias:

```
$ npm install
# o
$ yarn install
```

3. Configurar las variables de entorno:

- Crear un archivo `.development.env` en el directorio raíz con el siguiente contenido:

  ```
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_USER=tu_usuario
  DATABASE_PASSWORD=tu_contraseña
  DATABASE_NAME=gym_management
  JWT_SECRET=tu_secreto
  ```

4. Ejecutar migraciones:

```
npm run migration:run
# o
yarn migration:run
```

5. Iniciar el servidor:

```
npm run start:dev
# o
yarn start:dev
```

El servidor estará disponible en `http://localhost:3000` 🌐.

## Documentación de la API 📖

La documentación de la API está disponible en:

```
http://localhost:3000/api
```

## Funcionalidades del Sistema 🏗️

### Usuarios 👥

- Registro de usuarios.
- Gestión de perfiles.

### Entrenadores 🧑‍🏫

- Asignación de entrenadores a clases.
- Actualización de información de los entrenadores.

### Membresías 🏷️

- Creación de planes de membresía.
- Registro de pagos vinculados a membresías.

### Clases 📅

- Gestión de horarios.
- Reservas por parte de los usuarios.

### Asistencia ✅

- Registro de asistencia a clases.

### Reseñas 🌟

- Envío de reseñas y calificaciones por parte de los usuarios.

## Funcionalidades adicionales 🚀

- Panel de administración con interfaz gráfica. 🖥️
- Integración con pasarelas de pago. 💳
- Notificaciones por correo electrónico o SMS. ✉️

## Contribuciones 🤝

Si deseas contribuir, por favor sigue estos pasos:

**1. Crea un fork del repositorio.**

**2. Crea una rama para tus cambios:**

    git checkout -b feature/nueva-funcionalidad

**3. Realiza los cambios y commitea:**

**4. Haz un push a tu rama y crea un Pull Request.**

## Licencia 📜

Este proyecto está licenciado bajo la [MIT License](https://opensource.org/license/mit).
