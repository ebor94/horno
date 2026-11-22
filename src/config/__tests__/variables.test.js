import { describe, it, expect } from 'vitest';
import { VARIABLES, GRUPOS, etiquetaCompleta, formatear } from '@/config/variables';

const porCampo = (c) => VARIABLES.find((v) => v.campo === c);

describe('variables del horno', () => {
  it('son las 8 columnas de la API, cada una en un grupo existente', () => {
    expect(VARIABLES.map((v) => v.campo)).toEqual([
      'temp_combustion', 'temp_postcombustion', 'temp_chimenea', 'co', 'oxigeno', 'co_mg_m3', 'ccr', 'ccr_o2_ref',
    ]);
    const claves = GRUPOS.map((g) => g.clave);
    for (const v of VARIABLES) expect(claves).toContain(v.grupo);
  });

  it('etiqueta con unidad cuando la tiene', () => {
    expect(etiquetaCompleta(porCampo('co_mg_m3'))).toBe('CO (mg/m³)');
    expect(etiquetaCompleta(porCampo('ccr'))).toBe('Ccr');
  });

  it('formatea con los decimales de la variable y coma decimal', () => {
    expect(formatear(18.6, porCampo('oxigeno'))).toBe('18,60');
    expect(formatear(1234.56, porCampo('temp_combustion'))).toBe('1.234,6');
    expect(formatear(null, porCampo('oxigeno'))).toBe('—');
  });
});
