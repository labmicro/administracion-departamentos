import axios from "axios";
import { getCSRFToken } from "../utils/csrf";
import { API_BASE_URL } from "../utils/config"; // Asegúrate de importar API_BASE_URL correctamente

// Configuración de Axios con la URL dinámica
const API = axios.create({
    baseURL: API_BASE_URL,  // Usa la variable de entorno correcta
    withCredentials: true,  // Permite el envío de cookies
});

// Agregar automáticamente el CSRF Token en cada petición
API.interceptors.request.use((config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

export default API;
