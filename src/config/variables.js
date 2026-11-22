// Las 8 variables del horno (mismos campos que la API /api/horno/v1).
export const VARIABLES = [
  { campo: 'temp_combustion', etiqueta: 'Temp. combustión', unidad: '°C', decimales: 1, color: '#dc2626', grupo: 'temperaturas' },
  { campo: 'temp_postcombustion', etiqueta: 'Temp. postcombustión', unidad: '°C', decimales: 1, color: '#f59e0b', grupo: 'temperaturas' },
  { campo: 'temp_chimenea', etiqueta: 'Temp. chimenea', unidad: '°C', decimales: 1, color: '#6b7280', grupo: 'temperaturas' },
  { campo: 'co', etiqueta: 'CO', unidad: 'ppm', decimales: 1, color: '#7c3aed', grupo: 'gases', eje: 'y' },
  { campo: 'oxigeno', etiqueta: 'Oxígeno', unidad: '%', decimales: 2, color: '#00875c', grupo: 'gases', eje: 'y1' },
  { campo: 'co_mg_m3', etiqueta: 'CO', unidad: 'mg/m³', decimales: 3, color: '#2563eb', grupo: 'gases', eje: 'y' },
  { campo: 'ccr', etiqueta: 'Ccr', unidad: null, decimales: 1, color: '#005a3d', grupo: 'ccr' },
  { campo: 'ccr_o2_ref', etiqueta: 'Ccr O2 ref.', unidad: null, decimales: 1, color: '#1ab37d', grupo: 'ccr' },
];

export const GRUPOS = [
  { clave: 'temperaturas', titulo: 'Temperaturas' },
  { clave: 'gases', titulo: 'Gases: CO y oxígeno' },
  { clave: 'ccr', titulo: 'Ccr y Ccr O2 ref.' },
];

export const etiquetaCompleta = (v) => (v.unidad ? `${v.etiqueta} (${v.unidad})` : v.etiqueta);

export function formatear(valor, v) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return '—';
  return Number(valor).toLocaleString('es-CO', { minimumFractionDigits: v.decimales, maximumFractionDigits: v.decimales });
}
