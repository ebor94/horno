# incol-frontend

Monitoreo, gráficas y descarga de las lecturas del horno INCOL. API: módulo `/api/horno/v1` de mantix-backend.

- `npm run dev` — http://localhost:5174/incol/ (proxy de /api a localhost:3020)
- `npm test` — pruebas (Vitest)
- `npm run build` — genera `dist/`; copiar su contenido (incluido `.htaccess`) a `\\192.9.17.11\AppServ\www\incol\`

Acceso: usuarios del grupo `INCOL_APP` del directorio activo.
