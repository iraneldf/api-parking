# 🚗 API Parking – Sistema de Gestión de Parqueos

API RESTful construida con [NestJS](https://nestjs.com/) para la gestión de un sistema de parqueo, incluyendo reservas, cancelaciones, consulta de ocupación, autenticación de usuarios y registro de logs.

---

## 📦 Instalación

Clona el repositorio e instala las dependencias:
```bash

git clone https://github.com/iraneldf/api-parking
cd api-parking
npm install
```
## 🐳 Levantar servicios con Docker (opcional)
Puedes usar Docker para iniciar los servicios de base de datos (PostgreSQL y MongoDB):
```bash

docker-compose up -d
```
## 🌱 Ejecutar seeders
Corre los seeders para poblar la base de datos con información inicial (usuarios, plazas, etc.):
```bash

npm run prisma:seed
```
## 🚀 Iniciar el proyecto
Puedes iniciar la API en diferentes modos:

```bash

# Modo desarrollo (con recarga automática)
npm run start:dev

# Modo producción
npm run start:prod

# Modo estándar
npm run start
```
# 🧪 Pruebas End-to-End (E2E)
Ejecuta las pruebas E2E con Jest:
```bash

npm run test:e2e
```

## ✅ Funcionalidades principales :


✅ Autenticación con JWT

✅ Gestión de usuarios con roles (cliente, admin, empleado)

✅ Crear, consultar y cancelar reservas de parqueo

✅ Consulta del estado de ocupación

✅ Persistencia de datos con PostgreSQL

✅ Logs de acciones en MongoDB

✅ Pruebas automáticas End-to-End

## 📁 Estructura del proyecto

```plaintext
src/
├── auth/             # Módulo de autenticación y usuarios
├── parking/          # Lógica del sistema de parqueo
├── logs/             # Módulo de registro de logs
├── config/           # Configuración de entorno y bases de datos
├── main.ts           # Punto de entrada de la app
└── app.module.ts     # Módulo raíz
```
