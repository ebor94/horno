import { describe, it, expect, vi } from 'vitest';
import { nombreDesdeCabecera, descargarBlob, mensajeDeErrorBlob } from '@/utils/descarga';

// jsdom (usado por Vitest) no implementa Blob.prototype.text(); los navegadores sí.
// Este parche solo existe en la prueba; descarga.js no cambia.
if (!Blob.prototype.text) {
  Blob.prototype.text = function texto() {
    return new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onload = () => resolver(lector.result);
      lector.onerror = () => rechazar(lector.error);
      lector.readAsText(this);
    });
  };
}

describe('descarga', () => {
  it('toma el nombre del Content-Disposition', () => {
    expect(nombreDesdeCabecera('attachment; filename="horno_incol_20261101_20261122.xlsx"', 'x.xlsx'))
      .toBe('horno_incol_20261101_20261122.xlsx');
    expect(nombreDesdeCabecera(undefined, 'x.xlsx')).toBe('x.xlsx');
  });

  it('lee el mensaje de error que viene dentro de un Blob', async () => {
    const data = new Blob([JSON.stringify({ success: false, message: 'Reduce el rango.' })], { type: 'application/json' });
    expect(await mensajeDeErrorBlob({ response: { status: 413, data } }, 'otro')).toBe('Reduce el rango.');
    expect(await mensajeDeErrorBlob({ response: { status: 500, data: new Blob(['<html>']) } }, 'otro')).toBe('otro');
  });

  it('descarga con un enlace temporal', () => {
    URL.createObjectURL = vi.fn(() => 'blob:x');
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    descargarBlob(new Blob(['a']), 'archivo.xlsx');
    expect(click).toHaveBeenCalled();
    expect(document.querySelector('a[download]')).toBeNull();
  });
});
