# 🏙️ Desarrollo de un portal web para la colaboración ciudadana en la identificación y comunicación a Ayuntamientos de incidencias urbanas
**👤 Autor** Antonio Gallego Tejado

**Trabajo Fin de Grado – Grado en Ingeniería Informática**

Universidad Internacional de La Rioja

Escuela Superior de Ingeniería y Tecnología 


## 📄 Licencia
Este proyecto está licenciado bajo la MIT License (Ver [LICENSE](./LICENSE)).

## 📌 Descripción del proyecto

En la actualidad, las Tecnologías de la Información y la Comunicación (TIC) juegan un papel fundamental en la transformación de la Administración pública, acercándola a los ciudadanos y contribuyendo a una mayor participación de estos en las labores de gobernanza. En este contexto, la participación ciudadana se erige como un elemento fundamental para la transformación de las ciudades en espacios más sostenibles y habitables.

Este trabajo plantea el desarrollo de una aplicación web orientada a facilitar un canal de colaboración directa entre la ciudadanía y ayuntamientos, permitiendo el registro y comunicación de incidencias urbanas de forma precisa a través de elementos como datos, imágenes y geolocalización. 

Con este desarrollo se busca no solo agilizar la reparación de desperfectos en el entorno urbano, sino también promover un modelo de gobierno mucho más abierto, eficiente y orientado al bienestar colectivo.

El desarrollo del proyecto se ha basado en la metodología del **Proceso Unificado de Desarrollo de Software**, cubriendo todas sus fases: concepción, elaboración, construcción, transición y producción. Se ha priorizado el uso de **tecnologías de código libre**, fomentando un desarrollo ágil, mantenible y sostenible a largo plazo.

---

## 🧩 Tecnologías utilizadas

Proyecto desarrollado con **MERN Stack**:

- ⚛️ React (frontend)
- 🌐 Node.js + Express (backend)
- 🍃 MongoDB (base de datos)
- 🗺️ Leaflet + react-leaflet (geolocalización y mapas)

---

## ✨ Funcionalidades principales

- 🏛️ Aplicación multi-ayuntamiento con carga dinámica de configuración
- 👤 Gestión de usuarios (administradores, técnicos, ciudadanos)
- 📍 Visualización de incidencias en el mapa del municipio
- 🛠️ Gestión de incidencias por parte de los técnicos municipales
- 📸 Subida de imágenes asociadas a las incidencias
- 🔍 Filtros por estado, tipo y municipio

---

## 🚀 Instalación y ejecución local

### Clona el repositorio
git clone https://github.com/agallego21/TFG-IncidenciasMunicipales.git

### Backend
```bash
# Entra en la carpeta del backend
cd server

# Instala dependencias
npm install

# Arrancar el servidor
nodemon server.js
```

### Frontend

```bash
# Entra en la carpeta del frontend
cd client

# Instala dependencias
npm install

# Arrancar el servidor
npm run dev
```

## 📦 Dependencias del proyecto

### 🔧 Backend (`/server`)

| Paquete     | Versión   | Descripción                                         |
|-------------|-----------|-----------------------------------------------------|
| `express`   | 5.1.0     | Framework web para Node.js                          |
| `mongoose`  | 8.14.1    | ODM para conectar con MongoDB desde Node.js         |
| `bcrypt`    | 6.0.0     | Cifrado de contraseñas                              |
| `cors`      | 2.8.5     | Middleware para habilitar CORS                      |
| `multer`    | 2.0.1     | Middleware para subir archivos                      |

---

### 💻 Frontend (`/client`)

| Paquete                          | Versión   | Descripción                                         |
|----------------------------------|-----------|-----------------------------------------------------|
| `react`                          | 19.1.0    | Librería para construir interfaces de usuario       |
| `react-dom`                      | 19.1.0    | Soporte DOM para React                              |
| `react-router-dom`               | 7.6.1     | Enrutamiento en React                               |
| `axios`                          | 1.9.0     | Cliente HTTP para consumir APIs                     |
| `vite`                           | 6.3.4     | Empaquetador moderno y rápido para proyectos web    |
| `@vitejs/plugin-react`           | 4.4.1     | Plugin oficial de React para Vite                   |
| `bootstrap`                      | 5.3.6     | Framework de estilos CSS                            |
| `react-bootstrap`                | 2.10.10   | Componentes de Bootstrap adaptados a React          |
| `react-icons`                    | 5.5.0     | Colección de iconos para React                      |
| `leaflet`                        | 1.9.4     | Librería de mapas interactivos                      |
| `react-leaflet`                  | 5.0.0     | Envoltorio de Leaflet para React                    |
| `leaflet-color-markers`          | 0.1.0     | Marcadores personalizados para Leaflet              |
| `@types/react`                   | 19.1.2    | Tipado de React para TypeScript                     |
| `@types/react-dom`               | 19.1.3    | Tipado de React DOM para TypeScript                 |
| `eslint`                         | 9.26.0    | Linter de JavaScript                                |
| `@eslint/js`                     | 9.26.0    | Configuración base para ESLint                      |
| `eslint-plugin-react-hooks`      | 5.2.0     | Reglas de ESLint para hooks de React                |
| `eslint-plugin-react-refresh`    | 0.4.20    | Reglas para hot reload con React Refresh            |
| `globals`                        | 16.0.0    | Conjuntos de variables globales para linters        |

---
