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

  it('sin conexión con el servidor no muestra "ok" aunque los minutos sean recientes', () => {
    expect(estadoRegistro(3, { sinConexion: true }).nivel).toBe('sin-conexion');
  });

  it('sin conexión sin lecturas previas sigue siendo "sin-conexion"', () => {
    expect(estadoRegistro(null, { sinConexion: true }).nivel).toBe('sin-conexion');
  });

  it('sin conexión devuelve el texto que indica que no se puede confirmar el registro', () => {
    expect(estadoRegistro(3, { sinConexion: true }).texto).toBe(
      'Sin conexión con el servidor: no se puede confirmar si el horno está registrando',
    );
  });

  it('sin opciones se comporta igual que con sinConexion false', () => {
    expect(estadoRegistro(3)).toEqual(estadoRegistro(3, { sinConexion: false }));
    expect(estadoRegistro(3).nivel).toBe('ok');
  });
});

describe('formatearDuracion', () => {
  it.each([[5, '5 min'], [60, '1 h'], [125, '2 h 5 min'], [1500, '1 d 1 h']])('%s → %s', (min, texto) => {
    expect(formatearDuracion(min)).toBe(texto);
  });
});
