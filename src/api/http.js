import axios from 'axios';

const CLAVE_TOKEN = 'incol_token';
const CLAVE_USUARIO = 'incol_usuario';

export const sesion = {
  token: () => localStorage.getItem(CLAVE_TOKEN),
  usuario() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_USUARIO) || 'null');
    } catch {
      return null;
    }
  },
  guardar(token, usuario) {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  },
  limpiar() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
  },
};

export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api/horno/v1', timeout: 30000 });

http.interceptors.request.use((config) => {
  const token = sesion.token();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Sesión vencida: el token no se renueva; se limpia y se vuelve al login.
http.interceptors.response.use((r) => r, (err) => {
  const esLogin = String(err.config?.url || '').includes('/auth/login');
  if (err.response?.status === 401 && !esLogin) {
    sesion.limpiar();
    const login = `${import.meta.env.BASE_URL}login`;
    if (!window.location.pathname.endsWith('/login')) window.location.assign(login);
  }
  return Promise.reject(err);
});

export function mensajeDeError(err, porDefecto = 'Ocurrió un error inesperado') {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder';
  if (err && !err.response) return 'No hay conexión con el servidor';
  return porDefecto;
}
