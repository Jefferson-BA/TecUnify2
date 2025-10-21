# 🚀 TecUnify - Frontend + Backend Setup

## 📋 **INSTRUCCIONES COMPLETAS PARA EJECUTAR EL PROYECTO**

### 🔧 **PREREQUISITOS**
- Java 17 o superior
- Maven 3.6+
- Node.js 16+ y npm
- PostgreSQL (puerto 5432)
- Base de datos: `backend_user`

---

## 🎯 **PASO 1: CONFIGURAR BASE DE DATOS**

### Crear base de datos PostgreSQL:
```sql
CREATE DATABASE backend_user;
```

### Configurar usuario (opcional):
```sql
CREATE USER postgres WITH PASSWORD 'NuevaPassword123';
GRANT ALL PRIVILEGES ON DATABASE backend_user TO postgres;
```

---

## 🎯 **PASO 2: EJECUTAR BACKEND (Spring Boot)**

### Abrir terminal 1:
```bash
# Navegar al directorio del backend
cd C:\TecUnify1.2\backend-user

# Ejecutar el backend
mvn spring-boot:run
```

**✅ Backend estará disponible en:** `http://localhost:8081`

**📚 Documentación API:** `http://localhost:8081/swagger-ui.html`

---

## 🎯 **PASO 3: EJECUTAR FRONTEND (React + Vite)**

### Abrir terminal 2:
```bash
# Navegar al directorio del frontend
cd C:\TecUnify1.2\frontend-web

# Instalar dependencias (solo la primera vez)
npm install

# Ejecutar el frontend
npm run dev
```

**✅ Frontend estará disponible en:** `http://localhost:5173`

---

## 🎯 **PASO 4: PROBAR LA APLICACIÓN**

### 1. **Abrir navegador en:** `http://localhost:5173`

### 2. **Probar registro de usuario:**
- Click en "Registrarse"
- Llenar formulario con datos de prueba
- Verificar que se registre correctamente

### 3. **Probar login:**
- Click en "Iniciar Sesión"
- Usar las credenciales del usuario registrado
- Verificar que inicie sesión correctamente

---

## 🔗 **ENDPOINTS DISPONIBLES**

### **Backend (http://localhost:8081):**
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/validate` - Validar token
- `GET /api/users` - Listar usuarios
- `GET /api/espacios` - Listar espacios
- `GET /api/reservas` - Listar reservas

### **Frontend (http://localhost:5173):**
- `/` - Página principal
- Login y registro funcionales
- Interfaz de reservas

---

## 🛠️ **COMANDOS ÚTILES**

### **Backend:**
```bash
# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Crear JAR
mvn clean package

# Ejecutar JAR
java -jar target/backend-user-0.0.1-SNAPSHOT.jar
```

### **Frontend:**
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error de conexión a base de datos:**
- Verificar que PostgreSQL esté ejecutándose
- Verificar credenciales en `application.yml`
- Verificar que la base de datos `backend_user` exista

### **Error de CORS:**
- El proxy de Vite está configurado automáticamente
- Si hay problemas, verificar que ambos servidores estén ejecutándose

### **Error de puerto ocupado:**
- Backend: cambiar puerto en `application.yml` (server.port)
- Frontend: cambiar puerto en `vite.config.js` (server.port)

---

## 📱 **FUNCIONALIDADES IMPLEMENTADAS**

### ✅ **Backend:**
- API REST completa con Spring Boot
- Autenticación de usuarios
- CRUD de usuarios, espacios y reservas
- Documentación con Swagger
- CORS configurado
- Base de datos PostgreSQL

### ✅ **Frontend:**
- Interfaz React moderna con Tailwind CSS
- Páginas de login y registro
- Conexión con backend via API
- Manejo de estado de usuario
- Diseño responsive

---

## 🎉 **¡LISTO!**

Tu aplicación TecUnify está completamente funcional con:
- **Backend:** Spring Boot + PostgreSQL
- **Frontend:** React + Vite + Tailwind CSS
- **Comunicación:** API REST + Axios
- **Documentación:** Swagger UI

**¡Disfruta desarrollando!** 🚀
