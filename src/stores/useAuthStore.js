import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { sesion } from '@/api/http';
import { hornoApi } from '@/api/hornoApi';

// Momento (ms) en que vence el JWT, leído de su payload. 0 si no se puede leer.
function venceEn(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sesion.token());
  const usuario = ref(sesion.usuario());

  const iniciales = computed(() => {
    const nombre = usuario.value?.nombre || usuario.value?.usuario || '';
    return nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  });

  // Función y no computed: depende de la hora actual, no solo del token.
  const sesionVigente = () => Boolean(token.value) && venceEn(token.value) > Date.now();

  async function login(usuarioRed, password) {
    const d = await hornoApi.login(usuarioRed, password);
    sesion.guardar(d.token, d.user);
    token.value = d.token;
    usuario.value = d.user;
  }

  function logout() {
    sesion.limpiar();
    token.value = null;
    usuario.value = null;
  }

  return { token, usuario, iniciales, sesionVigente, login, logout };
});
