import { mensajeDeError } from '@/api/http';

export function nombreDesdeCabecera(cabecera, porDefecto) {
  const m = /filename="?([^";]+)"?/i.exec(cabecera || '');
  return m ? m[1] : porDefecto;
}

export function descargarBlob(blob, nombre) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Con responseType 'blob' el JSON de error del backend llega como Blob.
export async function mensajeDeErrorBlob(err, porDefecto) {
  const datos = err?.response?.data;
  if (datos instanceof Blob) {
    try {
      const json = JSON.parse(await datos.text());
      if (json.message) return json.message;
    } catch {
      return porDefecto;
    }
    return porDefecto;
  }
  return mensajeDeError(err, porDefecto);
}
