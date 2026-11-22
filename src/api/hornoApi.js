import { http } from './http';

const datos = (r) => r.data.data;

export const hornoApi = {
  login: (usuario, password) => http.post('/auth/login', { usuario, password }).then(datos),
  me: () => http.get('/auth/me').then(datos),
  ultima: () => http.get('/lecturas/ultima').then(datos),
  serie: (desde, hasta) => http.get('/lecturas/serie', { params: { desde, hasta } }).then(datos),
  listar: ({ desde, hasta, pagina, tamano }) => http.get('/lecturas', { params: { desde, hasta, pagina, tamano } }).then(datos),
  excel: (desde, hasta) => http.get('/lecturas.xlsx', { params: { desde, hasta }, responseType: 'blob', timeout: 120000 }),
};
