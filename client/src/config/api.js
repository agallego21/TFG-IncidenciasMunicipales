
//URL Base con el nombre y puerto del server
const BASE_URL = 'http://localhost:5005';

export const API_REST_CONSTANTS = {
  BASE_URL,
  ENDPOINTS: {
    USUARIOS: `${BASE_URL}/usuarios`,
    USUARIO_LOGIN: `${BASE_URL}/usuarios/login`,    
    USUARIOS_POR_EMAIL: (email) =>
      `${BASE_URL}/usuarios?email=${encodeURIComponent(email)}`,
    TIPOS_USUARIO: `${BASE_URL}/tiposUsuario`,
    INCIDENCIAS: `${BASE_URL}/incidencias`,
    INCIDENCIAS_AYTO: `${BASE_URL}/incidencias/ayuntamiento`,
    TIPOS_INCIDENCIA: `${BASE_URL}/tiposIncidencia`,
    ESTADOS_INCIDENCIA: `${BASE_URL}/estadosIncidencia`,
    IMAGEN: (path) => 
      `${BASE_URL}/${path}`, // para usar con imágenes
    AYUNTAMIENTOS: `${BASE_URL}/ayuntamientos`,
  },
};