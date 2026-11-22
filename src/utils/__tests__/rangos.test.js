import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { rangoPreset, rangoPersonalizado, aInputLocal } from '@/utils/rangos';

const AHORA = dayjs('2026-11-22 14:30:15');

describe('rangoPreset', () => {
  it.each([
    ['hoy', '2026-11-22 00:00:00'],
    ['24h', '2026-11-21 14:30:15'],
    ['7d', '2026-11-15 14:30:15'],
    ['30d', '2026-10-23 14:30:15'],
  ])('%s empieza en %s y termina ahora', (clave, desde) => {
    expect(rangoPreset(clave, AHORA)).toEqual({ desde, hasta: '2026-11-22 14:30:15' });
  });

  it('rechaza una clave desconocida', () => {
    expect(() => rangoPreset('1año', AHORA)).toThrow(/desconocido/);
  });
});

describe('rangoPersonalizado', () => {
  it('convierte los valores de datetime-local', () => {
    expect(rangoPersonalizado('2026-11-01T06:00', '2026-11-02T18:30')).toEqual({
      desde: '2026-11-01 06:00:00', hasta: '2026-11-02 18:30:00',
    });
  });

  it.each([
    ['', '2026-11-02T18:30', /Indica/],
    ['2026-11-03T00:00', '2026-11-02T00:00', /posterior/],
    ['2025-01-01T00:00', '2026-11-02T00:00', /366/],
  ])('rechaza %s → %s', (d, h, mensaje) => {
    expect(rangoPersonalizado(d, h).error).toMatch(mensaje);
  });
});

it('aInputLocal da el formato de datetime-local', () => {
  expect(aInputLocal('2026-11-22 14:30:15')).toBe('2026-11-22T14:30');
});
