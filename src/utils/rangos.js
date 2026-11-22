// Rangos de fecha en hora local del navegador (la planta y los usuarios están en Colombia, igual que la base).
import dayjs from 'dayjs';

export const FORMATO = 'YYYY-MM-DD HH:mm:ss';

export const PRESETS = [
  { clave: 'hoy', texto: 'Hoy' },
  { clave: '24h', texto: '24 h' },
  { clave: '7d', texto: '7 días' },
  { clave: '30d', texto: '30 días' },
];

export function rangoPreset(clave, ahora = dayjs()) {
  const inicios = {
    hoy: () => ahora.startOf('day'),
    '24h': () => ahora.subtract(24, 'hour'),
    '7d': () => ahora.subtract(7, 'day'),
    '30d': () => ahora.subtract(30, 'day'),
  };
  if (!inicios[clave]) throw new Error(`Rango desconocido: ${clave}`);
  return { desde: inicios[clave]().format(FORMATO), hasta: ahora.format(FORMATO) };
}

export function rangoPersonalizado(desdeLocal, hastaLocal) {
  const desde = dayjs(desdeLocal);
  const hasta = dayjs(hastaLocal);
  if (!desdeLocal || !hastaLocal || !desde.isValid() || !hasta.isValid()) return { error: 'Indica la fecha inicial y la final' };
  if (hasta.isBefore(desde)) return { error: 'La fecha final debe ser posterior a la inicial' };
  if (hasta.diff(desde, 'day', true) > 366) return { error: 'El rango no puede superar 366 días' };
  return { desde: desde.format(FORMATO), hasta: hasta.format(FORMATO) };
}

export const aInputLocal = (texto) => dayjs(texto).format('YYYY-MM-DDTHH:mm');
