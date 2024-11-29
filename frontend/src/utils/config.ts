export const API_BASE_URL = process.env.NODE_ENV === "production"
  ? "https://administracionfacet.site"  // URL para producción
  : "http://127.0.0.1:8000";     // URL para desarrollo
