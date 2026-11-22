// Semáforo del registro según los minutos desde la última lectura (la HMI registra cada ~4 min).
export function formatearDuracion(min) {
  if (min < 60) return `${min} min`;
  const horas = Math.floor(min / 60);
  const resto = min % 60;
  if (horas < 24) return resto ? `${horas} h ${resto} min` : `${horas} h`;
  return `${Math.floor(horas / 24)} d ${horas % 24} h`;
}

export function estadoRegistro(minutos) {
  if (minutos === null || minutos === undefined) return { nivel: 'sin-datos', texto: 'Aún no hay lecturas registradas' };
  if (minutos < 10) return { nivel: 'ok', texto: 'Registrando con normalidad' };
  if (minutos <= 30) return { nivel: 'alerta', texto: `Sin datos nuevos hace ${minutos} min` };
  return { nivel: 'critico', texto: `Sin datos hace ${formatearDuracion(minutos)}: revisar la HMI, eServer y la copia al servidor` };
}
