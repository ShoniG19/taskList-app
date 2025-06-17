
# 📝 TaskList App

Una aplicación web para gestionar tus tareas diarias, desarrollada con un stack moderno: **React + TypeScript + Node.js + Express + Prisma + PostgreSQL**. Incluye autenticación, recuperación de contraseña vía email (SendGrid) y subida de avatar de usuario.

## 🚀 Demo en producción

Sitio web desplegado con vercel: [https://task-list-app-green.vercel.app](https://task-list-app-green.vercel.app)

> 📌 Registro y login funcionales. Puedes probar creando una cuenta o usando tu propia base de datos.

---

## 🧰 Tecnologías utilizadas

### 🔵 Frontend (React + Vite + TypeScript)
- Vite
- React Router
- Axios
- TailwindCSS
- Material UI

### 🟢 Backend (Node.js + Express + Prisma)
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (autenticación)
- Multer (subida de imágenes)
- SendGrid (recuperación de contraseña por email)
- CORS, Dotenv, Bcrypt, etc.


## 📂 Estructura del proyecto
```text
taskList-app/ 
├── backend/
│   ├── prisma/              # Migrations y schema de Prisma
│   │   └── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/          # Configuraciones paraa Cloudinary
│   │   ├── controllers/     # Lógica de los endpoints (auth, tareas)
│   │   ├── email/           # Utilidades para envío de correos
│   │   ├── middlewares/     # Middlewares (auth, uploads, etc.)
│   │   ├── routes/          # Rutas Express agrupadas por entidad
│   │   ├── index.ts         # Punto de entrada principal
│   │   └── prisma.ts        # Instancia de Prisma Client
│   ├── package.json, tsconfig.json, etc.
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # Funciones para consumir la API
│   │   ├── components/      # Componentes reutilizables (form, modal, etc.)
│   │   ├── locales/         # Traducciones i18n
│   │   ├── pages/           # Páginas principales (Login, Register, Home)
│   │   ├── types/           # Tipados globales
│   │   ├── utils/           # Funciones auxiliares
│   │   ├── App.tsx, main.tsx, i18n.ts
│   │   └── index.css, vite-env.d.ts
│   ├── tailwind.config.js, vite.config.ts, etc.
```

## 🔐 Funcionalidades

✅ Registro y login con JWT  
✅ Dashboard protegido por ruta privada  
✅ CRUD de tareas (crear, listar, actualizar, eliminar)  
✅ Filtro por estado de tareas  
✅ Subida de imagen de avatar  
✅ Recuperación de contraseña por email  
✅ Despliegue en Vercel y Render

---

## ⚙️ Instalación local

### 1. Clonar repositorio

```bash
git clone https://github.com/ShoniG19/taskList-app.git
cd taskList-app
```
### 2. Instalar dependencias
#### Frontend
```bash
cd frontend
npm install
npm run dev
```
#### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev 
```
> ⚠️ Asegúrate de tener PostgreSQL corriendo y configura `.env` en ambas carpetas.

## ✨ Capturas de pantalla
![Vista principal de la app](https://res.cloudinary.com/dcfsbzb0d/image/upload/v1750002163/Captura_de_pantalla_2025-06-14_210124_f4henn.png)

![Vista del dashboard](https://res.cloudinary.com/dcfsbzb0d/image/upload/v1750002162/Captura_de_pantalla_2025-06-14_210040_evavn4.png)

## 📧 Contacto

Hecho por [@ShoniG19](https://github.com/ShoniG19)

