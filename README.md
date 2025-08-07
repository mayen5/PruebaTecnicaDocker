# 📁 Sistema de Gestión de Evidencias - DICRI

Este sistema permite gestionar expedientes e indicios recolectados por el personal técnico de la DICRI. Proporciona una interfaz web para el registro, consulta y generación de reportes, así como una API backend conectada a una base de datos SQL Server.

## 🚀 Funcionalidades principales

- Registro de expedientes
- Registro de indicios asociados a expedientes
- Gestión de usuarios con roles (técnico, coordinador)
- Consulta y edición de registros
- Generación de reportes en PDF filtrados por fecha y estado
- Autenticación y autorización basada en JWT

## 🛠️ Tecnologías utilizadas

### Frontend
- React + Vite
- TypeScript
- TailwindCSS
- jsPDF

### Backend
- Node.js + Express
- TypeScript
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- SQL Server como base de datos
- Docker para contenedores

## 📂 Estructura del proyecto

```
/
├── backend-evidencias/ # Backend (API REST con Express)
├── frontend-evidencias/ # Frontend (React + Tailwind)
├── docker/ # Scripts e inicialización de base de datos
├── docker-compose.yml # Orquestación de contenedores
└── .gitignore
```

## 🔧 Requisitos

- Docker
- Docker Compose

## 📥 Clonar el repositorio

```bash
git clone https://github.com/mayen5/PruebaTecnicaDocker.git
cd sistema-evidencias
```

## ▶️ Ejecutar el proyecto

```bash
docker-compose up --build
```

Esto ejecutará:

- SQL Server (con script de inicialización)
- Backend en [http://localhost:3001](http://localhost:3001)
- Frontend en [http://localhost:3000](http://localhost:3000)

## ✅ Acceso a la aplicación

Abre tu navegador en:

🔗 [http://localhost:3000](http://localhost:3000)

## 📦 Variables de entorno

Las variables de entorno ya están definidas en `docker-compose.yml`:

```env
DB_HOST=db
DB_USER=sa
DB_PASSWORD=Db@dm1n2025
DB_NAME=evidencias_db
DB_PORT=1433
PORT=3001
```

## 📝 Créditos

Desarrollado por Carmelo Mayén – 2025.