export const API_BASE_URL = process.env.NODE_ENV === "production"
  ? "http://18.215.115.94:8000"  // URL para producción
  : "http://127.0.0.1:8000";     // URL para desarrollo
