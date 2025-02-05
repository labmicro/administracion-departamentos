import axios from "axios";
import { getCSRFToken } from "../utils/csrf";

const API = axios.create({
    baseURL: "https://administracionfacet.site",
    withCredentials: true, // Permite que se envíen cookies de sesión en las solicitudes
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
