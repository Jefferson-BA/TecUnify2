# 🚀 TecUnify — Sistema de Gestión de Reservas de Espacios

TecUnify es una plataforma completa para la gestión de reservas de espacios en TECSUP, incluyendo autenticación, panel administrativo, vista de usuarios, horarios disponibles, IA integrada y dashboards.

Este README explica cómo instalar, configurar y desplegar el proyecto tanto en local como en producción.

---

## 📁 Estructura del Proyecto

```
TecUnify/
│
├── backend-admin/       # Backend para administración (Django)
├── backend-user/        # Backend principal (Spring Boot)
│   ├── src/main/java/com/tecunify/backend_user/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── events/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── uploads/
│   └── BackendUserApplication.java
│
└── frontend-web/        # Aplicación React + Vite
    ├── src/
    │   ├── admin/
    │   ├── dashboard/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   └── utils/
```

---

## 🛠️ 1. Requisitos Previos

### Backend
- Java 17 o superior
- Maven 3.9+
- PostgreSQL 14+
- Git

### Frontend
- Node.js 18 o superior
- npm o yarn
- Vite

---

## 🗄️ 2. Configuración del Backend

### 📌 2.1. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE tecunify;
```

### 📌 2.2. Configurar archivo `application.properties`

Editar:
- `backend-user/src/main/resources/application.properties`
- `backend-admin/src/main/resources/application.properties`

Agregar:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tecunify
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### 📌 2.3. Ejecutar el backend

#### Backend User
```bash
cd backend-user
mvn spring-boot:run
```

#### Backend Admin
```bash
cd backend-admin
mvn spring-boot:run
```

### Puertos recomendados

| Servicio | Puerto |
|----------|--------|
| backend-user | 8081 |
| backend-admin | 8082 |

---

## 💻 3. Configuración del Frontend

```bash
cd frontend-web
```

### 📌 3.1. Instalar dependencias

```bash
npm install
```

### 📌 3.2. Configurar variables de entorno

Crear archivo: `frontend-web/.env`

Agregar:

```env
VITE_API_URL=http://localhost:8081
VITE_ADMIN_API_URL=http://localhost:8082
VITE_AI_API_URL=http://localhost:8081/api/ia/chat
GOOGLE_CLIENT_ID=TU_CLIENT_ID
```

### 📌 3.3. Ejecutar la app

```bash
npm run dev
```

La aplicación abre en: **http://localhost:5173**

---

## 🌐 4. Despliegue en Producción

### 🚀 4.1. Desplegar Backend en Render / Railway / AWS

Construir el backend:

```bash
mvn clean package -DskipTests
```

Se generará:
- `backend-user/target/backend-user.jar`
- `backend-admin/target/backend-admin.jar`

Subir a tu servicio elegido (AWS EC2, Render, Railway).

#### Variables necesarias en producción:

```env
DATABASE_URL=jdbc:postgresql://...
DATABASE_USER=...
DATABASE_PASSWORD=...
SPRING_PROFILES_ACTIVE=prod
```

### 🚀 4.2. Desplegar Frontend en Vercel / Netlify

Build:

```bash
npm run build
```

Esto genera: `dist/`

Subes esa carpeta a tu proveedor.

#### Variables en producción (Vercel → Project Settings → Environment Variables)

```env
VITE_API_URL=https://TU_BACKEND_USER
VITE_ADMIN_API_URL=https://TU_BACKEND_ADMIN
GOOGLE_CLIENT_ID=TU_ID
```

---

## 🧪 5. Pruebas del sistema

### Backend

Swagger UI:
- http://localhost:8081/swagger-ui.html
- http://localhost:8082/swagger-ui.html

### Frontend

- Probar login
- Registrar reservas
- Ver dashboard admin
- Ver IA integrada (chat automático)
- Ver horarios por espacio

---

## 🧠 6. Integración con IA (Chat IA)

Si usas OpenAI / HuggingFace:

Configurar en `.env`:

```env
VITE_AI_API_URL=http://localhost:8081/api/ia/chat
```

Backend usa un service: `TeclaIAService.java`

---

## 🧹 7. Scripts útiles

### Borrar node_modules
```bash
rm -rf node_modules
npm install
```

### Borrar target de Maven
```bash
mvn clean
```

### Generar build completo
```bash
mvn clean package
npm run build
```

---

## 👤 8. Autores

- Jefferson Bautista Aguilera
- Julio Medrano Yupanqui
- Carlos Valeriano Colan

Proyecto realizado para **TECSUP** — Diseño y Desarrollo de Software.