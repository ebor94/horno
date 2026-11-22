import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('@/api/hornoApi', () => ({ hornoApi: { login: vi.fn() } }));

import { hornoApi } from '@/api/hornoApi';
import { useAuthStore } from '@/stores/useAuthStore';

// Node 26 expone un localStorage experimental que no está disponible sin flag y oculta el de jsdom.
// Si el entorno no trae un localStorage utilizable, se usa un almacén en memoria.
if (typeof globalThis.localStorage?.clear !== 'function') {
  const almacen = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (k) => (almacen.has(k) ? almacen.get(k) : null),
    setItem: (k, v) => almacen.set(k, String(v)),
    removeItem: (k) => almacen.delete(k),
    clear: () => almacen.clear(),
  });
}

const tokenQueVence = (segundos) => {
  const exp = Math.floor(Date.now() / 1000) + segundos;
  return `cabecera.${btoa(JSON.stringify({ exp })).replace(/=+$/, '')}.firma`;
};

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('login guarda token y usuario y deja la sesión vigente', async () => {
    const token = tokenQueVence(3600);
    hornoApi.login.mockResolvedValue({ token, user: { usuario: 'jperez', nombre: 'Juan Pérez' } });
    const auth = useAuthStore();
    await auth.login('jperez', 'clave');
    expect(hornoApi.login).toHaveBeenCalledWith('jperez', 'clave');
    expect(auth.sesionVigente()).toBe(true);
    expect(localStorage.getItem('incol_token')).toBe(token);
    expect(auth.iniciales).toBe('JP');
  });

  it('un token vencido guardado no cuenta como sesión', () => {
    localStorage.setItem('incol_token', tokenQueVence(-60));
    expect(useAuthStore().sesionVigente()).toBe(false);
  });

  it('un token ilegible no cuenta como sesión', () => {
    localStorage.setItem('incol_token', 'no-es-un-jwt');
    expect(useAuthStore().sesionVigente()).toBe(false);
  });

  it('logout limpia el almacenamiento', async () => {
    hornoApi.login.mockResolvedValue({ token: tokenQueVence(3600), user: { usuario: 'jperez' } });
    const auth = useAuthStore();
    await auth.login('jperez', 'clave');
    auth.logout();
    expect(auth.sesionVigente()).toBe(false);
    expect(localStorage.getItem('incol_token')).toBeNull();
    expect(localStorage.getItem('incol_usuario')).toBeNull();
  });
});
