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

### Backend
# Clona el repositorio
git clone https://github.com/agallego21/TFG-IncidenciasMunicipales.git

```bash
# Entra en la carpeta del backend
cd server

# Instala dependencias
npm install

# Arrancar el servidor
nodemon server.js

### Frontend

```bash
# Entra en la carpeta del frontend
cd client

# Instala dependencias
npm install

# Arrancar el servidor
npm run dev 
