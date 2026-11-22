import { describe, it, expect } from 'vitest';
import { estadoRegistro, formatearDuracion } from '@/utils/estado';

describe('estadoRegistro', () => {
  it.each([
    [null, 'sin-datos'], [0, 'ok'], [9, 'ok'], [10, 'alerta'], [30, 'alerta'], [31, 'critico'], [2000, 'critico'],
  ])('%s minutos → %s', (minutos, nivel) => {
    expect(estadoRegistro(minutos).nivel).toBe(nivel);
  });

  it('el texto crítico dice qué revisar', () => {
    expect(estadoRegistro(90).texto).toMatch(/1 h 30 min/);
    expect(estadoRegistro(90).texto).toMatch(/eServer/);
  });
});

describe('formatearDuracion', () => {
  it.each([[5, '5 min'], [60, '1 h'], [125, '2 h 5 min'], [1500, '1 d 1 h']])('%s → %s', (min, texto) => {
    expect(formatearDuracion(min)).toBe(texto);
  });
});
