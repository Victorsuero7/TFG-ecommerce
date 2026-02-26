# TFG E-commerce

## Descripción General

TFG E-commerce es una plataforma web de comercio electrónico desarrollada como Trabajo de Fin de Grado. El proyecto está compuesto por un backend en Node.js/TypeScript y un frontend en Angular, permitiendo la gestión integral de productos, usuarios, inventario, ventas y movimientos de stock.

La arquitectura sigue principios profesionales, separando responsabilidades en capas y garantizando escalabilidad, mantenibilidad y seguridad.

---

## Estructura del Proyecto

```
TFG-ecommerce/
├── backend/                # API REST, lógica de negocio y acceso a datos
│   └── src/
│       ├── app.ts
│       ├── config/
│       ├── controllers/
│       ├── Models/
│       ├── repositories/
│       ├── services/
│       ├── routes/
│       ├── utils/
│       └── test/
├── ecommerce-app-front/    # Aplicación Angular (cliente)
│   └── src/
│       ├── app/
│       ├── models/
│       ├── pages/
│       ├── services/
│       └── environments/
└── README.md               # Documentación general
```

---

## Tecnologías Utilizadas

### Backend
- **Node.js** + **TypeScript**
- **Express.js** (API REST)
- **TypeORM** (ORM para MySQL)
- **MySQL2** (driver de base de datos)
- **JWT** (autenticación)
- **CORS** (comunicación frontend-backend)
- **Biome** (linting y formateo)

### Frontend
- **Angular** (SPA moderna)
- **TypeScript**
- **Angular Material** (UI)
- **RxJS** (reactividad)

---

## Diseño de la Base de Datos

La base de datos se diseñó siguiendo un modelo relacional normalizado en MySQL. Incluye tablas para productos, categorías, usuarios, direcciones, carritos, pedidos, movimientos de stock y pagos. Las relaciones entre tablas garantizan integridad referencial y permiten consultas eficientes.

Principales entidades:
- **Users**: Información de usuarios
- **Products**: Catálogo de productos
- **Categories**: Clasificación de productos
- **Movements**: Movimientos de inventario

- **Pays**: Pagos asociados a pedidos
- **Orders**: Pedidos realizados
- **Cart**: Carrito de compra

---

## Arquitectura y Componentes

### Backend
- **Config**: Variables de entorno y conexión a MySQL
- **Controllers**: Manejo de solicitudes HTTP
- **Services**: Lógica de negocio y validaciones
- **Repositories**: Acceso a datos con TypeORM
- **Models**: Entidades de base de datos
- **Routes**: Definición de endpoints REST
- **Utils**: Manejo de errores, logging, validaciones

### Frontend
- **Pages**: Vistas principales (dashboard, login, registro, listado, detalle, edición)
- **Components**: Elementos reutilizables (navbar, formularios, tablas)
- **Services**: Comunicación con backend y gestión de estado
- **Models**: Tipos y estructuras de datos

---

## Instalación y Puesta en Marcha

### Requisitos
- Node.js >= 18
- MySQL >= 8
- Angular CLI

### Backend
1. Accede a la carpeta `backend`
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` (basado en `.env.example`)
4. Inicia el servidor:
   ```bash
   npm run dev
   ```
   El backend estará disponible en `http://localhost:3000`

### Frontend
1. Accede a la carpeta `ecommerce-app-front`
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación Angular:
   ```bash
   ng serve
   ```
   El frontend estará disponible en `http://localhost:4200`

---

## Funcionalidades Principales

- Gestión de usuarios (registro, login, edición, eliminación)
- Gestión de productos y categorías (alta, baja, modificación, listado, detalle)
- Paginación y filtros avanzados
- Gestión de inventario y movimientos de stock
- Panel de administración
- Seguridad con JWT y roles
- Validaciones y manejo de errores

---

## Seguridad y Buenas Prácticas

- Autenticación y autorización con JWT
- Validación de datos en backend y frontend
- Manejo de errores centralizado
- Variables de entorno para configuración sensible
- Linting y formateo automático
- Separación de responsabilidades en capas

---

## Ampliaciones Futuras

- Desarrollo de compras y carrito.
- Integración con pasarelas de pago externas
- Notificaciones por email

---
