<p align="center">
    <a href="https://pf-frontend-silk.vercel.app/" target="blank" ><img src="https://res.cloudinary.com/dwhejzrua/image/upload/v1735167545/justDoItGym-logo-v2_oqthej.png" width="200" alt="Just Do It Logo"></a>
</p>

<h1 align="center">Just Do It - Gym management System 🏋️‍♂️💪</h1>

## Descripción 📋

`Just Do It - Gym management System` es una solución integral diseñada para gestionar las operaciones de un gimnasio. Este sistema proporciona funcionalidades para administrar usuarios, entrenadores, membresías, pagos, clases, reservas, asistencia y reseñas, ¡facilitando la gestión eficiente del negocio! 🚀

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

**1. Tabla `users` (Usuarios):**

- El campo `membership_id` está correctamente relacionado con el campo `id` de la tabla memberships.
- El campo `id` de users está relacionado correctamente con múltiples tablas:
  - `payments` (`user_id`): Relación entre usuarios y sus pagos.
  - `booked_classes` (`user_id`): Relación entre usuarios y las clases reservadas.
  - `attendance` (`user_id`): Relación entre usuarios y su asistencia.
  - `reviews` (`user_id`): Relación entre usuarios y las reseñas que escriben.

**2. Tabla `trainers` (Entrenadores):**

- El campo `user_id` de `trainers` está correctamente relacionado con el campo id de la tabla users, indicando que cada entrenador está vinculado a un usuario.

**3. Tabla `classes` (Clases):**

- El campo `trainer_id` está relacionado con el campo `id` de la tabla `trainers`, indicando qué entrenador imparte cada clase.
- El campo `id` de classes está relacionado correctamente con:
  - `booked_classes` (`class_id`): Relación entre las clases y las reservas realizadas.
  - `attendance` (`class_id`): Relación entre las clases y la asistencia registrada.
  - `reviews` (`class_id`): Relación entre las clases y las reseñas.

**4. Tabla payments (Pagos):**

- El campo `user_id` está relacionado con el campo `id` de la tabla `users`, indicando qué usuario realizó el pago.
- El campo `membership_id` está relacionado con el campo `id` de la tabla `memberships`, indicando qué membresía está asociada a cada pago.

**5. Tabla booked_classes (Clases Reservadas):**

- El campo `user_id` está relacionado con el campo `id` de la tabla `users`, indicando quién reservó la clase.
- El campo `class_id` está relacionado con el campo `id` de la tabla `classes`, indicando qué clase fue reservada.

**6. Tabla attendance (Asistencia):**

- El campo `user_id` está relacionado con el campo `id` de la tabla `users`, indicando quién asistió a la clase.
- El campo `class_id` está relacionado con el campo `id` de la tabla `classes`, indicando a qué clase asistieron.

**7. Tabla reviews (Reseñas):**

- El campo `user_id` está relacionado con el campo `id` de la tabla `users`, indicando quién escribió la reseña.
- El campo `class_id` está relacionado con el campo `id` de la tabla `classes`, indicando sobre qué clase trata la reseña.

<p align="center">
    <a href="https://pf-frontend-silk.vercel.app/" target="blank" ><img src="https://res.cloudinary.com/dwhejzrua/image/upload/v1735181728/JustDoIt-Gym-PF_viasuw.png" width="400" alt="Just Do It Logo"></a>
</p>

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
